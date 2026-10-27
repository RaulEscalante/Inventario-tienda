
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.js";

function obtenerSecretoJWT() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("Falta configurar JWT_SECRET en el archivo .env");
  }

  return secret;
}

export async function iniciarSesion(username, password) {
  const usuario = await prisma.user.findUnique({
    where: {
      username: username.trim().toLowerCase(),
    },
  });

  // Mensaje genérico para no revelar si el usuario existe.
  if (!usuario || !usuario.active) {
    return null;
  }

  const passwordValida = await bcrypt.compare(
    password,
    usuario.passwordHash
  );

  if (!passwordValida) {
    return null;
  }

  const token = jwt.sign(
    { sub: String(usuario.id) },
    obtenerSecretoJWT(),
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      username: usuario.username,
      name: usuario.name,
    },
  };
}

export async function obtenerUsuarioActual(userId) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      name: true,
      active: true,
      createdAt: true,
    },
  });
}
