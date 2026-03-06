import { fileFilter, uploads } from "../../../middlewares/upload.middleware";
import { HttpError } from "../../../errors/http-error";
import { Request } from "express";

describe("upload middleware — fileFilter", () => {
  const req = {} as Request;

  it("1. accepts image/jpeg files", () => {
    const cb = jest.fn();
    const file = { mimetype: "image/jpeg" } as Express.Multer.File;
    fileFilter(req, file, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it("2. accepts image/png files", () => {
    const cb = jest.fn();
    fileFilter(req, { mimetype: "image/png" } as Express.Multer.File, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it("3. accepts any file starting with 'image'", () => {
    const cb = jest.fn();
    fileFilter(req, { mimetype: "image/gif" } as Express.Multer.File, cb);
    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it("4. rejects application/pdf with HttpError", () => {
    const cb = jest.fn();
    fileFilter(req, { mimetype: "application/pdf" } as Express.Multer.File, cb);
    const err = cb.mock.calls[0][0];
    expect(err).toBeInstanceOf(HttpError);
    expect((err as HttpError).statusCode).toBe(400);
  });

  it("5. rejects text/plain with HttpError message", () => {
    const cb = jest.fn();
    fileFilter(req, { mimetype: "text/plain" } as Express.Multer.File, cb);
    const err = cb.mock.calls[0][0] as HttpError;
    expect(err.message).toContain("Invalid file type");
  });
});

describe("upload middleware — uploads object", () => {
  it("6. uploads.single returns a function", () => {
    expect(typeof uploads.single("image")).toBe("function");
  });

  it("7. uploads.array returns a function", () => {
    expect(typeof uploads.array("images", 5)).toBe("function");
  });

  it("8. uploads.fields returns a function", () => {
    expect(typeof uploads.fields([{ name: "image", maxCount: 1 }])).toBe("function");
  });
});