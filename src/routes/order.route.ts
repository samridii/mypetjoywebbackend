import { Router } from "express";
import orderController from "../controllers/order.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", orderController.placeOrder);
router.get("/", orderController.getMyOrders);

export default router;