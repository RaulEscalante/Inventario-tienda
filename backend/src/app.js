
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import warehouseRoutes from "./routes/warehouse.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import movementRoutes from "./routes/movement.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDistPath = path.resolve(
  __dirname,
  "../../frontend/dist"
);

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// Rutas de la API
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/movements", movementRoutes);

// Frontend compilado para producción
app.use(express.static(frontendDistPath));

// Permitir que React Router gestione sus propias rutas
app.use((req, res, next) => {
  if (
    req.method !== "GET" ||
    req.path === "/api" ||
    req.path.startsWith("/api/")
  ) {
    return next();
  }

  res.sendFile(
    path.join(frontendDistPath, "index.html"),
    (error) => {
      if (error) next(error);
    }
  );
});

export default app;
