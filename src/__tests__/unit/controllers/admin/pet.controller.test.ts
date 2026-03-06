
import request from "supertest";
import express from "express";
import adminPetController from "../../../../controllers/admin/pet.controller";
import adminPetService    from "../../../../services/admin/pet.service";

jest.mock("../../../../services/admin/pet.service");
const mockSvc = adminPetService as jest.Mocked<typeof adminPetService>;

const app = express();
app.use(express.json());
app.post("/admin/pets",         (req, res) => adminPetController.createPet(req, res));
app.get("/admin/pets",          (req, res) => adminPetController.getAllPets(req, res));
app.put("/admin/pets/:id",      (req, res) => adminPetController.updatePet(req, res));
app.delete("/admin/pets/:id",   (req, res) => adminPetController.deletePet(req, res));

const mockPet = { _id: "p1", name: "Buddy", type: "dog", breed: "Labrador", age: 2 };

describe("Admin Pet Controller", () => {
  it("1. POST — returns 201 with pet", async () => {
    mockSvc.createPet.mockResolvedValue(mockPet as any);
    const res = await request(app).post("/admin/pets").send({ name: "Buddy" });
    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe("Buddy");
  });

  it("2. POST — calls createPet with body", async () => {
    mockSvc.createPet.mockResolvedValue(mockPet as any);
    await request(app).post("/admin/pets").send({ name: "Buddy", type: "dog" });
    expect(mockSvc.createPet).toHaveBeenCalledWith(expect.objectContaining({ name: "Buddy" }));
  });

  it("3. GET — returns all pets", async () => {
    mockSvc.getAllPets.mockResolvedValue([mockPet] as any);
    const res = await request(app).get("/admin/pets");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("4. GET — returns empty array when none", async () => {
    mockSvc.getAllPets.mockResolvedValue([]);
    const res = await request(app).get("/admin/pets");
    expect(res.body.data).toEqual([]);
  });

  it("5. PUT /:id — updates pet", async () => {
    mockSvc.updatePet.mockResolvedValue({ ...mockPet, name: "Max" } as any);
    const res = await request(app).put("/admin/pets/p1").send({ name: "Max" });
    expect(res.body.data.name).toBe("Max");
  });

  it("6. PUT /:id — calls updatePet with id and body", async () => {
    mockSvc.updatePet.mockResolvedValue(mockPet as any);
    await request(app).put("/admin/pets/p1").send({ age: 3 });
    expect(mockSvc.updatePet).toHaveBeenCalledWith("p1", expect.objectContaining({ age: 3 }));
  });

  it("7. DELETE /:id — returns success message", async () => {
    mockSvc.deletePet.mockResolvedValue(undefined as any);
    const res = await request(app).delete("/admin/pets/p1");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Pet deleted successfully");
  });

  it("8. DELETE /:id — calls deletePet with correct id", async () => {
    mockSvc.deletePet.mockResolvedValue(undefined as any);
    await request(app).delete("/admin/pets/p1");
    expect(mockSvc.deletePet).toHaveBeenCalledWith("p1");
  });
});