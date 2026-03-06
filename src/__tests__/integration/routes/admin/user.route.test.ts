jest.mock("../../../../controllers/admin/admin.controller", () => ({
  getUsers:    jest.fn(),
  getUserById: jest.fn(),
  updateUser:  jest.fn(),
  deleteUser:  jest.fn(),
}));

jest.mock("../../../../middlewares/auth.middleware", () => ({
  __esModule: true,
  default: (_: any, __: any, next: any) => next(),
}));

jest.mock("../../../../middlewares/admin.middleware", () => ({
  __esModule: true,
  default: (_: any, __: any, next: any) => next(),
}));

import request           from "supertest";
import express           from "express";
import adminUserRouter   from "../../../../routes/admin/user.route";
import * as adminCtrl    from "../../../../controllers/admin/admin.controller";

const mockGetUsers    = adminCtrl.getUsers    as jest.Mock;
const mockGetUserById = adminCtrl.getUserById as jest.Mock;
const mockUpdateUser  = adminCtrl.updateUser  as jest.Mock;
const mockDeleteUser  = adminCtrl.deleteUser  as jest.Mock;

const app = express();
app.use(express.json());
app.use("/api/admin/users", adminUserRouter);
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.statusCode ?? 500).json({ success: false, message: err.message });
});

const mockUser = { _id: "u1", fullName: "Sam", email: "sam@test.com", role: "user" };

beforeEach(() => jest.clearAllMocks());

describe("Admin User Routes", () => {

  it("1. GET /api/admin/users — 200 with all users", async () => {
    mockGetUsers.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: [mockUser] })
    );
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("2. GET /api/admin/users — empty array when no users", async () => {
    mockGetUsers.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: [] })
    );
    const res = await request(app).get("/api/admin/users");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it("3. GET /api/admin/users/:id — 200 with single user", async () => {
    mockGetUserById.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: mockUser })
    );
    const res = await request(app).get("/api/admin/users/u1");
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("sam@test.com");
  });

  it("4. GET /api/admin/users/:id — 404 when user not found", async () => {
    mockGetUserById.mockImplementation((_req: any, res: any) =>
      res.status(404).json({ success: false, message: "User not found" })
    );
    const res = await request(app).get("/api/admin/users/bad");
    expect(res.status).toBe(404);
  });

  it("5. PUT /api/admin/users/:id — 200 on update", async () => {
    mockUpdateUser.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: { ...mockUser, fullName: "Updated" } })
    );
    const res = await request(app).put("/api/admin/users/u1")
      .send({ fullName: "Updated" });
    expect(res.status).toBe(200);
  });

  it("6. DELETE /api/admin/users/:id — 200 on delete", async () => {
    mockDeleteUser.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, message: "User deleted" })
    );
    const res = await request(app).delete("/api/admin/users/u1");
    expect(res.status).toBe(200);
  });

  it("7. GET /api/admin/users — getUsers controller is called once", async () => {
    mockGetUsers.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true, data: [] })
    );
    await request(app).get("/api/admin/users");
    expect(mockGetUsers).toHaveBeenCalledTimes(1);
  });

  it("8. DELETE /api/admin/users/:id — deleteUser controller is called once", async () => {
    mockDeleteUser.mockImplementation((_req: any, res: any) =>
      res.status(200).json({ success: true })
    );
    await request(app).delete("/api/admin/users/u1");
    expect(mockDeleteUser).toHaveBeenCalledTimes(1);
  });

});