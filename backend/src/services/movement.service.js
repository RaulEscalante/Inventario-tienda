
import { prisma } from "../config/prisma.js";

export async function listarMovimientos({
  productId,
  warehouseId,
  type,
  from,
  to,
  page = 1,
  pageSize = 20,
}) {
  const where = {};

  if (productId !== undefined) {
    where.productId = productId;
  }

  if (warehouseId !== undefined) {
    where.warehouseId = warehouseId;
  }

  if (type !== undefined) {
    where.type = type;
  }

  if (from || to) {
    where.createdAt = {};

    if (from) {
      where.createdAt.gte = new Date(`${from}T00:00:00.000Z`);
    }

    if (to) {
      const fechaExclusiva = new Date(`${to}T00:00:00.000Z`);
      fechaExclusiva.setUTCDate(fechaExclusiva.getUTCDate() + 1);
      where.createdAt.lt = fechaExclusiva;
    }
  }

  const skip = (page - 1) * pageSize;

  const [movimientos, total] = await prisma.$transaction([
    prisma.inventoryMovement.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            sku: true,
            name: true,
          },
        },
        warehouse: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
      skip,
      take: pageSize,
    }),
    prisma.inventoryMovement.count({ where }),
  ]);

  return {
    movimientos,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
