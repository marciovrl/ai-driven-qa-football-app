import { TeamRepository } from "../repositories/teamRepository";

export const TeamService = {
  getAllTeams: () => {
    const teams = TeamRepository.getAll();

    return teams;
  }
};
