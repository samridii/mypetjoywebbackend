
import { Response, NextFunction } from "express";
import adminMiddleware, { isAdmin } from "../../../middlewares/admin.middleware";

function make(user?: any) {
  const req  = { user } as any;
  const res  = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}

beforeEach(() => jest.clearAllMocks());

describe("adminMiddleware — default export", () => {
  it("1. calls next() when user is admin", () => {
    const { req, res, next } = make({ role: "admin" });
    adminMiddleware(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("2. returns 403 when user role is 'user'", () => {
    const { req, res, next } = make({ role: "user" });
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access denied. Admin only." });
    expect(next).not.toHaveBeenCalled();
  });

  it("3. returns 403 for any non-admin role string", () => {
    const { req, res, next } = make({ role: "moderator" });
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("4. returns 401 when req.user is undefined", () => {
    const { req, res, next } = make(undefined);
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Not authorized" });
    expect(next).not.toHaveBeenCalled();
  });

  it("5. returns 401 when req.user is null", () => {
    const { req, res, next } = make(null);
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("6. returns 500 when accessing req.user throws", () => {
    const { res, next } = make();
    const req = {} as any;
    Object.defineProperty(req, "user", { get() { throw new Error("boom"); } });
    adminMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("isAdmin — named export", () => {
  it("7. calls next() for admin role", () => {
    const { req, res, next } = make({ role: "admin" });
    isAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("8. isAdmin and adminMiddleware are the same reference", () => {
    expect(isAdmin).toBe(adminMiddleware);
  });
});