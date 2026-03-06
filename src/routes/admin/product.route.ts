import { Router } from "express";
import adminProductController from "../../controllers/admin/product.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import adminMiddleware from "../../middlewares/admin.middleware";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/", adminProductController.createProduct);
router.get("/", adminProductController.getAllProducts);
router.put("/:id", adminProductController.updateProduct);
router.delete("/:id", adminProductController.deleteProduct);

export default router;