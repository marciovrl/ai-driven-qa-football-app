import { NextFunction, Request, Response } from "express";
import { TeamService } from "../services/teamService";

export const TeamController = {
  getAll: (req: Request, res: Response) => {
    const teams = TeamService.getAllTeams();
    return res.json(teams);
  },
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      const newTeam = TeamService.createTeam(req.body);
      return res.status(201).json(newTeam);
    } catch (error) {
      return next(error);
    }
  },
  delete: (req: Request, res: Response, next: NextFunction) => {
    try {
      const idParam = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;
      const deletedTeam = TeamService.deleteTeam(idParam ?? "");
      return res.status(200).json(deletedTeam);
    } catch (error) {
      return next(error);
    }
  }
};
