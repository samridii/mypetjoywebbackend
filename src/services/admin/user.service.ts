// import { UserModel } from "../../models/user.model";
// import { IUser } from "../../models/user.model";

//  user (Admin)

// export const createUser = async (data: Partial<IUser>) => {
//   return await UserModel.create(data);
// };


// export const getAllUsers = async () => {
//   return await UserModel.find().select("-password");
// };


// export const getUserById = async (id: string) => {
//   return await UserModel.findById(id).select("-password");
// };

// export const updateUser = async (
//   id: string,
//   data: Partial<IUser>
// ) => {
//   return await UserModel.findByIdAndUpdate(id, data, {
//     new: true,
//   }).select("-password");
// };

// export const deleteUser = async (id: string) => {
//   return await UserModel.findByIdAndDelete(id);
// };
