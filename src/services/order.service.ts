import orderRepository from "../repositories/order.repository";
import productRepository from "../repositories/product.repository";
import mongoose from "mongoose";

export class OrderService {
  async placeOrder(userId: string, items: any[]) {
    let totalAmount = 0;

    for (const item of items) {
      const product = await productRepository.findById(item.productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      totalAmount += product.price * item.quantity;

      // reduce stock
      await productRepository.update(product._id.toString(), {
        stock: product.stock - item.quantity,
      });
    }

    return await orderRepository.create({
      user: new mongoose.Types.ObjectId(userId),
      products: items.map((item) => ({
        product: new mongoose.Types.ObjectId(item.productId),
        quantity: item.quantity,
      })),
      totalAmount,
      status: "PENDING",
    });
  }

  async getMyOrders(userId: string) {
    return await orderRepository.findByUser(userId);
  }
}

export default new OrderService();