import Adoption, { IAdoption } from "../models/adoption.model";

class AdoptionRepository {
  async create(data: Partial<IAdoption>): Promise<IAdoption> {
    return await Adoption.create(data);
  }

  async findAll(): Promise<IAdoption[]> {
    return await Adoption.find().populate("user").populate("pet");
  }

  async findById(id: string): Promise<IAdoption | null> {
    return await Adoption.findById(id);
  }

  async update(id: string, data: Partial<IAdoption>) {
    return await Adoption.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new AdoptionRepository();