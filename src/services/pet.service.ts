import petRepository from "../repositories/pet.repository";

class PetService {
  async getAllPets() {
    return await petRepository.findAll();
  }

  async getPetById(id: string) {
    const pet = await petRepository.findById(id);
    if (!pet) throw new Error("Pet not found");
    return pet;
  }
}

export default new PetService();