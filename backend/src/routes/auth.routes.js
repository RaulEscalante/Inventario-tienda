
import { Router } from "express";
import {  login,  perfilActual,} from "../controllers/auth.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me
router.get("/me", verificarToken, perfilActual);

export default router;
