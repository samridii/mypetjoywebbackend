import { Router } from "express";
import adoptionController from "../controllers/adoption.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", adoptionController.requestAdoption);

export default router;