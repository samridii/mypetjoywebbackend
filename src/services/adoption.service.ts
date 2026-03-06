import adoptionRepository from "../repositories/adoption.repository";
import petRepository from "../repositories/pet.repository";

class AdoptionService {
  async requestAdoption(userId: string, body: {
    pet: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    livingType: string;
    hasOtherPets: boolean;
    experience: string;
    reason: string;
  }) {
    const pet = await petRepository.findById(body.pet);
    if (!pet) throw new Error("Pet not found");

    if (pet.status !== "AVAILABLE") {
      throw new Error("Pet is not available for adoption");
    }

    await petRepository.update(body.pet, { status: "PENDING" });

    return await adoptionRepository.create({
      user: userId as any,
      pet: body.pet as any,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      address: body.address,
      livingType: body.livingType,
      hasOtherPets: body.hasOtherPets,
      experience: body.experience,
      reason: body.reason,
      status: "PENDING",
    });
  }
}

export default new AdoptionService();