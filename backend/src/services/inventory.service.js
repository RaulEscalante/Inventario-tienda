
import { prisma } from "../config/prisma.js";

const incluirDetalles = {
  product: {
    select: {
      id: true,
      sku: true,
      name: true,
      purchasePrice: true,
      salePrice: true,
      active: true,
      category: {
        select: { id: true, name: true },
      },
      brand: {
        select: { id: true, name: true },
      },
    },
  },
  warehouse: {
    select: {
      id: true,
      name: true,
      active: true,
    },
  },
};

function crearError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

// Listar existencias con filtros opcionales.
export async function listarInventario({
  search,
  warehouseId,
  categoryId,
  brandId,
} = {}) {
  const AND = [];

  if (warehouseId !== undefined) {
    AND.push({ warehouseId });
  }

  if (categoryId !== undefined) {
    AND.push({
      product: { is: { categoryId } },
    });
  }

  if (brandId !== undefined) {
    AND.push({
      product: { is: { brandId } },
    });
  }

  if (search?.trim()) {
    const termino = search.trim();

    AND.push({
      OR: [
        {
          product: {
            is: {
              name: {
                contains: termino,
                mode: "insensitive",
              },
            },
          },
        },
        {
          product: {
            is: {
              sku: {
                contains: termino,
                mode: "insensitive",
              },
            },
          },
        },
        {
          product: {
            is: {
              brand: {
                is: {
                  name: {
                    contains: termino,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
      ],
    });
  }

  return prisma.inventory.findMany({
    where: AND.length ? { AND } : {},
    include: incluirDetalles,
    orderBy: [
      { product: { name: "asc" } },
      { warehouse: { name: "asc" } },
    ],
  });
}

// Consultar una existencia por su ID.
export async function obtenerInventarioPorId(id) {
  return prisma.inventory.findUnique({
    where: { id },
    include: incluirDetalles,
  });
}

// Registrar las existencias iniciales de un producto en un almacén.
export async function registrarIngresoInicial({
  productId,
  warehouseId,
  quantity,
  reason,
  userId,
}) {
  return prisma.$transaction(
    async (tx) => {
      const producto = await tx.product.findUnique({
        where: { id: productId },
        select: { id: true, active: true },
      });

      if (!producto) {
        throw crearError(
          "INVALID_PRODUCT",
          "El producto no existe."
        );
      }

      if (!producto.active) {
        throw crearError(
          "INACTIVE_PRODUCT",
          "No se pueden registrar existencias iniciales para un producto inactivo."
        );
      }

      const almacen = await tx.warehouse.findUnique({
        where: { id: warehouseId },
        select: { id: true, active: true },
      });

      if (!almacen) {
        throw crearError(
          "INVALID_WAREHOUSE",
          "El almacén no existe."
        );
      }

      if (!almacen.active) {
        throw crearError(
          "INACTIVE_WAREHOUSE",
          "No se pueden registrar existencias iniciales en un almacén inactivo."
        );
      }

      const existente = await tx.inventory.findUnique({
        where: {
          productId_warehouseId: {
            productId,
            warehouseId,
          },
        },
      });

      if (existente) {
        throw crearError(
          "INVENTORY_EXISTS",
          "Este producto ya tiene un registro de inventario en ese almacén. Utiliza un ajuste o registra un nuevo ingreso."
        );
      }

      const inventario = await tx.inventory.create({
        data: {
          productId,
          warehouseId,
          quantity,
        },
        include: incluirDetalles,
      });

      await tx.inventoryMovement.create({
        data: {
          productId,
          warehouseId,
          type: "INITIAL",
          previousQuantity: 0,
          newQuantity: quantity,
          quantityDelta: quantity,
          reason: reason || "Registro de existencias iniciales",
          userId,
        },
      });

      return inventario;
    },
    { isolationLevel: "Serializable" }
  );
}

// Ajustar la cantidad al resultado de un conteo físico.
export async function ajustarInventario({
  inventoryId,
  newQuantity,
  reason,
  userId,
}) {
  return prisma.$transaction(
    async (tx) => {
      const existente = await tx.inventory.findUnique({
        where: { id: inventoryId },
      });

      if (!existente) {
        throw crearError(
          "INVENTORY_NOT_FOUND",
          "El registro de inventario no existe."
        );
      }

      const previousQuantity = existente.quantity;
      const quantityDelta = newQuantity - previousQuantity;

      if (quantityDelta === 0) {
        throw crearError(
          "NO_STOCK_CHANGE",
          "La nueva cantidad coincide con la cantidad actual. No es necesario registrar un ajuste."
        );
      }

      const inventario = await tx.inventory.update({
        where: { id: inventoryId },
        data: { quantity: newQuantity },
        include: incluirDetalles,
      });

      await tx.inventoryMovement.create({
        data: {
          productId: existente.productId,
          warehouseId: existente.warehouseId,
          type: "ADJUSTMENT",
          previousQuantity,
          newQuantity,
          quantityDelta,
          reason: reason || "Ajuste de inventario por conteo físico",
          userId,
        },
      });

      return inventario;
    },
    { isolationLevel: "Serializable" }
  );
}
