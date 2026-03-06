jest.mock("@/config/env", () => ({
  __esModule: true,
  default: { NODE_ENV: "development" },
}));

import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../../middlewares/error.middleware";
import {
  HttpError, BadRequestError, UnauthorizedError,
  ForbiddenError, NotFoundError, ConflictError,
} from "../../../errors/http-error";

function make() {
  const req  = {} as Request;
  const res  = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}

beforeEach(() => jest.clearAllMocks());

describe("errorHandler — HttpError instances (development mode)", () => {
  it("1. returns correct statusCode for HttpError", () => {
    const { req, res, next } = make();
    errorHandler(new HttpError(422, "Unprocessable"), req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
  });

  it("2. returns success:false for HttpError", () => {
    const { req, res, next } = make();
    errorHandler(new HttpError(400, "Bad"), req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it("3. returns error message for HttpError", () => {
    const { req, res, next } = make();
    errorHandler(new HttpError(400, "Bad input"), req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Bad input" }));
  });

  it("4. includes stack in development mode", () => {
    const { req, res, next } = make();
    errorHandler(new HttpError(400, "Dev error"), req, res, next);
    const body = (res.json as jest.Mock).mock.calls[0][0];
    expect(body.stack).toBeDefined();
  });

  it("5. handles BadRequestError (400) with default message", () => {
    const { req, res, next } = make();
    errorHandler(new BadRequestError(), req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Bad Request" }));
  });

  it("6. handles BadRequestError with custom message", () => {
    const { req, res, next } = make();
    errorHandler(new BadRequestError("Invalid input"), req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Invalid input" }));
  });

  it("7. handles UnauthorizedError (401)", () => {
    const { req, res, next } = make();
    errorHandler(new UnauthorizedError(), req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("8. handles ForbiddenError (403)", () => {
    const { req, res, next } = make();
    errorHandler(new ForbiddenError(), req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("9. handles NotFoundError (404) with default message", () => {
    const { req, res, next } = make();
    errorHandler(new NotFoundError(), req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Not Found" }));
  });

  it("10. handles ConflictError (409)", () => {
    const { req, res, next } = make();
    errorHandler(new ConflictError("Already exists"), req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Already exists" }));
  });
});

describe("errorHandler — unknown errors (development mode)", () => {
  it("11. returns 500 for plain Error", () => {
    const { req, res, next } = make();
    errorHandler(new Error("Something broke"), req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("12. returns success:false for unknown error", () => {
    const { req, res, next } = make();
    errorHandler(new Error("crash"), req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it("13. returns Internal Server Error message", () => {
    const { req, res, next } = make();
    errorHandler(new Error("crash"), req, res, next);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Internal Server Error" }));
  });

  it("14. includes original error message in development", () => {
    const { req, res, next } = make();
    errorHandler(new Error("raw message"), req, res, next);
    const body = (res.json as jest.Mock).mock.calls[0][0];
    expect(body.message).toBe("raw message");
  });

  it("15. handles TypeError as unknown error", () => {
    const { req, res, next } = make();
    errorHandler(new TypeError("type mismatch"), req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("errorHandler — production mode", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.doMock("@/config/env", () => ({
      __esModule: true,
      default: { NODE_ENV: "production" },
    }));
  });

  it("16. does not include stack in production for HttpError", async () => {
    const { errorHandler: prodHandler } = await import("../../../middlewares/error.middleware");
    const { req, res, next } = make();
    prodHandler(new HttpError(400, "Bad"), req, res, next);
    const body = (res.json as jest.Mock).mock.calls[0][0];
    expect(body.stack).toBeUndefined();
  });

  it("17. does not include message field in production for unknown error", async () => {
    const { errorHandler: prodHandler } = await import("../../../middlewares/error.middleware");
    const { req, res, next } = make();
    prodHandler(new Error("internal detail"), req, res, next);
    const body = (res.json as jest.Mock).mock.calls[0][0];
    expect(body.message).toBeUndefined();
  });
});