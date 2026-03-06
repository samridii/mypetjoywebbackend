import { Router } from "express";
import authMiddleware, { AuthRequest } from "../middlewares/auth.middleware";
import { getPetRecommendation } from "../services/ai.service";

const router = Router();

router.post("/", authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    const answers = req.body;

    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide your preferences in the request body.",
      });
    }

    const recommendation = await getPetRecommendation(answers);
    res.status(200).json({ success: true, recommendation });
  } catch (error) {
    next(error);
  }
});

export default router;