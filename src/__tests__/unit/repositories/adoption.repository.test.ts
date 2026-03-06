jest.mock("../../../models/adoption.model");

import Adoption from "../../../models/adoption.model";
import adoptionRepository from "../../../repositories/adoption.repository";

const mockAdoption = Adoption as jest.Mocked<typeof Adoption>;
const data = { _id: "a1", status: "PENDING", pet: "p1", user: "u1" };

beforeEach(() => jest.clearAllMocks());

describe("AdoptionRepository", () => {
  it("1. create — calls Adoption.create with data", async () => {
    (mockAdoption.create as jest.Mock).mockResolvedValue(data);
    const result = await adoptionRepository.create(data as any);
    expect(mockAdoption.create).toHaveBeenCalledWith(data);
    expect(result).toMatchObject({ _id: "a1" });
  });

  it("2. findAll — calls Adoption.find with populate user and pet", async () => {
    const populateMock = jest.fn().mockReturnThis();
    (mockAdoption.find as jest.Mock).mockReturnValue({ populate: populateMock });
    populateMock.mockReturnValueOnce({ populate: jest.fn().mockResolvedValue([data]) });
    await adoptionRepository.findAll();
    expect(mockAdoption.find).toHaveBeenCalled();
    expect(populateMock).toHaveBeenCalledWith("user");
  });

  it("3. findById — calls Adoption.findById with id", async () => {
    (mockAdoption.findById as jest.Mock).mockResolvedValue(data);
    const result = await adoptionRepository.findById("a1");
    expect(mockAdoption.findById).toHaveBeenCalledWith("a1");
    expect(result).toMatchObject({ _id: "a1" });
  });

  it("4. findById — returns null when not found", async () => {
    (mockAdoption.findById as jest.Mock).mockResolvedValue(null);
    const result = await adoptionRepository.findById("bad");
    expect(result).toBeNull();
  });

  it("5. update — calls findByIdAndUpdate with { new: true }", async () => {
    (mockAdoption.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...data, status: "APPROVED" });
    const result = await adoptionRepository.update("a1", { status: "APPROVED" } as any);
    expect(mockAdoption.findByIdAndUpdate).toHaveBeenCalledWith("a1", { status: "APPROVED" }, { new: true });
    expect(result).toMatchObject({ status: "APPROVED" });
  });
});