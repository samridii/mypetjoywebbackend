import Pet, { IPet } from "../models/pet.model";

class PetRepository {
  async create(data: Partial<IPet>): Promise<IPet> {
    return await Pet.create(data);
  }

  async findAll(): Promise<IPet[]> {
    return await Pet.find();
  }

  async findById(id: string): Promise<IPet | null> {
    return await Pet.findById(id);
  }

  async update(id: string, data: Partial<IPet>): Promise<IPet | null> {
    return await Pet.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IPet | null> {
    return await Pet.findByIdAndDelete(id);
  }
}

export default new PetRepository();