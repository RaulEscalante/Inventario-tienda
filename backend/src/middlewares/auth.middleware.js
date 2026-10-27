
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

export async function verificarToken(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Debes iniciar sesión para acceder a este recurso.",
      });
    }

    const token = authorization.slice(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("Falta configurar JWT_SECRET.");

      return res.status(500).json({
        message: "Error de configuración del servidor.",
      });
    }

    const payload = jwt.verify(token, secret);

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      !/^\d+$/.test(payload.sub)
    ) {
      return res.status(401).json({
        message: "El token no es válido.",
      });
    }

    const userId = Number(payload.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(401).json({
        message: "El token no es válido.",
      });
    }

    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        active: true,
      },
    });

    if (!usuario || !usuario.active) {
      return res.status(401).json({
        message: "La sesión ya no es válida.",
      });
    }

    req.auth = {
      userId: usuario.id,
    };

    return next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        message: "El token es inválido o ha expirado.",
      });
    }

    console.error("Error al verificar la sesión:", error);

    return res.status(500).json({
      message: "No se pudo verificar la sesión.",
    });
  }
}
