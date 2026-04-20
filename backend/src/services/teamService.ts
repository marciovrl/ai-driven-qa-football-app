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
  }
};
