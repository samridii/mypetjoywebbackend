import request from "supertest";
import express from "express";
import adminAdoptionController from "../../../../controllers/admin/adoption.controller";
import adminAdoptionService    from "../../../../services/admin/adoption.service";

jest.mock("../../../../services/admin/adoption.service");
const mockSvc = adminAdoptionService as jest.Mocked<typeof adminAdoptionService>;

const app = express();
app.use(express.json());
app.get("/admin/adoptions",     (req, res) => adminAdoptionController.getAllAdoptions(req, res));
app.put("/admin/adoptions/:id", (req, res) => adminAdoptionController.updateStatus(req, res));

const mockAdoption = { _id: "a1", status: "PENDING", fullName: "Sam" };

describe("Admin Adoption Controller", () => {
  it("1. GET — returns 200 with all adoptions", async () => {
    mockSvc.getAllAdoptions.mockResolvedValue([mockAdoption] as any);
    const res = await request(app).get("/admin/adoptions");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it("2. GET — returns empty array when none exist", async () => {
    mockSvc.getAllAdoptions.mockResolvedValue([]);
    const res = await request(app).get("/admin/adoptions");
    expect(res.body.data).toEqual([]);
  });

  it("3. GET — calls getAllAdoptions exactly once", async () => {
    mockSvc.getAllAdoptions.mockResolvedValue([]);
    await request(app).get("/admin/adoptions");
    expect(mockSvc.getAllAdoptions).toHaveBeenCalledTimes(1);
  });

  it("4. PUT /:id — updates status to APPROVED", async () => {
    mockSvc.updateAdoptionStatus.mockResolvedValue({ ...mockAdoption, status: "APPROVED" } as any);
    const res = await request(app).put("/admin/adoptions/a1").send({ status: "APPROVED" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("APPROVED");
  });

  it("5. PUT /:id — calls updateAdoptionStatus with id and status", async () => {
    mockSvc.updateAdoptionStatus.mockResolvedValue(mockAdoption as any);
    await request(app).put("/admin/adoptions/a1").send({ status: "REJECTED" });
    expect(mockSvc.updateAdoptionStatus).toHaveBeenCalledWith("a1", "REJECTED");
  });

  it("6. PUT /:id — returns success:true", async () => {
    mockSvc.updateAdoptionStatus.mockResolvedValue(mockAdoption as any);
    const res = await request(app).put("/admin/adoptions/a1").send({ status: "APPROVED" });
    expect(res.body.success).toBe(true);
  });
});