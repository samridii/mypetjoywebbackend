import Pet from "../models/pet.model";

export const calculatePetCost = async (petId: string) => {
  const pet = await Pet.findById(petId);

  if (!pet) {
    throw new Error("Pet not found");
  }

  const yearlyFoodCost = pet.yearlyFoodCost ?? 0;
const yearlyMedicalCost = pet.yearlyMedicalCost ?? 0;
const yearlyGroomingCost = pet.yearlyGroomingCost ?? 0;
const averageLifespan = pet.averageLifespan ?? 0;

const yearlyTotal = yearlyFoodCost + yearlyMedicalCost + yearlyGroomingCost;
const lifetimeCost = yearlyTotal * averageLifespan;

  return {
    petName: pet.name,
    yearlyBreakdown: {
      food: pet.yearlyFoodCost,
      medical: pet.yearlyMedicalCost,
      grooming: pet.yearlyGroomingCost,
      totalPerYear: yearlyTotal,
    },
    lifespanYears: pet.averageLifespan,
    estimatedLifetimeCost: lifetimeCost,
  };
};