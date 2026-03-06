import adoptionRepository from "../../repositories/adoption.repository";
import petRepository from "../../repositories/pet.repository";

type AdoptionStatus = "PENDING" | "APPROVED" | "REJECTED";
type PetStatus      = "AVAILABLE" | "PENDING" | "ADOPTED";

class AdminAdoptionService {
  async getAllAdoptions() {
    return await adoptionRepository.findAll();
  }

  async updateAdoptionStatus(id: string, status: string) {
    const adoption = await adoptionRepository.findById(id);
    if (!adoption) throw new Error("Adoption not found");

    const validStatuses: AdoptionStatus[] = ["PENDING", "APPROVED", "REJECTED"];
    if (!validStatuses.includes(status as AdoptionStatus)) {
      throw new Error(`Invalid adoption status: ${status}`);
    }

    const updatedAdoption = await adoptionRepository.update(id, {
      status: status as AdoptionStatus,
    });

    if (status === "APPROVED") {
      await petRepository.update(adoption.pet.toString(), {
        status: "ADOPTED" as PetStatus,
      });
    }

    return updatedAdoption;
  }
}

export default new AdminAdoptionService();