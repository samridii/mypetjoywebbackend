jest.mock("../../../repositories/product.repository");

import productRepository from "../../../repositories/product.repository";
import productService    from "../../../services/product.service";

const mockRepo = productRepository as jest.Mocked<typeof productRepository>;

const data = { _id: "pr1", name: "Dog Food", price: 200, stock: 10, description: "Good", category: "Food" };

beforeEach(() => jest.clearAllMocks());

describe("ProductService", () => {

  it("1. getAllProducts — calls repo.findAll and returns all products", async () => {
    mockRepo.findAll.mockResolvedValue([data] as any);
    const result = await productService.getAllProducts();
    expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ _id: "pr1" });
  });

  it("2. getAllProducts — returns empty array when no products exist", async () => {
    mockRepo.findAll.mockResolvedValue([]);
    const result = await productService.getAllProducts();
    expect(result).toHaveLength(0);
  });

  it("3. getProductById — returns product for valid id", async () => {
    mockRepo.findById.mockResolvedValue(data as any);
    const result = await productService.getProductById("pr1");
    expect(mockRepo.findById).toHaveBeenCalledWith("pr1");
    expect(result).toMatchObject({ name: "Dog Food" });
  });

  it("4. getProductById — throws when product not found", async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(productService.getProductById("bad")).rejects.toThrow();
  });

});