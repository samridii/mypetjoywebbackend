
jest.mock("../../../models/order.model");

import Order from "../../../models/order.model";
import orderRepository from "../../../repositories/order.repository";

const mockOrder = Order as jest.Mocked<typeof Order>;
const data      = { _id: "o1", status: "PENDING", totalAmount: 500, user: "u1" };

function chainMock(resolved: any) {
  const mock = { populate: jest.fn().mockReturnThis(), sort: jest.fn().mockResolvedValue(resolved) };
  mock.populate.mockReturnValue(mock as any);
  return mock;
}

beforeEach(() => jest.clearAllMocks());

describe("OrderRepository", () => {
  it("1. create — calls Order.create with data", async () => {
    (mockOrder.create as jest.Mock).mockResolvedValue(data);
    const result = await orderRepository.create(data as any);
    expect(mockOrder.create).toHaveBeenCalledWith(data);
    expect(result).toMatchObject({ _id: "o1" });
  });

  it("2. findByUser — calls Order.find with userId", async () => {
    (mockOrder.find as jest.Mock).mockReturnValue(chainMock([data]));
    await orderRepository.findByUser("u1");
    expect(mockOrder.find).toHaveBeenCalledWith({ user: "u1" });
  });

  it("3. findByUser — returns sorted orders", async () => {
    const chain = chainMock([data]);
    (mockOrder.find as jest.Mock).mockReturnValue(chain);
    await orderRepository.findByUser("u1");
    expect(chain.sort).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it("4. findAll — calls Order.find with no filter", async () => {
    (mockOrder.find as jest.Mock).mockReturnValue(chainMock([data]));
    await orderRepository.findAll();
    expect(mockOrder.find).toHaveBeenCalledWith();
  });

  it("5. findById — returns order by id", async () => {
    (mockOrder.findById as jest.Mock).mockResolvedValue(data);
    const result = await orderRepository.findById("o1");
    expect(mockOrder.findById).toHaveBeenCalledWith("o1");
    expect(result).toMatchObject({ _id: "o1" });
  });

  it("6. findById — returns null when not found", async () => {
    (mockOrder.findById as jest.Mock).mockResolvedValue(null);
    const result = await orderRepository.findById("bad");
    expect(result).toBeNull();
  });

  it("7. update — calls findByIdAndUpdate with { new: true }", async () => {
    (mockOrder.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...data, status: "SHIPPED" });
    const result = await orderRepository.update("o1", { status: "SHIPPED" } as any);
    expect(mockOrder.findByIdAndUpdate).toHaveBeenCalledWith("o1", { status: "SHIPPED" }, { new: true });
    expect(result).toMatchObject({ status: "SHIPPED" });
  });
});