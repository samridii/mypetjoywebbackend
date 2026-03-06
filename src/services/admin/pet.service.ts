import petRepository from "../../repositories/pet.repository";
import { IPet } from "../../models/pet.model";

class AdminPetService {
  async createPet(data: Partial<IPet>) {
    return await petRepository.create(data);
  }

  async getAllPets() {
    return await petRepository.findAll();
  }

  async updatePet(id: string, data: Partial<IPet>) {
    const pet = await petRepository.update(id, data);
    if (!pet) throw new Error("Pet not found");
    return pet;
  }

  async deletePet(id: string) {
    const pet = await petRepository.delete(id);
    if (!pet) throw new Error("Pet not found");
    return pet;
  }
}

export default new AdminPetService();