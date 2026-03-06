import { Router } from "express";
import adminAdoptionController from "../../controllers/admin/adoption.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import adminMiddleware from "../../middlewares/admin.middleware";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", adminAdoptionController.getAllAdoptions);
router.put("/:id", adminAdoptionController.updateStatus);

export default router;