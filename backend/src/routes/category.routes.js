
import { Router } from "express";
import {
  obtenerCategorias, obtenerCategoria, crear,
  actualizar, actualizarEstado,
} from "../controllers/category.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoria);
router.post("/", crear);
router.put("/:id", actualizar);
router.patch("/:id/estado", actualizarEstado);

export default router;
