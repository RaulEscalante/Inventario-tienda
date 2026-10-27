
import { prisma } from "../config/prisma.js";

export async function getBrands({ search, active } = {}) {
  const where = {};

  if (search?.trim()) {
    where.name = {
      contains: search.trim(),
      mode: "insensitive",
    };
  }

  if (typeof active === "boolean") {
    where.active = active;
  }

  return prisma.brand.findMany({
    where,
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getBrandById(id) {
  return prisma.brand.findUnique({
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

export async function createBrand(data) {
  return prisma.brand.create({
    data: {
      name: data.name.trim(),
    },
  });
}

export async function updateBrand(id, data) {
  return prisma.brand.update({
    where: { id },
    data: {
      name: data.name.trim(),
    },
  });
}

export async function updateBrandStatus(id, active) {
  return prisma.brand.update({
    where: { id },
    data: { active },
  });
}
