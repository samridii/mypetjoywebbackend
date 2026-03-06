import { Request, Response } from "express";
import adminOrderService from "../../services/admin/order.service";

class AdminOrderController {
  async getAllOrders(req: Request, res: Response) {
    const orders = await adminOrderService.getAllOrders();
    res.json({ success: true, data: orders });
  }

  async updateStatus(req: Request, res: Response) {
    const { status } = req.body;

    const order = await adminOrderService.updateOrderStatus(
      req.params.id,
      status
    );

    res.json({ success: true, data: order });
  }
}

export default new AdminOrderController();