import { Router } from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../../controllers/admin/admin.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import adminMiddleware from "../../middlewares/admin.middleware";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/",      getUsers);
router.get("/:id",   getUserById);
router.put("/:id",   updateUser);
router.delete("/:id", deleteUser);

export default router;