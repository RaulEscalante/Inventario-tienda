import "dotenv/config";
import app from "./app.js";
import { prisma } from "./config/prisma.js";

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
  try {
    await prisma.$connect();

    app.listen(PORT, () => {
      console.log(`API disponible en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

iniciarServidor();