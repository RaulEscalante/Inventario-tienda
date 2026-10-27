
import { Router } from "express";
import { listBrands, getBrand, postBrand, putBrand, patchBrandStatus, } from "../controllers/brand.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", listBrands);
router.get("/:id", getBrand);
router.post("/", postBrand);
router.put("/:id", putBrand);
router.patch("/:id/estado", patchBrandStatus);

export default router;
