
jest.mock("../../../../repositories/pet.repository");

import petRepository   from "../../../../repositories/pet.repository";
import adminPetService from "../../../../services/admin/pet.service";

const mockPetRepo = petRepository as jest.Mocked<typeof petRepository>;
const mockPet     = { _id: "p1", name: "Buddy", type: "dog", breed: "Labrador", age: 2 };

beforeEach(() => jest.clearAllMocks());

describe("AdminPetService", () => {
  it("1. createPet — calls petRepository.create with data", async () => {
    mockPetRepo.create.mockResolvedValue(mockPet as any);
    const result = await adminPetService.createPet({ name: "Buddy" } as any);
    expect(mockPetRepo.create).toHaveBeenCalledWith({ name: "Buddy" });
    expect(result).toMatchObject({ name: "Buddy" });
  });

  it("2. getAllPets — returns all pets", async () => {
    mockPetRepo.findAll.mockResolvedValue([mockPet] as any);
    const result = await adminPetService.getAllPets();
    expect(result).toHaveLength(1);
    expect(mockPetRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it("3. getAllPets — returns empty array when none", async () => {
    mockPetRepo.findAll.mockResolvedValue([]);
    const result = await adminPetService.getAllPets();
    expect(result).toEqual([]);
  });

  it("4. updatePet — returns updated pet", async () => {
    mockPetRepo.update.mockResolvedValue({ ...mockPet, name: "Max" } as any);
    const result = await adminPetService.updatePet("p1", { name: "Max" } as any);
    expect(mockPetRepo.update).toHaveBeenCalledWith("p1", { name: "Max" });
    expect(result).toMatchObject({ name: "Max" });
  });

  it("5. updatePet — throws when pet not found", async () => {
    mockPetRepo.update.mockResolvedValue(null);
    await expect(adminPetService.updatePet("bad", {})).rejects.toThrow("Pet not found");
  });

  it("6. deletePet — returns deleted pet", async () => {
    mockPetRepo.delete.mockResolvedValue(mockPet as any);
    const result = await adminPetService.deletePet("p1");
    expect(mockPetRepo.delete).toHaveBeenCalledWith("p1");
    expect(result).toMatchObject({ _id: "p1" });
  });

  it("7. deletePet — throws when pet not found", async () => {
    mockPetRepo.delete.mockResolvedValue(null);
    await expect(adminPetService.deletePet("bad")).rejects.toThrow("Pet not found");
  });
});