import { Response } from "superagent";
import { resetTeamsData } from "../../helpers/resetTeamsData";
import { createTeam } from "./utils";

describe("POST /api/v1/teams", () => {
  beforeAll(() => {
    resetTeamsData();
  });

  afterAll(() => {
    resetTeamsData();
  });

  describe("when name is provided", () => {
    let response: Response;

    beforeAll(async () => {
      response = await createTeam({ name: "Manchester United F.C." });
    });

    it("should have a successful response status", () => {
      expect(response.status).toBe(201);
    });

    it("should return the created team payload with null defaults", () => {
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: "Manchester United F.C.",
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
