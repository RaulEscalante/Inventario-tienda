
import { Router } from "express";
import { comprobarEstado } from "../controllers/health.controller.js";

const router = Router();

router.get("/", comprobarEstado);

export default router;

