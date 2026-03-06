import request from "supertest";
import express from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser } from "../../../../controllers/admin/admin.controller";
import { UserModel } from "../../../../models/user.model";

jest.mock("../../../../models/user.model");
const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;

const app = express();
app.use(express.json());
app.post("/admin/users",       (req, res) => createUser(req, res));
app.get("/admin/users",        (req, res) => getUsers(req, res));
app.get("/admin/users/:id",    (req, res) => getUserById(req, res));
app.put("/admin/users/:id",    (req, res) => updateUser(req, res));
app.delete("/admin/users/:id", (req, res) => deleteUser(req, res));

const mockUser = { _id: "u1", fullName: "Sam Kim", email: "sam@test.com", role: "user" };

describe("Admin User Controller", () => {
  it("1. POST — creates user and returns it", async () => {
    (mockUserModel.create as jest.Mock).mockResolvedValue(mockUser);
    const res = await request(app).post("/admin/users").send({ fullName: "Sam Kim", email: "sam@test.com" });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("sam@test.com");
  });
  it("2. POST — calls UserModel.create with req.body", async () => {
    (mockUserModel.create as jest.Mock).mockResolvedValue(mockUser);
    await request(app).post("/admin/users").send({ fullName: "Sam Kim" });
    expect(mockUserModel.create).toHaveBeenCalledWith(expect.objectContaining({ fullName: "Sam Kim" }));
  });
  it("3. POST — image is undefined when no file uploaded", async () => {
    (mockUserModel.create as jest.Mock).mockResolvedValue(mockUser);
    await request(app).post("/admin/users").send({ fullName: "Sam" });
    expect(mockUserModel.create).toHaveBeenCalledWith(expect.objectContaining({ image: undefined }));
  });
  it("4. GET — returns all users as array", async () => {
    (mockUserModel.find as jest.Mock).mockResolvedValue([mockUser]);
    const res = await request(app).get("/admin/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });
  it("5. GET — returns empty array when no users", async () => {
    (mockUserModel.find as jest.Mock).mockResolvedValue([]);
    const res = await request(app).get("/admin/users");
    expect(res.body).toEqual([]);
  });
  it("6. GET — calls UserModel.find once", async () => {
    (mockUserModel.find as jest.Mock).mockResolvedValue([]);
    await request(app).get("/admin/users");
    expect(mockUserModel.find).toHaveBeenCalledTimes(1);
  });
  it("7. GET /:id — returns user by id", async () => {
    (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    const res = await request(app).get("/admin/users/u1");
    expect(res.status).toBe(200);
    expect(res.body._id).toBe("u1");
  });
  it("8. GET /:id — calls findById with correct id", async () => {
    (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    await request(app).get("/admin/users/u1");
    expect(mockUserModel.findById).toHaveBeenCalledWith("u1");
  });
  it("9. GET /:id — returns null when not found", async () => {
    (mockUserModel.findById as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get("/admin/users/bad");
    expect(res.body).toBeNull();
  });
  it("10. PUT /:id — updates and returns user", async () => {
    (mockUserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({ ...mockUser, fullName: "Updated" });
    const res = await request(app).put("/admin/users/u1").send({ fullName: "Updated" });
    expect(res.status).toBe(200);
    expect(res.body.fullName).toBe("Updated");
  });
  it("11. PUT /:id — calls findByIdAndUpdate with { new: true }", async () => {
    (mockUserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUser);
    await request(app).put("/admin/users/u1").send({ fullName: "X" });
    expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith("u1", expect.any(Object), { new: true });
  });
  it("12. DELETE /:id — returns Deleted message", async () => {
    (mockUserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);
    const res = await request(app).delete("/admin/users/u1");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Deleted");
  });
  it("13. DELETE /:id — calls findByIdAndDelete with correct id", async () => {
    (mockUserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);
    await request(app).delete("/admin/users/u1");
    expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith("u1");
  });
});