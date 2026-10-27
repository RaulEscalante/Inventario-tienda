
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

const prisma = new PrismaClient();

async function preguntar(texto) {
  const rl = createInterface({ input: stdin, output: stdout });

  try {
    return (await rl.question(texto)).trim();
  } finally {
    rl.close();
  }
}

function preguntarPassword() {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY || !stdout.isTTY) {
      reject(new Error("Ejecuta este script desde una terminal interactiva."));
      return;
    }

    stdout.write("Contraseña (mínimo 12 caracteres): ");

    let password = "";
    const anteriorRawMode = stdin.isRaw;

    function finalizar(valor, error = false) {
      stdin.removeListener("data", recibir);
      stdin.setRawMode(anteriorRawMode);
      stdin.pause();
      stdout.write("\n");

      if (error) reject(valor);
      else resolve(valor);
    }

    function recibir(buffer) {
      for (const caracter of buffer.toString("utf8")) {
        if (caracter === "\u0003") {
          finalizar(new Error("Operación cancelada."), true);
          return;
        }

        if (caracter === "\r" || caracter === "\n") {
          finalizar(password);
          return;
        }

        if (caracter === "\u007f" || caracter === "\b") {
          password = password.slice(0, -1);
          continue;
        }

        if (caracter >= " " && caracter !== "\u007f") {
          password += caracter;
        }
      }
    }

    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", recibir);
  });
}

async function main() {
  const cantidadUsuarios = await prisma.user.count();

  if (cantidadUsuarios > 0) {
    throw new Error(
      "Ya existen usuarios. No se creará otro usuario inicial."
    );
  }

  const username = (await preguntar("Nombre de usuario: "))
    .toLowerCase();

  const name = await preguntar("Nombre para mostrar: ");

  if (!/^[a-z0-9._-]{3,50}$/.test(username)) {
    throw new Error(
      "El usuario debe tener entre 3 y 50 caracteres: letras, números, punto, guion o guion bajo."
    );
  }

  if (!name || name.length > 120) {
    throw new Error("El nombre es obligatorio y admite hasta 120 caracteres.");
  }

  const password = await preguntarPassword();

  if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) {
    throw new Error(
      "La contraseña debe tener al menos 12 caracteres y un máximo de 72 bytes UTF-8."
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username,
      name,
      passwordHash,
      active: true,
    },
  });

  console.log(`Usuario inicial "${username}" creado correctamente.`);
}

main()
  .catch((error) => {
    console.error("No se pudo crear el usuario:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
