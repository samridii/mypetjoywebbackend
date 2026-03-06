jest.mock("../../../models/cart.model", () => ({
  __esModule: true,
  default: {
    findOne:          jest.fn(),
    create:           jest.fn(),
    findOneAndDelete: jest.fn(),
  },
}));

jest.mock("../../../middlewares/auth.middleware", () => ({
  __esModule: true,
  default: (req: any, _res: any, next: any) => {
    req.user = { _id: "aaaaaaaaaaaaaaaaaaaaaaaa", role: "user" };
    next();
  },
}));

import request    from "supertest";
import express    from "express";
import cartRouter from "../../../routes/cart.route";
import CartModel  from "../../../models/cart.model";

const mockCartModel = CartModel as jest.Mocked<typeof CartModel>;

const app = express();
app.use(express.json());
app.use("/api/cart", cartRouter);
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.statusCode ?? 500).json({ success: false, message: err.message });
});

const PRODUCT_ID = "bbbbbbbbbbbbbbbbbbbbbbbb";
const USER_ID    = "aaaaaaaaaaaaaaaaaaaaaaaa";

const makeMockCart = (items = [{ product: { toString: () => PRODUCT_ID }, quantity: 2 }]) => ({
  _id:      "cart1",
  user:     USER_ID,
  items,
  save:     jest.fn().mockResolvedValue(undefined),
  populate: jest.fn().mockResolvedValue(undefined), 
});

beforeEach(() => jest.clearAllMocks());

describe("Cart Routes", () => {

  it("1. GET /api/cart — 200 with cart data", async () => {
    (mockCartModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(makeMockCart()),
    });
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
  });

  it("2. GET /api/cart — returns empty items when no cart exists", async () => {
    (mockCartModel.findOne as jest.Mock).mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });
    const res = await request(app).get("/api/cart");
    expect(res.status).toBe(200);
    expect(res.body.data.items).toEqual([]);
  });

  it("3. POST /api/cart — 201 creates a new cart when none exists", async () => {
    (mockCartModel.findOne as jest.Mock).mockResolvedValue(null);
    const newCart = makeMockCart();
    (mockCartModel.create as jest.Mock).mockResolvedValue({
      ...newCart,
      populate: jest.fn().mockResolvedValue(newCart),
    });
    const res = await request(app).post("/api/cart")
      .send({ productId: PRODUCT_ID, quantity: 1 });
    expect(res.status).toBe(201);
    expect(res.body.data).toBeDefined();
  });

  it("4. POST /api/cart — 201 increments quantity for existing item", async () => {
    const cart = makeMockCart();
    (mockCartModel.findOne as jest.Mock).mockResolvedValue(cart);
    const res = await request(app).post("/api/cart")
      .send({ productId: PRODUCT_ID, quantity: 2 });
    expect(res.status).toBe(201);
    expect(cart.save).toHaveBeenCalled();
  });

  it("5. DELETE /api/cart/:productId — 200 removes item", async () => {
    const cart = makeMockCart();
    (mockCartModel.findOne as jest.Mock).mockResolvedValue(cart);
    const res = await request(app).delete(`/api/cart/${PRODUCT_ID}`);
    expect(res.status).toBe(200);
    expect(cart.save).toHaveBeenCalled();
  });

  it("6. DELETE /api/cart/:productId — 404 when cart not found", async () => {
    (mockCartModel.findOne as jest.Mock).mockResolvedValue(null);
    const res = await request(app).delete(`/api/cart/${PRODUCT_ID}`);
    expect(res.status).toBe(404);
  });

  it("7. DELETE /api/cart — 200 clears entire cart", async () => {
    (mockCartModel.findOneAndDelete as jest.Mock).mockResolvedValue(makeMockCart());
    const res = await request(app).delete("/api/cart");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("8. POST /api/cart — returns 500 on model error", async () => {
    (mockCartModel.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));
    const res = await request(app).post("/api/cart")
      .send({ productId: PRODUCT_ID, quantity: 1 });
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

});