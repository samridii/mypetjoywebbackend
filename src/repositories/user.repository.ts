import { UserModel, IUser } from "../models/user.model";

export class UserRepository {
  async getUserByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return UserModel.findOne({ username });
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(data);
    return user.save();
  }
}
