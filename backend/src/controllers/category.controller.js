
import {
  listarCategorias, obtenerCategoriaPorId, crearCategoria,
  actualizarCategoria, cambiarEstadoCategoria,
} from "../services/category.service.js";

function convertirId(valor) {
  if (
    typeof valor !== "string" ||
    !/^[1-9]\d*$/.test(valor)
  ) {
    return null;
  }

  const id = Number(valor);

  return Number.isSafeInteger(id) ? id : null;
}

function validarNombre(valor) {
  if (typeof valor !== "string") {
    return null;
  }

  const name = valor.trim();

  if (name.length < 1 || name.length > 80) {
    return null;
  }

  return name;
}

function manejarError(error, res) {
  if (error.code === "P2002") {
    return res.status(409).json({
      message: "Ya existe una categoría con ese nombre.",
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      message: "La categoría no existe.",
    });
  }

  console.error("Error en el módulo de categorías:", error);

  return res.status(500).json({
    message: "Ocurrió un error al procesar la categoría.",
  });
}

export async function obtenerCategorias(req, res) {
  try {
    const { active } = req.query;
    let filtro;

    if (active !== undefined) {
      if (active !== "true" && active !== "false") {
        return res.status(400).json({
          message: "El filtro active debe ser true o false.",
        });
      }

      filtro = active === "true";
    }

    const categorias = await listarCategorias({
      active: filtro,
    });

    return res.status(200).json({ categorias });
  } catch (error) {
    return manejarError(error, res);
  }
}

export async function obtenerCategoria(req, res) {
  try {
    const id = convertirId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "El identificador de la categoría no es válido.",
      });
    }

    const categoria = await obtenerCategoriaPorId(id);

    if (!categoria) {
      return res.status(404).json({
        message: "La categoría no existe.",
      });
    }

    return res.status(200).json({ categoria });
  } catch (error) {
    return manejarError(error, res);
  }
}

export async function crear(req, res) {
  try {
    const name = validarNombre(req.body?.name);

    if (name === null) {
      return res.status(400).json({
        message: "El nombre es obligatorio y debe tener entre 1 y 80 caracteres.",
      });
    }

    const categoria = await crearCategoria(name);

    return res.status(201).json({
      message: "Categoría creada correctamente.",
      categoria,
    });
  } catch (error) {
    return manejarError(error, res);
  }
}

export async function actualizar(req, res) {
  try {
    const id = convertirId(req.params.id);
    const name = validarNombre(req.body?.name);

    if (id === null) {
      return res.status(400).json({
        message: "El identificador de la categoría no es válido.",
      });
    }

    if (name === null) {
      return res.status(400).json({
        message: "El nombre es obligatorio y debe tener entre 1 y 80 caracteres.",
      });
    }

    const categoria = await actualizarCategoria(id, name);

    return res.status(200).json({
      message: "Categoría actualizada correctamente.",
      categoria,
    });
  } catch (error) {
    return manejarError(error, res);
  }
}

export async function actualizarEstado(req, res) {
  try {
    const id = convertirId(req.params.id);
    const { active } = req.body ?? {};

    if (id === null) {
      return res.status(400).json({
        message: "El identificador de la categoría no es válido.",
      });
    }

    if (typeof active !== "boolean") {
      return res.status(400).json({
        message: "El estado active debe ser true o false.",
      });
    }

    const categoria = await cambiarEstadoCategoria(id, active);

    return res.status(200).json({
      message: active
        ? "Categoría activada correctamente."
        : "Categoría desactivada correctamente.",
      categoria,
    });
  } catch (error) {
    return manejarError(error, res);
  }
}
