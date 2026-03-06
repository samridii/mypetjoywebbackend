jest.mock("jsonwebtoken");
jest.mock("../../../models/user.model");

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../../../models/user.model";
import { authorized, isAdmin, AuthRequest } from "../../../middlewares/authorized.middleware";

const mockJwt  = jwt       as jest.Mocked<typeof jwt>;
const mockFind = UserModel as jest.Mocked<typeof UserModel>;

process.env.JWT_SECRET = "test_secret_32_characters_long!!";
const mockUser = { _id: "u1", email: "sam@test.com", role: "user" };

function make(headers: any = {}, cookies: any = {}, user?: any) {
  const req  = { headers, cookies, user } as unknown as AuthRequest;
  const res  = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}
const selectMock = (val: any) => ({ select: jest.fn().mockResolvedValue(val) });

beforeEach(() => jest.clearAllMocks());

describe("authorized middleware (authorized.middleware.ts)", () => {
  it("1. calls next() with valid Bearer token", async () => {
    const { req, res, next } = make({ authorization: "Bearer valid" });
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    (mockFind.findById as jest.Mock).mockReturnValue(selectMock(mockUser));
    await authorized(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("2. attaches user to req.user on success", async () => {
    const { req, res, next } = make({ authorization: "Bearer valid" });
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    (mockFind.findById as jest.Mock).mockReturnValue(selectMock(mockUser));
    await authorized(req, res, next);
    expect(req.user).toMatchObject({ email: "sam@test.com" });
  });

  it("3. reads token from cookie when no Authorization header", async () => {
    const { req, res, next } = make({}, { auth_token: "cookie_tok" });
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    (mockFind.findById as jest.Mock).mockReturnValue(selectMock(mockUser));
    await authorized(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(mockJwt.verify).toHaveBeenCalledWith("cookie_tok", expect.any(String));
  });

  it("4. prefers Bearer header over cookie when both present", async () => {
    const { req, res, next } = make(
      { authorization: "Bearer header_tok" },
      { auth_token: "cookie_tok" }
    );
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    (mockFind.findById as jest.Mock).mockReturnValue(selectMock(mockUser));
    await authorized(req, res, next);
    expect(mockJwt.verify).toHaveBeenCalledWith("header_tok", expect.any(String));
  });

  it("5. returns 401 with token missing when no header and no cookie", async () => {
    const { req, res, next } = make({}, {});
    await authorized(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, token missing" });
    expect(next).not.toHaveBeenCalled();
  });

  it("6. returns 401 when Authorization is not Bearer scheme", async () => {
    const { req, res, next } = make({ authorization: "Basic abc" }, {});
    await authorized(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, token missing" });
  });

  it("7. returns 401 when user not found in DB", async () => {
    const { req, res, next } = make({ authorization: "Bearer valid" });
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    (mockFind.findById as jest.Mock).mockReturnValue(selectMock(null));
    await authorized(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("8. returns 401 when jwt.verify throws", async () => {
    const { req, res, next } = make({ authorization: "Bearer bad" });
    (mockJwt.verify as jest.Mock).mockImplementation(() => { throw new Error("invalid"); });
    await authorized(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized, token failed" });
  });

  it("9. calls select('-password') on findById result", async () => {
    const { req, res, next } = make({ authorization: "Bearer tok" });
    (mockJwt.verify as jest.Mock).mockReturnValue({ id: "u1" });
    const selectFn = jest.fn().mockResolvedValue(mockUser);
    (mockFind.findById as jest.Mock).mockReturnValue({ select: selectFn });
    await authorized(req, res, next);
    expect(selectFn).toHaveBeenCalledWith("-password");
  });
});

describe("isAdmin middleware (authorized.middleware.ts)", () => {
  it("10. calls next() when user is admin", () => {
    const { req, res, next } = make({}, {}, { role: "admin" });
    isAdmin(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("11. returns 403 when user role is 'user'", () => {
    const { req, res, next } = make({}, {}, { role: "user" });
    isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access denied, admin only" });
    expect(next).not.toHaveBeenCalled();
  });

  it("12. returns 401 when req.user is undefined", () => {
    const { req, res, next } = make({}, {}, undefined);
    isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized" });
  });

  it("13. returns 401 when req.user is null", () => {
    const { req, res, next } = make({}, {}, null);
    isAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});