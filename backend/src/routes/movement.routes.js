
import { Router } from "express";

import { obtenerMovimientos } from "../controllers/movement.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", obtenerMovimientos);

export default router;
