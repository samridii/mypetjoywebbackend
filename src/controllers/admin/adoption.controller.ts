import { Request, Response } from "express";
import adminAdoptionService from "../../services/admin/adoption.service";

class AdminAdoptionController {
  async getAllAdoptions(req: Request, res: Response) {
    const adoptions = await adminAdoptionService.getAllAdoptions();
    res.json({ success: true, data: adoptions });
  }

  async updateStatus(req: Request, res: Response) {
    const { status } = req.body;

    const adoption = await adminAdoptionService.updateAdoptionStatus(
      req.params.id,
      status
    );

    res.json({ success: true, data: adoption });
  }
}

export default new AdminAdoptionController();