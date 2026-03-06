import { Router } from "express";
import adminOrderController from "../../controllers/admin/order.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import adminMiddleware from "../../middlewares/admin.middleware";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", adminOrderController.getAllOrders);
router.put("/:id", adminOrderController.updateStatus);

export default router;