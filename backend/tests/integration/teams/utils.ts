import request from "supertest";

const BASE_URL = "http://localhost:3000";
const TEAMS_PATH = "/api/v1/teams";

export const getTeams = async () => {
    return request(BASE_URL)
        .get(TEAMS_PATH)
        .set("accept", "application/json");
};

export const createTeam = async (payload: string | Record<string, unknown>) => {
    return request(BASE_URL)
        .post(TEAMS_PATH)
        .send(payload)
        .set("accept", "application/json");
};
