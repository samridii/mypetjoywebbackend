jest.mock("../../../models/pet.model");

import Pet from "../../../models/pet.model";
import { calculatePetCost } from "../../../services/cost.service";

const mockPet = Pet as jest.Mocked<typeof Pet>;

const petData = {
  _id: "p1",
  name: "Buddy",
  yearlyFoodCost: 1200,
  yearlyMedicalCost: 600,
  yearlyGroomingCost: 300,
  averageLifespan: 10,
};

beforeEach(() => jest.clearAllMocks());

describe("calculatePetCost", () => {
  it("1. throws when pet not found", async () => {
    (mockPet.findById as jest.Mock).mockResolvedValue(null);
    await expect(calculatePetCost("bad")).rejects.toThrow("Pet not found");
  });

  it("2. calls Pet.findById with petId", async () => {
    (mockPet.findById as jest.Mock).mockResolvedValue(petData);
    await calculatePetCost("p1");
    expect(mockPet.findById).toHaveBeenCalledWith("p1");
  });

  it("3. returns petName in result", async () => {
    (mockPet.findById as jest.Mock).mockResolvedValue(petData);
    const result = await calculatePetCost("p1");
    expect(result.petName).toBe("Buddy");
  });

  it("4. calculates correct totalPerYear (food + medical + grooming)", async () => {
    (mockPet.findById as jest.Mock).mockResolvedValue(petData);
    const result = await calculatePetCost("p1");
    expect(result.yearlyBreakdown.totalPerYear).toBe(2100);
  });

  it("5. calculates correct estimatedLifetimeCost (totalPerYear × lifespan)", async () => {
    (mockPet.findById as jest.Mock).mockResolvedValue(petData);
    const result = await calculatePetCost("p1");
    expect(result.estimatedLifetimeCost).toBe(21000);
  });

  it("6. defaults to 0 when cost fields are undefined", async () => {
    (mockPet.findById as jest.Mock).mockResolvedValue({
      _id: "p2", name: "Max",
      yearlyFoodCost: undefined, yearlyMedicalCost: undefined,
      yearlyGroomingCost: undefined, averageLifespan: undefined,
    });
    const result = await calculatePetCost("p2");
    expect(result.estimatedLifetimeCost).toBe(0);
    expect(result.yearlyBreakdown.totalPerYear).toBe(0);
  });
});