import Order, { IOrder } from "../models/order.model";

class OrderRepository {
  async create(data: Partial<IOrder>): Promise<IOrder> {
    return await Order.create(data);
  }

  async findByUser(userId: string): Promise<IOrder[]> {
    return await Order.find({ user: userId })
      .populate("products.product")
      .sort({ createdAt: -1 });
  }

  async findAll(): Promise<IOrder[]> {
    return await Order.find()
      .populate("user")
      .populate("products.product")
      .sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<IOrder | null> {
    return await Order.findById(id);
  }

  async update(id: string, data: Partial<IOrder>) {
    return await Order.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new OrderRepository();