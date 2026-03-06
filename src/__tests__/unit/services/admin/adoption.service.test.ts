
jest.mock("../../../../repositories/adoption.repository");
jest.mock("../../../../repositories/pet.repository");

import adoptionRepository from "../../../../repositories/adoption.repository";
import petRepository      from "../../../../repositories/pet.repository";
import adminAdoptionService from "../../../../services/admin/adoption.service";

const mockAdoptionRepo = adoptionRepository as jest.Mocked<typeof adoptionRepository>;
const mockPetRepo      = petRepository      as jest.Mocked<typeof petRepository>;

const mockAdoption = { _id: "a1", status: "PENDING", pet: "p1" };
const mockPet      = { _id: "p1", name: "Buddy", status: "AVAILABLE" };

beforeEach(() => jest.clearAllMocks());

describe("AdminAdoptionService", () => {
  it("1. getAllAdoptions — returns all adoptions", async () => {
    mockAdoptionRepo.findAll.mockResolvedValue([mockAdoption] as any);
    const result = await adminAdoptionService.getAllAdoptions();
    expect(result).toHaveLength(1);
    expect(mockAdoptionRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it("2. getAllAdoptions — returns empty array when none", async () => {
    mockAdoptionRepo.findAll.mockResolvedValue([]);
    const result = await adminAdoptionService.getAllAdoptions();
    expect(result).toEqual([]);
  });

  it("3. updateAdoptionStatus — throws when adoption not found", async () => {
    mockAdoptionRepo.findById.mockResolvedValue(null);
    await expect(adminAdoptionService.updateAdoptionStatus("bad", "APPROVED"))
      .rejects.toThrow("Adoption not found");
  });

  it("4. updateAdoptionStatus — throws on invalid status", async () => {
    mockAdoptionRepo.findById.mockResolvedValue(mockAdoption as any);
    await expect(adminAdoptionService.updateAdoptionStatus("a1", "INVALID"))
      .rejects.toThrow("Invalid adoption status: INVALID");
  });

  it("5. updateAdoptionStatus APPROVED — updates adoption status", async () => {
    mockAdoptionRepo.findById.mockResolvedValue(mockAdoption as any);
    mockAdoptionRepo.update.mockResolvedValue({ ...mockAdoption, status: "APPROVED" } as any);
    mockPetRepo.update.mockResolvedValue(mockPet as any);
    const result = await adminAdoptionService.updateAdoptionStatus("a1", "APPROVED");
    expect(mockAdoptionRepo.update).toHaveBeenCalledWith("a1", { status: "APPROVED" });
    expect(result).toMatchObject({ status: "APPROVED" });
  });

  it("6. updateAdoptionStatus APPROVED — marks pet as ADOPTED", async () => {
    mockAdoptionRepo.findById.mockResolvedValue(mockAdoption as any);
    mockAdoptionRepo.update.mockResolvedValue({ ...mockAdoption, status: "APPROVED" } as any);
    mockPetRepo.update.mockResolvedValue(mockPet as any);
    await adminAdoptionService.updateAdoptionStatus("a1", "APPROVED");
    expect(mockPetRepo.update).toHaveBeenCalledWith("p1", { status: "ADOPTED" });
  });

  it("7. updateAdoptionStatus REJECTED — does NOT update pet status", async () => {
    mockAdoptionRepo.findById.mockResolvedValue(mockAdoption as any);
    mockAdoptionRepo.update.mockResolvedValue({ ...mockAdoption, status: "REJECTED" } as any);
    await adminAdoptionService.updateAdoptionStatus("a1", "REJECTED");
    expect(mockPetRepo.update).not.toHaveBeenCalled();
  });

  it("8. updateAdoptionStatus PENDING — does NOT update pet status", async () => {
    mockAdoptionRepo.findById.mockResolvedValue(mockAdoption as any);
    mockAdoptionRepo.update.mockResolvedValue(mockAdoption as any);
    await adminAdoptionService.updateAdoptionStatus("a1", "PENDING");
    expect(mockPetRepo.update).not.toHaveBeenCalled();
  });
});