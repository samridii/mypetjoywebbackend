import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import adoptionService from "../services/adoption.service";

class AdoptionController {
  async requestAdoption(req: AuthRequest, res: Response) {
    const userId = req.user!.id;

    const adoption = await adoptionService.requestAdoption(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Adoption request submitted successfully",
      data: adoption,
    });
  }
}

export default new AdoptionController();