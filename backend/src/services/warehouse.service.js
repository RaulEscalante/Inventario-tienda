
import { prisma } from "../config/prisma.js";

export async function listarAlmacenes({ active, search } = {}) {
  const where = {};

  if (typeof active === "boolean") {
    where.active = active;
  }

  if (typeof search === "string" && search.trim()) {
    where.name = {
      contains: search.trim(),
      mode: "insensitive",
    };
  }

  return prisma.warehouse.findMany({
    where,
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          inventories: true,
          movements: true,
        },
      },
    },
  });
}

export async function obtenerAlmacenPorId(id) {
  return prisma.warehouse.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          inventories: true,
          movements: true,
        },
      },
    },
  });
}

export async function crearAlmacen(name) {
  return prisma.warehouse.create({
    data: {
      name,
      active: true,
    },
  });
}

export async function actualizarAlmacen(id, name) {
  return prisma.warehouse.update({
    where: { id },
    data: { name },
  });
}

export async function cambiarEstadoAlmacen(id, active) {
  return prisma.warehouse.update({
    where: { id },
    data: { active },
  });
}
