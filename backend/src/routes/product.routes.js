
import { Router } from "express";
import { verificarToken } from "../middlewares/auth.middleware.js";

import {
  obtenerProductos, obtenerProducto, registrarProducto,
  editarProducto, actualizarEstadoProducto, borrarProducto,
} from "../controllers/product.controller.js";

const router = Router();

// Todas las rutas requieren autenticación.
router.use(verificarToken);

// GET /api/products
router.get("/", obtenerProductos);

// GET /api/products/:id
router.get("/:id", obtenerProducto);

// POST /api/products
router.post("/", registrarProducto);

// PUT /api/products/:id
router.put("/:id", editarProducto);

// PATCH /api/products/:id/estado
router.patch("/:id/estado", actualizarEstadoProducto);

// DELETE /api/products/:id
router.delete("/:id", borrarProducto);

export default router;
