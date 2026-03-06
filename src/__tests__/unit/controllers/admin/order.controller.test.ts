
import request from "supertest";
import express from "express";
import adminOrderController from "../../../../controllers/admin/order.controller";
import adminOrderService    from "../../../../services/admin/order.service";

jest.mock("../../../../services/admin/order.service");
const mockSvc = adminOrderService as jest.Mocked<typeof adminOrderService>;

const app = express();
app.use(express.json());
app.get("/admin/orders",     (req, res) => adminOrderController.getAllOrders(req, res));
app.put("/admin/orders/:id", (req, res) => adminOrderController.updateStatus(req, res));

const mockOrder = { _id: "o1", status: "PENDING", totalAmount: 500 };

describe("Admin Order Controller", () => {
  it("1. GET — returns all orders", async () => {
    mockSvc.getAllOrders.mockResolvedValue([mockOrder] as any);
    const res = await request(app).get("/admin/orders");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it("2. GET — returns empty array when none", async () => {
    mockSvc.getAllOrders.mockResolvedValue([]);
    const res = await request(app).get("/admin/orders");
    expect(res.body.data).toEqual([]);
  });

  it("3. GET — calls getAllOrders once", async () => {
    mockSvc.getAllOrders.mockResolvedValue([]);
    await request(app).get("/admin/orders");
    expect(mockSvc.getAllOrders).toHaveBeenCalledTimes(1);
  });

  it("4. PUT /:id — updates to SHIPPED", async () => {
    mockSvc.updateOrderStatus.mockResolvedValue({ ...mockOrder, status: "SHIPPED" } as any);
    const res = await request(app).put("/admin/orders/o1").send({ status: "SHIPPED" });
    expect(res.body.data.status).toBe("SHIPPED");
  });

  it("5. PUT /:id — calls updateOrderStatus with id and status", async () => {
    mockSvc.updateOrderStatus.mockResolvedValue(mockOrder as any);
    await request(app).put("/admin/orders/o1").send({ status: "DELIVERED" });
    expect(mockSvc.updateOrderStatus).toHaveBeenCalledWith("o1", "DELIVERED");
  });

  it("6. PUT /:id — returns success:true", async () => {
    mockSvc.updateOrderStatus.mockResolvedValue(mockOrder as any);
    const res = await request(app).put("/admin/orders/o1").send({ status: "PAID" });
    expect(res.body.success).toBe(true);
  });
});