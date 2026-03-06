const mockFindUserByEmail       = jest.fn();
const mockCreateUser            = jest.fn();
const mockFindByResetToken      = jest.fn();

jest.mock("../../../repositories/user.repository", () => ({
  UserRepository: jest.fn().mockImplementation(() => ({
    findUserByEmail:          mockFindUserByEmail,
    createUser:               mockCreateUser,
    findByResetPasswordToken: mockFindByResetToken,
  })),
}));

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("crypto");

import bcryptjs        from "bcryptjs";
import jwt             from "jsonwebtoken";
import crypto          from "crypto";
import { UserService } from "../../../services/user.service";

const mockBcrypt = bcryptjs as jest.Mocked<typeof bcryptjs>;
const mockJwt    = jwt     as jest.Mocked<typeof jwt>;
const mockCrypto = crypto  as jest.Mocked<typeof crypto>;

const mockUser = {
  _id: "u1", fullName: "Sam", email: "sam@test.com",
  password: "hashed", role: "user",
  resetPasswordToken: undefined, resetPasswordExpires: undefined,
  save: jest.fn(),
};

let service: UserService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new UserService();
  (mockBcrypt.hash    as jest.Mock).mockResolvedValue("hashed_pw" as any);
  (mockBcrypt.compare as jest.Mock).mockResolvedValue(true as any);
  (mockJwt.sign       as jest.Mock).mockReturnValue("jwt_token" as any);
});

describe("UserService — createUser", () => {
  it("1. throws 403 when email already in use", async () => {
    mockFindUserByEmail.mockResolvedValue(mockUser);
    await expect(service.createUser({ fullName: "Sam", email: "sam@test.com", password: "pass" } as any))
      .rejects.toMatchObject({ statusCode: 403 });
  });

  it("2. hashes password before saving", async () => {
    mockFindUserByEmail.mockResolvedValue(null);
    mockCreateUser.mockResolvedValue(mockUser);
    await service.createUser({ fullName: "Sam", email: "sam@test.com", password: "pass" } as any);
    expect(mockBcrypt.hash).toHaveBeenCalledWith("pass", 10);
  });

  it("3. returns id, fullName, email, role on success", async () => {
    mockFindUserByEmail.mockResolvedValue(null);
    mockCreateUser.mockResolvedValue(mockUser);
    const result = await service.createUser({ fullName: "Sam", email: "sam@test.com", password: "pass" } as any);
    expect(result).toMatchObject({ fullName: "Sam", email: "sam@test.com" });
  });
});

describe("UserService — loginUser", () => {
  it("4. throws 404 when user not found", async () => {
    mockFindUserByEmail.mockResolvedValue(null);
    await expect(service.loginUser({ email: "x@x.com", password: "pass" }))
      .rejects.toMatchObject({ statusCode: 404 });
  });

  it("5. throws 401 on invalid password", async () => {
    mockFindUserByEmail.mockResolvedValue(mockUser);
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(false as any);
    await expect(service.loginUser({ email: "sam@test.com", password: "wrong" }))
      .rejects.toMatchObject({ statusCode: 401 });
  });

  it("6. returns token and user on success", async () => {
    mockFindUserByEmail.mockResolvedValue(mockUser);
    const result = await service.loginUser({ email: "sam@test.com", password: "pass" });
    expect(result.token).toBe("jwt_token");
    expect(result.user.email).toBe("sam@test.com");
  });
});

describe("UserService — resetPassword", () => {
  it("7. throws 400 when token is invalid or expired", async () => {
    (mockCrypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue("hashed"),
    });
    mockFindByResetToken.mockResolvedValue(null);
    await expect(service.resetPassword("badtoken", "NewPass1!"))
      .rejects.toMatchObject({ statusCode: 400 });
  });

  it("8. clears token fields and saves on success", async () => {
    (mockCrypto.createHash as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue("hashed"),
    });
    mockFindByResetToken.mockResolvedValue(mockUser);
    await service.resetPassword("validtoken", "NewPass1!");
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockUser.resetPasswordToken).toBeUndefined();
  });
});