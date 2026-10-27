
import { prisma } from "../config/prisma.js";

export async function listarProductos({ buscar, activo, categoriaId }) {
  const where = {};

  if (buscar) {
    where.OR = [
      { sku: { contains: buscar, mode: "insensitive" } },
      { name: { contains: buscar, mode: "insensitive" } },
    ];
  }

  if (typeof activo === "boolean") {
    where.active = activo;
  }

  if (categoriaId !== undefined) {
    where.categoryId = categoriaId;
  }

  return prisma.product.findMany({
    where,
    include: {
      category: {
        select: { id: true, name: true },
      },
      inventories: {
        select: {
          quantity: true,
          warehouse: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function obtenerProductoPorId(id) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, name: true },
      },
      inventories: {
        select: {
          quantity: true,
          warehouse: {
            select: { id: true, name: true },
          },
        },
      },
      _count: {
        select: {
          inventories: true,
          movements: true,
          barcodes: true,
        },
      },
    },
  });
}

async function comprobarCategoriaActiva(categoryId) {
  if (categoryId === null || categoryId === undefined) {
    return;
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, active: true },
  });

  if (!category || !category.active) {
    const error = new Error(
      "La categoría indicada no existe o está inactiva."
    );
    error.code = "INVALID_CATEGORY";
    throw error;
  }
}

export async function crearProducto(datos) {
  await comprobarCategoriaActiva(datos.categoryId);

  return prisma.product.create({
    data: {
      sku: datos.sku,
      name: datos.name,
      description: datos.description ?? null,
      purchasePrice: datos.purchasePrice,
      salePrice: datos.salePrice,
      categoryId: datos.categoryId ?? null,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function actualizarProducto(id, datos) {
  if (datos.categoryId !== undefined) {
    await comprobarCategoriaActiva(datos.categoryId);
  }

  return prisma.product.update({
    where: { id },
    data: {
      ...(datos.sku !== undefined && { sku: datos.sku }),
      ...(datos.name !== undefined && { name: datos.name }),
      ...(datos.description !== undefined && {
        description: datos.description,
      }),
      ...(datos.purchasePrice !== undefined && {
        purchasePrice: datos.purchasePrice,
      }),
      ...(datos.salePrice !== undefined && {
        salePrice: datos.salePrice,
      }),
      ...(datos.categoryId !== undefined && {
        categoryId: datos.categoryId,
      }),
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function cambiarEstadoProducto(id, active) {
  return prisma.product.update({
    where: { id },
    data: { active },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function eliminarProducto(id) {
  const producto = await prisma.product.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          inventories: true,
          movements: true,
          barcodes: true,
        },
      },
    },
  });

  if (!producto) {
    const error = new Error("El producto no existe.");
    error.code = "P2025";
    throw error;
  }

  const tieneRegistros =
    producto._count.inventories > 0 ||
    producto._count.movements > 0 ||
    producto._count.barcodes > 0;

  if (tieneRegistros) {
    const error = new Error(
      "No se puede eliminar el producto porque tiene registros de inventario, movimientos o códigos de barras asociados."
    );
    error.code = "PRODUCT_HAS_HISTORY";
    throw error;
  }

  return prisma.product.delete({
    where: { id },
  });
}
