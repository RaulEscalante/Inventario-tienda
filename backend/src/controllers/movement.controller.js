
import { listarMovimientos } from "../services/movement.service.js";

const tiposMovimiento = [
  "INITIAL",
  "ADJUSTMENT",
  "PURCHASE",
  "SALE",
  "RETURN",
];

function esEnteroPositivo(valor) {
  return Number.isSafeInteger(valor) && valor > 0;
}

function esFechaValida(valor) {
  if (
    typeof valor !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(valor)
  ) {
    return false;
  }

  const fecha = new Date(`${valor}T00:00:00.000Z`);

  return (
    !Number.isNaN(fecha.getTime()) &&
    fecha.toISOString().slice(0, 10) === valor
  );
}

// GET /api/movements
export async function obtenerMovimientos(req, res) {
  const filtros = {};

  for (const campo of ["productId", "warehouseId"]) {
    if (req.query[campo] === undefined) continue;

    const valor = Number(req.query[campo]);

    if (!esEnteroPositivo(valor)) {
      return res.status(400).json({
        message: `${campo} debe ser un entero positivo.`,
      });
    }

    filtros[campo] = valor;
  }

  if (req.query.type !== undefined) {
    if (!tiposMovimiento.includes(req.query.type)) {
      return res.status(400).json({
        message:
          "El tipo de movimiento no es válido.",
        tiposPermitidos: tiposMovimiento,
      });
    }

    filtros.type = req.query.type;
  }

  for (const campo of ["from", "to"]) {
    if (req.query[campo] === undefined) continue;

    if (!esFechaValida(req.query[campo])) {
      return res.status(400).json({
        message: `La fecha ${campo} debe tener el formato YYYY-MM-DD y ser válida.`,
      });
    }

    filtros[campo] = req.query[campo];
  }

  if (
    filtros.from &&
    filtros.to &&
    filtros.from > filtros.to
  ) {
    return res.status(400).json({
      message:
        "La fecha inicial no puede ser posterior a la fecha final.",
    });
  }

  const page = req.query.page === undefined
    ? 1
    : Number(req.query.page);

  const pageSize = req.query.pageSize === undefined
    ? 20
    : Number(req.query.pageSize);

  if (!Number.isSafeInteger(page) || page < 1) {
    return res.status(400).json({
      message: "page debe ser un entero mayor que cero.",
    });
  }

  if (
    !Number.isSafeInteger(pageSize) ||
    pageSize < 1 ||
    pageSize > 100
  ) {
    return res.status(400).json({
      message: "pageSize debe estar entre 1 y 100.",
    });
  }

  try {
    const resultado = await listarMovimientos({
      ...filtros,
      page,
      pageSize,
    });

    return res.json(resultado);
  } catch (error) {
    console.error("Error al consultar movimientos:", error);

    return res.status(500).json({
      message: "No se pudo consultar el historial de movimientos.",
    });
  }
}
