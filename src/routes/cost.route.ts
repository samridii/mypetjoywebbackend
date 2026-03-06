import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import { calculatePetCost } from "../services/cost.service";

const router = Router();

router.get("/:petId", authMiddleware, async (req, res, next) => {
  try {
    const result = await calculatePetCost(req.params.petId);

    res.status(200).json({
      success: true,
      costDetails: result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;