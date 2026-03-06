jest.mock("../../../repositories/pet.repository");

import petRepository from "../../../repositories/pet.repository";
import petService    from "../../../services/pet.service";

const mockPetRepo = petRepository as jest.Mocked<typeof petRepository>;
const mockPet     = { _id: "p1", name: "Buddy", type: "dog" };

beforeEach(() => jest.clearAllMocks());

describe("PetService", () => {
  it("1. getAllPets — returns all pets", async () => {
    mockPetRepo.findAll.mockResolvedValue([mockPet] as any);
    const result = await petService.getAllPets();
    expect(result).toHaveLength(1);
    expect(mockPetRepo.findAll).toHaveBeenCalledTimes(1);
  });

  it("2. getAllPets — returns empty array when none", async () => {
    mockPetRepo.findAll.mockResolvedValue([]);
    expect(await petService.getAllPets()).toEqual([]);
  });

  it("3. getPetById — returns pet when found", async () => {
    mockPetRepo.findById.mockResolvedValue(mockPet as any);
    const result = await petService.getPetById("p1");
    expect(mockPetRepo.findById).toHaveBeenCalledWith("p1");
    expect(result).toMatchObject({ _id: "p1" });
  });

  it("4. getPetById — throws when pet not found", async () => {
    mockPetRepo.findById.mockResolvedValue(null);
    await expect(petService.getPetById("bad")).rejects.toThrow("Pet not found");
  });
});