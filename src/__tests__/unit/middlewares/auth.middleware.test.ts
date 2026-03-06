
jest.mock("jsonwebtoken");
jest.mock("../../../models/user.model");

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../../models/user.model";
import authorized, { isAdmin, AuthRequest } from "../../../middlewares/auth.middleware";

const mockJwt  = jwt       as jest.Mocked<typeof jwt>;
const mockFind = UserModel as jest.Mocked<typeof UserModel>;

process.env.JWT_SECRET = "test_secret_32_characters_long!!";
const mockUser = { _id: "u1", email: "sam@test.com", role: "user" };

function make(headers: any = {}, user?: any) {
  const req  = { headers, user } as unknown as AuthRequest;
  const res  = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}
const bearer     = (t: string) => ({ authorization: `Bearer ${t}` });
const selectMock = (val: any) => ({ select: jest.fn().mockResolvedValue(val) });

beforeEach(() => jest.clearAllMocks());

describe("authorized middleware (auth.middleware.ts)", () => {
  it("1. calls next() with valid Bearer token and existing user", async () => {
    const { req, res, next } = make(bearer("valid"));
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    (mockFind.findById as jest.Mock).mockReturnValue(selectMock(mockUser));
    await authorized(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("2. attaches user to req.user", async () => {
    const { req, res, next } = make(bearer("valid"));
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    (mockFind.findById as jest.Mock).mockReturnValue(selectMock(mockUser));
    await authorized(req, res, next);
    expect(req.user).toMatchObject({ email: "sam@test.com" });
  });

  it("3. calls findById with decoded id", async () => {
    const { req, res, next } = make(bearer("valid"));
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    (mockFind.findById as jest.Mock).mockReturnValue(selectMock(mockUser));
    await authorized(req, res, next);
    expect(mockFind.findById).toHaveBeenCalledWith("u1");
  });

  it("4. calls select to exclude sensitive fields", async () => {
    const { req, res, next } = make(bearer("valid"));
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    const selectFn = jest.fn().mockResolvedValue(mockUser);
    (mockFind.findById as jest.Mock).mockReturnValue({ select: selectFn });
    await authorized(req, res, next);
    expect(selectFn).toHaveBeenCalledWith("-password -resetPasswordToken -resetPasswordExpires");
  });

  it("5. returns 401 when no Authorization header", async () => {
    const { req, res, next } = make({});
    await authorized(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, no token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("6. returns 401 when Authorization is not Bearer scheme", async () => {
    const { req, res, next } = make({ authorization: "Basic abc123" });
    await authorized(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, no token" });
  });

  it("7. returns 401 when user not found in DB", async () => {
    const { req, res, next } = make(bearer("valid"));
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    (mockFind.findById as jest.Mock).mockReturnValue(selectMock(null));
    await authorized(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("8. returns 401 when jwt.verify throws", async () => {
    const { req, res, next } = make(bearer("bad"));
    (mockJwt.verify as jest.Mock).mockImplementation(() => { throw new Error("invalid"); });
    await authorized(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, token failed" });
  });

  it("9. does not call next() on token failure", async () => {
    const { req, res, next } = make(bearer("bad"));
    (mockJwt.verify as jest.Mock).mockImplementation(() => { throw new Error(); });
    await authorized(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("isAdmin middleware (auth.middleware.ts)", () => {
  it("10. calls next() when user is admin", () => {
    const { req, res, next } = make({}, { role: "admin" });
    isAdmin(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("11. returns 403 when user role is 'user'", () => {
    const { req, res, next } = make({}, { role: "user" });
    isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access denied. Admin only." });
    expect(next).not.toHaveBeenCalled();
  });

  it("12. returns 401 when req.user is undefined", () => {
    const { req, res, next } = make({}, undefined);
    isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized" });
  });

  it("13. returns 500 when accessing req.user throws", () => {
    const res  = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const req  = {} as unknown as AuthRequest;
    Object.defineProperty(req, "user", { get() { throw new Error("crash"); } });
    isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});