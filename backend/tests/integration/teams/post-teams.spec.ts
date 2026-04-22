import { Response } from "superagent";
import fs from "fs";
import path from "path";
import { createTeam } from "./utils";

describe("POST /api/v1/teams", () => {
  const teamsPath = path.resolve(__dirname, "../../../data/teams.json");
  let originalTeamsData = "";

  beforeAll(() => {
    originalTeamsData = fs.readFileSync(teamsPath, "utf-8");
  });

  afterAll(() => {
    fs.writeFileSync(teamsPath, originalTeamsData, "utf-8");
  });

  describe("when name is provided", () => {
    let response: Response;

    beforeAll(async () => {
      response = await createTeam({ name: "Cursor FC" });
    });

    it("should have a successful response status", () => {
      expect(response.status).toBe(201);
    });

    it("should return the created team payload with null defaults", () => {
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: "Cursor FC",
        address: null,
        nickname: null,
        titles: null
      });
    });
  });

  describe("when name is missing", () => {
    let response: Response;

    beforeAll(async () => {
      response = await createTeam({});
    });

    it("should return bad request status", () => {
      expect(response.status).toBe(400);
    });

    it("should return the custom error message", () => {
      expect(response.body).toEqual({
        error: "Name is not informed."
      });
    });
  });
});
