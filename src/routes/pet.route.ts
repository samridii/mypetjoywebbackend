import { Router } from "express";
import petController from "../controllers/pet.controller";

const router = Router();

router.get("/", petController.getAllPets);
router.get("/:id", petController.getPetById);

export default router;