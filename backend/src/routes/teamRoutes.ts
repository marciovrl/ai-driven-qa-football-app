import { Router } from "express";
import { TeamController } from "../controllers/teamController";

export const teamRoutes = Router();

teamRoutes.get("/", TeamController.getAll);
teamRoutes.post("/", TeamController.create);
teamRoutes.delete("/:id", TeamController.delete);
