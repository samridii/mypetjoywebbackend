import { Request, Response } from "express";
import { UserModel } from "../../models/user.model";

export const createUser = async (req: Request, res: Response) => {
  const user = await UserModel.create({ ...req.body, image: req.file?.path });
  res.json(user);
};

export const getUsers = async (_: Request, res: Response) => {
  res.json(await UserModel.find());
};

export const getUserById = async (req: Request, res: Response) => {
  res.json(await UserModel.findById(req.params.id));
};

export const updateUser = async (req: Request, res: Response) => {
  res.json(
    await UserModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: req.file?.path },
      { new: true }
    )
  );
};

export const deleteUser = async (req: Request, res: Response) => {
  await UserModel.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};
