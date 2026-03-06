const mockGetAllProductsCtrl = jest.fn();
const mockCreateProductCtrl  = jest.fn();
const mockUpdateProductCtrl  = jest.fn();
const mockDeleteProductCtrl  = jest.fn();

jest.mock("../../../../controllers/admin/product.controller", () => ({
  getAllProducts:  (...a: any[]) => mockGetAllProductsCtrl(...a),
  createProduct:  (...a: any[]) => mockCreateProductCtrl(...a),
  updateProduct:  (...a: any[]) => mockUpdateProductCtrl(...a),
  deleteProduct:  (...a: any[]) => mockDeleteProductCtrl(...a),
}));

jest.mock("../../../../middlewares/auth.middleware",  () => ({ __esModule: true, default: (_: any, __: any, next: any) => next() }));
jest.mock("../../../../middlewares/admin.middleware", () => ({ __esModule: true, default: (_: any, __: any, next: any) => next() }));

import request              from "supertest";
import express              from "express";
import adminProductRouter   from "../../../../routes/admin/product.route";

const app = express();
app.use(express.json());
app.use("/api/admin/products", adminProductRouter);
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.statusCode ?? 500).json({ success: false, message: err.message });
});

const product = { _id: "pr1", name: "Dog Food", price: 200, stock: 10 };

beforeEach(() => jest.clearAllMocks());

describe("Admin Product Routes", () => {

  it("1. GET /api/admin/products — 200 with all products", async () => {
    mockGetAllProductsCtrl.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: [product] })
    );
    const res = await request(app).get("/api/admin/products");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("2. POST /api/admin/products — 201 on create", async () => {
    mockCreateProductCtrl.mockImplementation((_req: any, res: any) =>
      res.status(201).json({ success: true, data: product })
    );
    const res = await request(app).post("/api/admin/products")
      .send({ name: "Dog Food", price: 200, stock: 10 });
    expect(res.status).toBe(201);
  });

  it("3. PUT /api/admin/products/:id — 200 on update", async () => {
    mockUpdateProductCtrl.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: { ...product, stock: 5 } })
    );
    const res = await request(app).put("/api/admin/products/pr1")
      .send({ stock: 5 });
    expect(res.status).toBe(200);
  });

  it("4. DELETE /api/admin/products/:id — 200 on delete", async () => {
    mockDeleteProductCtrl.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, message: "Deleted" })
    );
    const res = await request(app).delete("/api/admin/products/pr1");
    expect(res.status).toBe(200);
  });

  it("5. GET /api/admin/products — empty array when no products", async () => {
    mockGetAllProductsCtrl.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: [] })
    );
    const res = await request(app).get("/api/admin/products");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

});