import { Request, Response } from "express";
import adminPetService from "../../services/admin/pet.service";

class AdminPetController {
  async createPet(req: Request, res: Response) {
    const pet = await adminPetService.createPet(req.body);
    res.status(201).json({ success: true, data: pet });
  }

  async getAllPets(req: Request, res: Response) {
    const pets = await adminPetService.getAllPets();
    res.json({ success: true, data: pets });
  }

  async updatePet(req: Request, res: Response) {
    const pet = await adminPetService.updatePet(req.params.id, req.body);
    res.json({ success: true, data: pet });
  }

  async deletePet(req: Request, res: Response) {
    await adminPetService.deletePet(req.params.id);
    res.json({ success: true, message: "Pet deleted successfully" });
  }
}

export default new AdminPetController();