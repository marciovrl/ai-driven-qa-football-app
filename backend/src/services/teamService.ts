import { TeamRepository } from "../repositories/teamRepository";
import { AppError } from "../errors/appError";
import { CreateTeamInput } from "../types/team";

export const TeamService = {
  getAllTeams: () => {
    const teams = TeamRepository.getAll();

    return teams;
  },
  createTeam: (input: CreateTeamInput) => {
    if (!input.name || !input.name.trim()) {
      throw new AppError("Name is not informed.", 400);
    }

    return TeamRepository.create({
      name: input.name.trim(),
      address: input.address ?? null,
      nickname: input.nickname ?? null,
      titles: input.titles ?? null
    });
  },
  deleteTeam: (idParam: string) => {
    if (!idParam || !idParam.trim()) {
      throw new AppError(
        "Invalid team id. Please provide a positive integer.",
        400
      );
    }

    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError(
        "Invalid team id. Please provide a positive integer.",
        400
      );
    }

    const deletedTeam = TeamRepository.deleteById(id);
    if (!deletedTeam) {
      throw new AppError("Team not found for the given id.", 404);
    }

    return deletedTeam;
  }
};
