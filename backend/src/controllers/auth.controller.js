
import { iniciarSesion, obtenerUsuarioActual, } from "../services/auth.service.js";

export async function login(req, res) {
  try {
    const { username, password } = req.body ?? {};

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Debes ingresar el usuario y la contraseña.",
      });
    }

    const resultado = await iniciarSesion(username, password);

    if (!resultado) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos.",
      });
    }

    return res.status(200).json({
      message: "Inicio de sesión correcto.",
      ...resultado,
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      message: "Ocurrió un error al iniciar sesión.",
    });
  }
}

export async function perfilActual(req, res) {
  try {
    const usuario = await obtenerUsuarioActual(req.auth.userId);

    if (!usuario || !usuario.active) {
      return res.status(401).json({
        message: "La sesión ya no es válida.",
      });
    }

    const { active, ...datosUsuario } = usuario;

    return res.status(200).json({
      usuario: datosUsuario,
    });
  } catch (error) {
    console.error("Error al consultar la sesión:", error);

    return res.status(500).json({
      message: "No se pudo consultar la sesión.",
    });
  }
}
