import { Request, Response } from "express";
import { TeamService } from "../services/teamService";

export const TeamController = {
  getAll: (req: Request, res: Response) => {
    const teams = TeamService.getAllTeams();
    return res.json(teams);
  }
};
