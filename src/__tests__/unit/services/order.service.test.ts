jest.mock("../../../repositories/order.repository");
jest.mock("../../../repositories/product.repository");

import orderRepository from "../../../repositories/order.repository";
import productRepository from "../../../repositories/product.repository";
import { OrderService } from "../../../services/order.service";

const mockOrderRepo = orderRepository as jest.Mocked<typeof orderRepository>;
const mockProductRepo = productRepository as jest.Mocked<typeof productRepository>;

const USER_ID = "aaaaaaaaaaaaaaaaaaaaaaaa";
const PRODUCT_ID = "bbbbbbbbbbbbbbbbbbbbbbbb";

const mockProduct = {
  _id: PRODUCT_ID,
  name: "Dog Food",
  price: 200,
  stock: 10,
};

const mockOrder = {
  _id: "cccccccccccccccccccccccc",
  status: "PENDING",
  totalAmount: 400,
  user: USER_ID,
};

let service: OrderService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new OrderService();
});

describe("OrderService", () => {

  it("1. placeOrder — throws when product not found", async () => {
    mockProductRepo.findById.mockResolvedValue(null);

    await expect(
      service.placeOrder(USER_ID, [
        { productId: PRODUCT_ID, quantity: 2 },
      ])
    ).rejects.toThrow("Product not found");
  });

  it("2. placeOrder — throws when insufficient stock", async () => {
    mockProductRepo.findById.mockResolvedValue({
      ...mockProduct,
      stock: 1,
    } as any);

    await expect(
      service.placeOrder(USER_ID, [
        { productId: PRODUCT_ID, quantity: 5 },
      ])
    ).rejects.toThrow();
  });

  it("3. placeOrder — reduces product stock", async () => {
    mockProductRepo.findById.mockResolvedValue(mockProduct as any);
    mockProductRepo.update.mockResolvedValue({} as any);
    mockOrderRepo.create.mockResolvedValue(mockOrder as any);

    await service.placeOrder(USER_ID, [
      { productId: PRODUCT_ID, quantity: 2 },
    ]);

    expect(mockProductRepo.update).toHaveBeenCalledWith(PRODUCT_ID, {
      stock: 8,
    });
  });

  it("4. placeOrder — calculates correct totalAmount", async () => {
    mockProductRepo.findById.mockResolvedValue(mockProduct as any);
    mockProductRepo.update.mockResolvedValue({} as any);
    mockOrderRepo.create.mockResolvedValue(mockOrder as any);

    await service.placeOrder(USER_ID, [
      { productId: PRODUCT_ID, quantity: 2 },
    ]);

    expect(mockOrderRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        totalAmount: 400,
      })
    );
  });

  it("5. placeOrder — creates order with PENDING status", async () => {
    mockProductRepo.findById.mockResolvedValue(mockProduct as any);
    mockProductRepo.update.mockResolvedValue({} as any);
    mockOrderRepo.create.mockResolvedValue(mockOrder as any);

    await service.placeOrder(USER_ID, [
      { productId: PRODUCT_ID, quantity: 2 },
    ]);

    expect(mockOrderRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "PENDING",
      })
    );
  });

  it("6. getMyOrders — returns orders for a user", async () => {
    mockOrderRepo.findByUser.mockResolvedValue([mockOrder] as any);

    const result = await service.getMyOrders(USER_ID);

    expect(mockOrderRepo.findByUser).toHaveBeenCalledWith(USER_ID);
    expect(result).toHaveLength(1);
  });

});