
import {
  listarProductos, obtenerProductoPorId, crearProducto,
  actualizarProducto, cambiarEstadoProducto, eliminarProducto,
} from "../services/product.service.js";

function obtenerIdValido(valor) {
  if (!/^[1-9]\d*$/.test(valor)) return null;

  const id = Number(valor);
  return Number.isSafeInteger(id) ? id : null;
}

function validarProducto(datos, parcial = false) {
  const errores = [];

  if (!datos || typeof datos !== "object" || Array.isArray(datos)) {
    return ["El cuerpo de la solicitud debe ser un objeto válido."];
  }

  if (!parcial || datos.sku !== undefined) {
    if (
      typeof datos.sku !== "string" ||
      !datos.sku.trim() ||
      datos.sku.trim().length > 40
    ) {
      errores.push("El SKU es obligatorio y debe tener máximo 40 caracteres.");
    }
  }

  if (!parcial || datos.name !== undefined) {
    if (
      typeof datos.name !== "string" ||
      !datos.name.trim() ||
      datos.name.trim().length > 160
    ) {
      errores.push("El nombre es obligatorio y debe tener máximo 160 caracteres.");
    }
  }

  if (datos.description !== undefined && datos.description !== null) {
    if (typeof datos.description !== "string") {
      errores.push("La descripción debe ser un texto.");
    }
  }

  for (const campo of ["purchasePrice", "salePrice"]) {
    if (!parcial || datos[campo] !== undefined) {
      const valor = datos[campo];

      if (
        valor === "" ||
        valor === null ||
        valor === undefined ||
        !Number.isFinite(Number(valor)) ||
        Number(valor) < 0 ||
        !/^\d+(\.\d{1,2})?$/.test(String(valor))
      ) {
        errores.push(
          `${campo === "purchasePrice" ? "El precio de compra" : "El precio de venta"} debe ser un número no negativo con máximo dos decimales.`
        );
      } else if (Number(valor) >= 100000000) {
        errores.push("Los precios no pueden superar 99,999,999.99.");
      }
    }
  }

  if (datos.categoryId !== undefined && datos.categoryId !== null) {
    if (
      !Number.isSafeInteger(Number(datos.categoryId)) ||
      Number(datos.categoryId) <= 0
    ) {
      errores.push("El ID de categoría debe ser un entero positivo.");
    }
  }

  if (datos.brandId !== undefined && datos.brandId !== null && datos.brandId !== "") {
    if (
      !Number.isSafeInteger(Number(datos.brandId)) ||
      Number(datos.brandId) <= 0
    ) {
      errores.push("El ID de marca debe ser un entero positivo.");
    }
  }

  return errores;
}

function normalizarDatos(datos, parcial = false) {
  const resultado = { ...datos };

  if (resultado.sku !== undefined) {
    resultado.sku = resultado.sku.trim();
  }

  if (resultado.name !== undefined) {
    resultado.name = resultado.name.trim();
  }

  if (resultado.description !== undefined) {
    resultado.description =
      resultado.description === null || !resultado.description.trim()
        ? null
        : resultado.description.trim();
  }

  for (const campo of ["purchasePrice", "salePrice"]) {
    if (resultado[campo] !== undefined) {
      resultado[campo] = Number(resultado[campo]);
    }
  }

  if (resultado.categoryId !== undefined) {
    resultado.categoryId =
      resultado.categoryId === null || resultado.categoryId === ""
        ? null
        : Number(resultado.categoryId);
  }

  if (resultado.brandId !== undefined) {
    resultado.brandId =
      resultado.brandId === null || resultado.brandId === ""
        ? null
        : Number(resultado.brandId);
  }

  return resultado;
}

function responderError(res, error) {
  if (error.code === "P2002") {
    return res.status(409).json({
      message: "Ya existe un producto con ese SKU.",
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      message: "El producto no existe.",
    });
  }

  if (error.code === "INVALID_CATEGORY") {
    return res.status(400).json({
      message: error.message,
    });
  }

  if (error.code === "INVALID_BRAND") {
    return res.status(400).json({
      message: error.message,
    });
  }

  if (error.code === "PRODUCT_HAS_HISTORY") {
    return res.status(409).json({
      message: error.message,
    });
  }

  if (error.code === "P2003") {
    return res.status(409).json({
      message: "No se puede completar la operación porque existen registros relacionados.",
    });
  }

  console.error("Error en el módulo de productos:", error);

  return res.status(500).json({
    message: "Ocurrió un error al procesar el producto.",
  });
}

export async function obtenerProductos(req, res) {
  try {
    const { buscar, activo, categoriaId } = req.query;

    let estado;
    if (activo !== undefined) {
      if (activo !== "true" && activo !== "false") {
        return res.status(400).json({
          message: "El filtro activo debe ser true o false.",
        });
      }

      estado = activo === "true";
    }

    let idCategoria;
    if (categoriaId !== undefined) {
      idCategoria = obtenerIdValido(categoriaId);

      if (idCategoria === null) {
        return res.status(400).json({
          message: "El ID de categoría no es válido.",
        });
      }
    }

    const productos = await listarProductos({
      buscar: typeof buscar === "string" ? buscar.trim() : undefined,
      activo: estado,
      categoriaId: idCategoria,
    });

    return res.status(200).json({ productos });
  } catch (error) {
    return responderError(res, error);
  }
}

export async function obtenerProducto(req, res) {
  try {
    const id = obtenerIdValido(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "El ID del producto no es válido.",
      });
    }

    const producto = await obtenerProductoPorId(id);

    if (!producto) {
      return res.status(404).json({
        message: "El producto no existe.",
      });
    }

    return res.status(200).json({ producto });
  } catch (error) {
    return responderError(res, error);
  }
}

export async function registrarProducto(req, res) {
  try {
    const errores = validarProducto(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        message: "Revisa los datos del producto.",
        errores,
      });
    }

    const datos = normalizarDatos(req.body);
    const producto = await crearProducto(datos);

    return res.status(201).json({
      message: "Producto registrado correctamente.",
      producto,
    });
  } catch (error) {
    return responderError(res, error);
  }
}

export async function editarProducto(req, res) {
  try {
    const id = obtenerIdValido(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "El ID del producto no es válido.",
      });
    }

    const errores = validarProducto(req.body, true);

    if (errores.length > 0) {
      return res.status(400).json({
        message: "Revisa los datos enviados.",
        errores,
      });
    }

    const datos = normalizarDatos(req.body, true);
    const producto = await actualizarProducto(id, datos);

    return res.status(200).json({
      message: "Producto actualizado correctamente.",
      producto,
    });
  } catch (error) {
    return responderError(res, error);
  }
}

export async function actualizarEstadoProducto(req, res) {
  try {
    const id = obtenerIdValido(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "El ID del producto no es válido.",
      });
    }

    const { active } = req.body ?? {};

    if (typeof active !== "boolean") {
      return res.status(400).json({
        message: "El campo active debe ser true o false.",
      });
    }

    const producto = await cambiarEstadoProducto(id, active);

    return res.status(200).json({
      message: active
        ? "Producto activado correctamente."
        : "Producto desactivado correctamente.",
      producto,
    });
  } catch (error) {
    return responderError(res, error);
  }
}

export async function borrarProducto(req, res) {
  try {
    const id = obtenerIdValido(req.params.id);

    if (id === null) {
      return res.status(400).json({
        message: "El ID del producto no es válido.",
      });
    }

    await eliminarProducto(id);

    return res.status(200).json({
      message: "Producto eliminado correctamente.",
    });
  } catch (error) {
    return responderError(res, error);
  }
}
