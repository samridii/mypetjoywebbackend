import { Request, Response } from "express";
import petService from "../services/pet.service";

class PetController {
  async getAllPets(req: Request, res: Response) {
    const pets = await petService.getAllPets();
    res.json({ success: true, data: pets });
  }

  async getPetById(req: Request, res: Response) {
    const pet = await petService.getPetById(req.params.id);
    res.json({ success: true, data: pet });
  }
}

export default new PetController();