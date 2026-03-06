const mockGetAllPetsCtrl = jest.fn();
const mockCreatePetCtrl  = jest.fn();
const mockUpdatePetCtrl  = jest.fn();
const mockDeletePetCtrl  = jest.fn();

jest.mock("../../../../controllers/admin/pet.controller", () => ({
  getAllPets:  (...a: any[]) => mockGetAllPetsCtrl(...a),
  createPet:  (...a: any[]) => mockCreatePetCtrl(...a),
  updatePet:  (...a: any[]) => mockUpdatePetCtrl(...a),
  deletePet:  (...a: any[]) => mockDeletePetCtrl(...a),
}));

jest.mock("../../../../middlewares/auth.middleware",  () => ({ __esModule: true, default: (_: any, __: any, next: any) => next() }));
jest.mock("../../../../middlewares/admin.middleware", () => ({ __esModule: true, default: (_: any, __: any, next: any) => next() }));

import request          from "supertest";
import express          from "express";
import adminPetRouter   from "../../../../routes/admin/pet.route";

const app = express();
app.use(express.json());
app.use("/api/admin/pets", adminPetRouter);
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.statusCode ?? 500).json({ success: false, message: err.message });
});

const pet = { _id: "p1", name: "Buddy", species: "Dog", breed: "Lab", age: 2, status: "available" };

beforeEach(() => jest.clearAllMocks());

describe("Admin Pet Routes", () => {

  it("1. GET /api/admin/pets — 200 with all pets", async () => {
    mockGetAllPetsCtrl.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: [pet] })
    );
    const res = await request(app).get("/api/admin/pets");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("2. POST /api/admin/pets — 201 on create", async () => {
    mockCreatePetCtrl.mockImplementation((_req: any, res: any) =>
      res.status(201).json({ success: true, data: pet })
    );
    const res = await request(app).post("/api/admin/pets")
      .send({ name: "Buddy", species: "Dog", breed: "Lab", age: 2 });
    expect(res.status).toBe(201);
  });

  it("3. PUT /api/admin/pets/:id — 200 on update", async () => {
    mockUpdatePetCtrl.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: { ...pet, status: "adopted" } })
    );
    const res = await request(app).put("/api/admin/pets/p1")
      .send({ status: "adopted" });
    expect(res.status).toBe(200);
  });

  it("4. DELETE /api/admin/pets/:id — 200 on delete", async () => {
    mockDeletePetCtrl.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, message: "Deleted" })
    );
    const res = await request(app).delete("/api/admin/pets/p1");
    expect(res.status).toBe(200);
  });

  it("5. GET /api/admin/pets — empty array when no pets", async () => {
    mockGetAllPetsCtrl.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: [] })
    );
    const res = await request(app).get("/api/admin/pets");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

});