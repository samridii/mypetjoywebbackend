jest.mock("../../../models/user.model");

import UserModel from "../../../models/user.model";
import { UserRepository } from "../../../repositories/user.repository";

const mockUserModel = UserModel as jest.Mocked<typeof UserModel>;
const mockUser      = { _id: "u1", fullName: "Sam", email: "sam@test.com", role: "user" };
const selectMock    = (val: any) => ({ select: jest.fn().mockResolvedValue(val) });

let repo: UserRepository;
beforeEach(() => { jest.clearAllMocks(); repo = new UserRepository(); });

describe("UserRepository", () => {
  it("1. getUserById — calls findById with id", async () => {
    (mockUserModel.findById as jest.Mock).mockResolvedValue(mockUser);
    const result = await repo.getUserById("u1");
    expect(mockUserModel.findById).toHaveBeenCalledWith("u1");
    expect(result).toMatchObject({ _id: "u1" });
  });

  it("2. getUserById — returns null when not found", async () => {
    (mockUserModel.findById as jest.Mock).mockResolvedValue(null);
    const result = await repo.getUserById("bad");
    expect(result).toBeNull();
  });

  it("3. createUser — calls UserModel.create with data", async () => {
    (mockUserModel.create as jest.Mock).mockResolvedValue(mockUser);
    const result = await repo.createUser({ fullName: "Sam", email: "sam@test.com" } as any);
    expect(mockUserModel.create).toHaveBeenCalledWith({ fullName: "Sam", email: "sam@test.com" });
    expect(result).toMatchObject({ _id: "u1" });
  });

  it("4. findUserByEmail — calls findOne with email", async () => {
    (mockUserModel.findOne as jest.Mock).mockReturnValue(selectMock(mockUser));
    await repo.findUserByEmail("sam@test.com");
    expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: "sam@test.com" });
  });

  it("5. findUserByEmail — selects +password and reset token fields", async () => {
    const selectFn = jest.fn().mockResolvedValue(mockUser);
    (mockUserModel.findOne as jest.Mock).mockReturnValue({ select: selectFn });
    await repo.findUserByEmail("sam@test.com");
    expect(selectFn).toHaveBeenCalledWith("+password +resetPasswordToken +resetPasswordExpires");
  });

  it("6. findUserByEmail — returns null when user not found", async () => {
    (mockUserModel.findOne as jest.Mock).mockReturnValue(selectMock(null));
    const result = await repo.findUserByEmail("nobody@test.com");
    expect(result).toBeNull();
  });

  it("7. findByResetPasswordToken — calls findOne with token and expiry $gt", async () => {
    (mockUserModel.findOne as jest.Mock).mockReturnValue(selectMock(mockUser));
    await repo.findByResetPasswordToken("hashed_token");
    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      resetPasswordToken: "hashed_token",
      resetPasswordExpires: { $gt: expect.any(Date) },
    });
  });

  it("8. findByResetPasswordToken — returns null when expired or not found", async () => {
    (mockUserModel.findOne as jest.Mock).mockReturnValue(selectMock(null));
    const result = await repo.findByResetPasswordToken("bad_token");
    expect(result).toBeNull();
  });
});