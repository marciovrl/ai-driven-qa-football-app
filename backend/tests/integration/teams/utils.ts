import request from "supertest";
import app from "../../../src/app";

const TEAMS_PATH = "/api/v1/teams";

export const getTeams = async () => {
    return request(app)
        .get(TEAMS_PATH)
        .set("accept", "application/json");
};

export const createTeam = async (payload: string | Record<string, unknown>) => {
    return request(app)
        .post(TEAMS_PATH)
        .send(payload)
        .set("accept", "application/json");
};
