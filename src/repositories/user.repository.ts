import UserModel, { IUser } from "../models/user.model";

export class UserRepository {
  async getUserById(id: string) {
    return UserModel.findById(id);
  }

  async createUser(user: Partial<IUser>) {
    return UserModel.create(user);
  }

  async findUserByEmail(email: string) {
    // FIXED: select +password since password has select:false in schema now
    return UserModel.findOne({ email }).select("+password +resetPasswordToken +resetPasswordExpires");
  }

  async findByResetPasswordToken(token: string) {
    return UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password +resetPasswordToken +resetPasswordExpires");
  }
}
