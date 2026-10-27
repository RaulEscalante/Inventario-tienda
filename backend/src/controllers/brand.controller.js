
import { getBrands, getBrandById, createBrand, updateBrand, updateBrandStatus, } from "../services/brand.service.js";

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function handlePrismaError(res, error) {
  if (error.code === "P2002") {
    return res.status(409).json({
      message: "Ya existe una marca con ese nombre.",
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      message: "La marca no existe.",
    });
  }

  console.error("Error en marcas:", error);

  return res.status(500).json({
    message: "Error interno del servidor.",
  });
}

export async function listBrands(req, res) {
  try {
    const { search, active } = req.query;
    let activeFilter;

    if (active !== undefined) {
      if (active !== "true" && active !== "false") {
        return res.status(400).json({
          message: "El filtro active debe ser true o false.",
        });
      }

      activeFilter = active === "true";
    }

    const brands = await getBrands({
      search,
      active: activeFilter,
    });

    return res.status(200).json(brands);
  } catch (error) {
    return handlePrismaError(res, error);
  }
}

export async function getBrand(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "El ID de la marca debe ser un entero positivo.",
    });
  }

  try {
    const brand = await getBrandById(id);

    if (!brand) {
      return res.status(404).json({
        message: "La marca no existe.",
      });
    }

    return res.status(200).json(brand);
  } catch (error) {
    return handlePrismaError(res, error);
  }
}

export async function postBrand(req, res) {
  const { name } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      message: "El nombre de la marca es obligatorio.",
    });
  }

  if (name.trim().length > 100) {
    return res.status(400).json({
      message: "El nombre de la marca no puede superar los 100 caracteres.",
    });
  }

  try {
    const brand = await createBrand({ name });

    return res.status(201).json({
      message: "Marca registrada correctamente.",
      brand,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
}

export async function putBrand(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "El ID de la marca debe ser un entero positivo.",
    });
  }

  const { name } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      message: "El nombre de la marca es obligatorio.",
    });
  }

  if (name.trim().length > 100) {
    return res.status(400).json({
      message: "El nombre de la marca no puede superar los 100 caracteres.",
    });
  }

  try {
    const brand = await updateBrand(id, { name });

    return res.status(200).json({
      message: "Marca actualizada correctamente.",
      brand,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
}

export async function patchBrandStatus(req, res) {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({
      message: "El ID de la marca debe ser un entero positivo.",
    });
  }

  const { active } = req.body;

  if (typeof active !== "boolean") {
    return res.status(400).json({
      message: "El campo active debe ser true o false.",
    });
  }

  try {
    const brand = await updateBrandStatus(id, active);

    return res.status(200).json({
      message: active
        ? "Marca activada correctamente."
        : "Marca desactivada correctamente.",
      brand,
    });
  } catch (error) {
    return handlePrismaError(res, error);
  }
}
