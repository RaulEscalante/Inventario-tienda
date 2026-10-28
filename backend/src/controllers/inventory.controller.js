
import {
  listarInventario,
  obtenerInventarioPorId,
  registrarIngresoInicial,
  ajustarInventario,
} from "../services/inventory.service.js";

function esEnteroPositivo(valor) {
  return Number.isSafeInteger(valor) && valor > 0;
}

function esCantidadValida(valor) {
  return Number.isSafeInteger(valor) && valor >= 0;
}

function responderError(res, error) {
  const errores = {
    INVALID_PRODUCT: [404, "El producto no existe."],
    INVALID_WAREHOUSE: [404, "El almacén no existe."],
    INACTIVE_PRODUCT: [409, error.message],
    INACTIVE_WAREHOUSE: [409, error.message],
    INVENTORY_EXISTS: [409, error.message],
    INVENTORY_NOT_FOUND: [404, error.message],
    NO_STOCK_CHANGE: [400, error.message],
  };

  if (errores[error.code]) {
    const [status, message] = errores[error.code];
    return res.status(status).json({ message });
  }

  if (error.code === "P2002") {
    return res.status(409).json({
      message:
        "Ya existe un registro de inventario para ese producto y almacén.",
    });
  }

  if (error.code === "P2034") {
    return res.status(409).json({
      message:
        "El inventario cambió durante la operación. Vuelve a consultar la cantidad e inténtalo nuevamente.",
    });
  }

  console.error("Error en inventario:", error);

  return res.status(500).json({
    message: "Ocurrió un error al procesar el inventario.",
  });
}

function validarMotivo(reason) {
  return (
    reason === undefined ||
    reason === null ||
    (typeof reason === "string" && reason.trim().length <= 250)
  );
}

// GET /api/inventory
export async function obtenerInventario(req, res) {
  const filtros = {};

  for (const campo of ["warehouseId", "categoryId", "brandId"]) {
    if (req.query[campo] === undefined) continue;

    const valor = Number(req.query[campo]);

    if (!esEnteroPositivo(valor)) {
      return res.status(400).json({
        message: `El filtro ${campo} debe ser un entero positivo.`,
      });
    }

    filtros[campo] = valor;
  }

  if (req.query.search !== undefined) {
    filtros.search = String(req.query.search);
  }

  try {
    const inventario = await listarInventario(filtros);
    return res.json({ inventario });
  } catch (error) {
    return responderError(res, error);
  }
}

// GET /api/inventory/:id
export async function obtenerInventarioDetalle(req, res) {
  const id = Number(req.params.id);

  if (!esEnteroPositivo(id)) {
    return res.status(400).json({
      message: "El ID del inventario no es válido.",
    });
  }

  try {
    const inventario = await obtenerInventarioPorId(id);

    if (!inventario) {
      return res.status(404).json({
        message: "El registro de inventario no existe.",
      });
    }

    return res.json({ inventario });
  } catch (error) {
    return responderError(res, error);
  }
}

// POST /api/inventory/initial
export async function crearIngresoInicial(req, res) {
  const { productId, warehouseId, quantity, reason } = req.body;

  if (!esEnteroPositivo(productId) || !esEnteroPositivo(warehouseId)) {
    return res.status(400).json({
      message:
        "productId y warehouseId deben ser enteros positivos.",
    });
  }

  if (!esEnteroPositivo(quantity)) {
    return res.status(400).json({
      message: "La cantidad inicial debe ser un entero mayor que cero.",
    });
  }

  if (!validarMotivo(reason)) {
    return res.status(400).json({
      message: "El motivo debe ser un texto de hasta 250 caracteres.",
    });
  }

  try {
    const inventario = await registrarIngresoInicial({
      productId,
      warehouseId,
      quantity,
      reason: typeof reason === "string" ? reason.trim() : null,
      userId: req.auth.userId,
    });

    return res.status(201).json({
      message: "Existencias iniciales registradas correctamente.",
      inventario,
    });
  } catch (error) {
    return responderError(res, error);
  }
}

// PATCH /api/inventory/:id/adjustments
export async function crearAjusteInventario(req, res) {
  const inventoryId = Number(req.params.id);
  const { newQuantity, reason } = req.body;

  if (!esEnteroPositivo(inventoryId)) {
    return res.status(400).json({
      message: "El ID del inventario no es válido.",
    });
  }

  if (!esCantidadValida(newQuantity)) {
    return res.status(400).json({
      message: "La nueva cantidad debe ser un entero igual o mayor que cero.",
    });
  }

  if (!validarMotivo(reason)) {
    return res.status(400).json({
      message: "El motivo debe ser un texto de hasta 250 caracteres.",
    });
  }

  try {
    const inventario = await ajustarInventario({
      inventoryId,
      newQuantity,
      reason: typeof reason === "string" ? reason.trim() : null,
      userId: req.auth.userId,
    });

    return res.json({
      message: "Inventario ajustado correctamente.",
      inventario,
    });
  } catch (error) {
    return responderError(res, error);
  }
}
