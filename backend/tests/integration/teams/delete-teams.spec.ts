import { Response } from "superagent";
import fs from "fs";
import path from "path";
import { createTeam, deleteTeam } from "./utils";
import { teamSchema } from "./schema";

describe("DELETE /api/v1/teams/:id", () => {
  const teamsPath = path.resolve(__dirname, "../../../data/teams.json");
  let originalTeamsData = "";

  beforeAll(() => {
    originalTeamsData = fs.readFileSync(teamsPath, "utf-8");
  });

  afterAll(() => {
    fs.writeFileSync(teamsPath, originalTeamsData, "utf-8");
  });

  describe("when team id is valid and exists", () => {
    let createdTeamId: number;
    let response: Response;

    beforeAll(async () => {
      const created = await createTeam({ name: "Team To Delete F.C." });
      createdTeamId = created.body.id;
      response = await deleteTeam(createdTeamId);
    });

    it("should have a successful response status", () => {
      expect(response.status).toBe(200);
    });

    it("should validate the schema of the response", () => {
      const { error } = teamSchema.validate(response.body);
      expect(error).toBeUndefined();
    });

    it("should return the deleted team payload", () => {
      expect(response.body).toMatchObject({
        id: createdTeamId,
        name: "Team To Delete F.C."
      });
    });
  });

  describe("when team id is invalid", () => {
    let response: Response;

    beforeAll(async () => {
      response = await deleteTeam("abc");
    });

    it("should return bad request status", () => {
      expect(response.status).toBe(400);
    });

    it("should return the custom error message", () => {
      expect(response.body).toEqual({
        error: "Invalid team id. Please provide a positive integer."
      });
    });
  });

  describe("when team id does not exist", () => {
    let response: Response;

    beforeAll(async () => {
      response = await deleteTeam(99999);
    });

    it("should return not found status", () => {
      expect(response.status).toBe(404);
    });

    it("should return the custom error message", () => {
      expect(response.body).toEqual({
        error: "Team not found for the given id."
      });
    });
  });
});
