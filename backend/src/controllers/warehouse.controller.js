
import {
  listarAlmacenes,
  obtenerAlmacenPorId,
  crearAlmacen,
  actualizarAlmacen,
  cambiarEstadoAlmacen,
} from "../services/warehouse.service.js";

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

  if (name.length < 1 || name.length > 100) {
    return null;
  }

  return name;
}

function manejarError(error, res) {
  if (error.code === "P2002") {
    return res.status(409).json({
      message: "Ya existe un almacén con ese nombre.",
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      message: "El almacén no existe.",
    });
  }

  console.error("Error en el módulo de almacenes:", error);

  return res.status(500).json({
    message: "Ocurrió un error al procesar el almacén.",
  });
}

export async function obtenerAlmacenes(req, res) {
  try {
    const { active, search } = req.query;
    let filtro;

    if (active !== undefined) {
      if (active !== "true" && active !== "false") {
        return res.status(400).json({
          message: "El filtro active debe ser true o false.",
        });
      }

      filtro = active === "true";
    }

    if (
      search !== undefined &&
      (typeof search !== "string" || search.length > 100)
    ) {
      return res.status(400).json({
        message: "El término de búsqueda no es válido.",
      });
    }

    const almacenes = await listarAlmacenes({
      active: filtro,
      search,
    });

    return res.status(200).json({ almacenes });
  } catch (error) {
    return manejarError(error, res);
  }
}

export async function obtenerAlmacen(req, res) {
  try {
    const id = convertirId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "El identificador del almacén no es válido.",
      });
    }

    const almacen = await obtenerAlmacenPorId(id);

    if (!almacen) {
      return res.status(404).json({
        message: "El almacén no existe.",
      });
    }

    return res.status(200).json({ almacen });
  } catch (error) {
    return manejarError(error, res);
  }
}

export async function crear(req, res) {
  try {
    const name = validarNombre(req.body?.name);

    if (name === null) {
      return res.status(400).json({
        message:
          "El nombre es obligatorio y debe tener entre 1 y 100 caracteres.",
      });
    }

    const almacen = await crearAlmacen(name);

    return res.status(201).json({
      message: "Almacén creado correctamente.",
      almacen,
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
        message: "El identificador del almacén no es válido.",
      });
    }

    if (name === null) {
      return res.status(400).json({
        message:
          "El nombre es obligatorio y debe tener entre 1 y 100 caracteres.",
      });
    }

    const almacen = await actualizarAlmacen(id, name);

    return res.status(200).json({
      message: "Almacén actualizado correctamente.",
      almacen,
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
        message: "El identificador del almacén no es válido.",
      });
    }

    if (typeof active !== "boolean") {
      return res.status(400).json({
        message: "El estado active debe ser true o false.",
      });
    }

    const almacen = await cambiarEstadoAlmacen(id, active);

    return res.status(200).json({
      message: active
        ? "Almacén activado correctamente."
        : "Almacén desactivado correctamente.",
      almacen,
    });
  } catch (error) {
    return manejarError(error, res);
  }
}
