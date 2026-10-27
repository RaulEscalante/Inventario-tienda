
import { prisma } from "../config/prisma.js";

export async function listarCategorias({ active } = {}) {
  const where = {};

  if (typeof active === "boolean") {
    where.active = active;
  }

  return prisma.category.findMany({
    where,
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function obtenerCategoriaPorId(id) {
  return prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function crearCategoria(name) {
  return prisma.category.create({
    data: {
      name,
      active: true,
    },
  });
}

export async function actualizarCategoria(id, name) {
  return prisma.category.update({
    where: { id },
    data: { name },
  });
}

export async function cambiarEstadoCategoria(id, active) {
  return prisma.category.update({
    where: { id },
    data: { active },
  });
}
