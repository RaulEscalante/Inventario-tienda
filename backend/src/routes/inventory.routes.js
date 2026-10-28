
import { Router } from "express";

import {
  obtenerInventario,
  obtenerInventarioDetalle,
  crearIngresoInicial,
  crearAjusteInventario,
} from "../controllers/inventory.controller.js";

import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", obtenerInventario);
router.post("/initial", crearIngresoInicial);
router.get("/:id", obtenerInventarioDetalle);
router.patch("/:id/adjustments", crearAjusteInventario);

export default router;
