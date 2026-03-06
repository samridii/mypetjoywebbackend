jest.mock("../../../repositories/adoption.repository");
jest.mock("../../../repositories/pet.repository");

import adoptionRepository from "../../../repositories/adoption.repository";
import petRepository      from "../../../repositories/pet.repository";
import adoptionService    from "../../../services/adoption.service";

const mockAdoptionRepo = adoptionRepository as jest.Mocked<typeof adoptionRepository>;
const mockPetRepo      = petRepository      as jest.Mocked<typeof petRepository>;

const mockPet      = { _id: "p1", name: "Buddy", status: "AVAILABLE" };
const mockAdoption = { _id: "a1", status: "PENDING", pet: "p1", fullName: "Sam" };
const adoptionBody = {
  pet: "p1", fullName: "Sam", email: "s@t.com", phone: "9800000000",
  address: "KTM", livingType: "house", hasOtherPets: false,
  experience: "Some exp", reason: "Love animals",
};

beforeEach(() => jest.clearAllMocks());

describe("AdoptionService", () => {
  it("1. requestAdoption — throws when pet not found", async () => {
    mockPetRepo.findById.mockResolvedValue(null);
    await expect(adoptionService.requestAdoption("u1", adoptionBody))
      .rejects.toThrow("Pet not found");
  });

  it("2. requestAdoption — throws when pet is not AVAILABLE", async () => {
    mockPetRepo.findById.mockResolvedValue({ ...mockPet, status: "ADOPTED" } as any);
    await expect(adoptionService.requestAdoption("u1", adoptionBody))
      .rejects.toThrow("Pet is not available for adoption");
  });

  it("3. requestAdoption — throws when pet is PENDING", async () => {
    mockPetRepo.findById.mockResolvedValue({ ...mockPet, status: "PENDING" } as any);
    await expect(adoptionService.requestAdoption("u1", adoptionBody))
      .rejects.toThrow("Pet is not available for adoption");
  });

  it("4. requestAdoption — marks pet as PENDING", async () => {
    mockPetRepo.findById.mockResolvedValue(mockPet as any);
    mockPetRepo.update.mockResolvedValue(mockPet as any);
    mockAdoptionRepo.create.mockResolvedValue(mockAdoption as any);
    await adoptionService.requestAdoption("u1", adoptionBody);
    expect(mockPetRepo.update).toHaveBeenCalledWith("p1", { status: "PENDING" });
  });

  it("5. requestAdoption — creates adoption record", async () => {
    mockPetRepo.findById.mockResolvedValue(mockPet as any);
    mockPetRepo.update.mockResolvedValue(mockPet as any);
    mockAdoptionRepo.create.mockResolvedValue(mockAdoption as any);
    const result = await adoptionService.requestAdoption("u1", adoptionBody);
    expect(mockAdoptionRepo.create).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ _id: "a1" });
  });

  it("6. requestAdoption — passes all body fields to adoptionRepository", async () => {
    mockPetRepo.findById.mockResolvedValue(mockPet as any);
    mockPetRepo.update.mockResolvedValue(mockPet as any);
    mockAdoptionRepo.create.mockResolvedValue(mockAdoption as any);
    await adoptionService.requestAdoption("u1", adoptionBody);
    expect(mockAdoptionRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ fullName: "Sam", email: "s@t.com", status: "PENDING" })
    );
  });
});