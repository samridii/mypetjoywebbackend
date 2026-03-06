import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import orderService from "../services/order.service";

class OrderController {
  async placeOrder(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const { items } = req.body;

    const order = await orderService.placeOrder(userId, items);

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  }

  async getMyOrders(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const orders = await orderService.getMyOrders(userId);

    res.json({ success: true, data: orders });
  }
}

export default new OrderController();