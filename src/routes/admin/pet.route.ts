import { Router } from "express";
import adminPetController from "../../controllers/admin/pet.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import adminMiddleware from "../../middlewares/admin.middleware";

const router = Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.post("/", adminPetController.createPet);
router.get("/", adminPetController.getAllPets);
router.put("/:id", adminPetController.updatePet);
router.delete("/:id", adminPetController.deletePet);

export default router;