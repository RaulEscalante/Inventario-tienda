
import { Router } from "express";
import {
  obtenerAlmacenes,
  obtenerAlmacen,
  crear,
  actualizar,
  actualizarEstado,
} from "../controllers/warehouse.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", obtenerAlmacenes);
router.get("/:id", obtenerAlmacen);
router.post("/", crear);
router.put("/:id", actualizar);
router.patch("/:id/status", actualizarEstado);

export default router;
