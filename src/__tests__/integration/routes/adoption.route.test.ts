jest.mock("../../../middlewares/auth.middleware", () => ({
  __esModule: true,
  default: (req: any, _res: any, next: any) => {
    req.user = { _id: "aaaaaaaaaaaaaaaaaaaaaaaa", role: "user" };
    next();
  },
  authorized: (req: any, _res: any, next: any) => {
    req.user = { _id: "aaaaaaaaaaaaaaaaaaaaaaaa", role: "user" };
    next();
  },
}));

jest.mock("../../../controllers/adoption.controller", () => ({
  __esModule: true,
  default: {
    requestAdoption: jest.fn((_req: any, res: any) =>
      res.status(201).json({ success: true, message: "Adoption request submitted" })
    ),
  },
}));

import request        from "supertest";
import express        from "express";
import adoptionRouter from "../../../routes/adoption.route";
import adoptionController from "../../../controllers/adoption.controller";

const mockController = adoptionController as jest.Mocked<typeof adoptionController>;

const app = express();
app.use(express.json());
app.use("/api/adoptions", adoptionRouter);

beforeEach(() => jest.clearAllMocks());

describe("Adoption Route Integration", () => {
  it("16. POST /api/adoptions — 201 on valid adoption request", async () => {
    const res = await request(app).post("/api/adoptions").send({
      pet: "bbbbbbbbbbbbbbbbbbbbbbbb",
      fullName: "Sam Kim", email: "s@t.com", phone: "9800000000",
      address: "KTM", livingType: "house", hasOtherPets: false,
      experience: "Some", reason: "I love animals",
    });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("17. POST /api/adoptions — calls requestAdoption controller", async () => {
    await request(app).post("/api/adoptions").send({ pet: "bbbbbbbbbbbbbbbbbbbbbbbb" });
    expect(mockController.requestAdoption).toHaveBeenCalledTimes(1);
  });

  it("18. POST /api/adoptions — route is protected (auth middleware runs)", async () => {
    (mockController.requestAdoption as jest.Mock).mockImplementationOnce(
      (req: any, res: any) => res.json({ user: req.user._id })
    );
    const res = await request(app).post("/api/adoptions").send({});
    expect(res.body.user).toBe("aaaaaaaaaaaaaaaaaaaaaaaa");
  });
});