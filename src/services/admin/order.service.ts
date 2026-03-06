
import orderRepository from "../../repositories/order.repository";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

class AdminOrderService {
  async getAllOrders() {
    return await orderRepository.findAll();
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await orderRepository.findById(id);
    if (!order) throw new Error("Order not found");

    const validStatuses: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status as OrderStatus)) {
      throw new Error(`Invalid order status: ${status}`);
    }

    return await orderRepository.update(id, { status: status as OrderStatus });
  }
}

export default new AdminOrderService();