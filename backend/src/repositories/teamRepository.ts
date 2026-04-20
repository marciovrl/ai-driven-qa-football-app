import fs from "fs";
import path from "path";
import { Team } from "../types/team";

const teamsPath = path.resolve(__dirname, "../../data/teams.json");

export const TeamRepository = {
  getAll: () => {
    const data = fs.readFileSync(teamsPath, "utf-8");
    return JSON.parse(data);
  },
  create: (team: Omit<Team, "id">) => {
    const teams = TeamRepository.getAll() as Team[];
    const lastId = teams.length ? Math.max(...teams.map((existingTeam) => existingTeam.id)) : 0;
    const newTeam: Team = {
      id: lastId + 1,
      ...team
    };

    teams.push(newTeam);
    fs.writeFileSync(teamsPath, JSON.stringify(teams, null, 2), "utf-8");

    return newTeam;
  }
};
