import { Router } from "express";
import { upload } from "../middlewares/upload.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/admin/admin.controller";

const router = Router();

router.post("/users", adminMiddleware, upload.single("image"), createUser);
router.get("/users", adminMiddleware, getUsers);
router.get("/users/:id", adminMiddleware, getUserById);
router.put("/users/:id", adminMiddleware, upload.single("image"), updateUser);
router.delete("/users/:id", adminMiddleware, deleteUser);

export default router;
