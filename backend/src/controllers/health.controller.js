
export function comprobarEstado(req, res) {
  return res.status(200).json({
    status: "ok",
    message: "API de inventario funcionando",
  });
}
