import fs from "fs";
import path from "path";

const teamsPath = path.resolve(__dirname, "../../data/teams.json");

export const TeamRepository = {
  getAll: () => {
    const data = fs.readFileSync(teamsPath, "utf-8");
    return JSON.parse(data);
  }
};
