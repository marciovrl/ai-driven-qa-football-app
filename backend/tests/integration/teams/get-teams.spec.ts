import { Response } from 'superagent';

import { getTeams } from './utils';
import { teamsSchema } from './schema';


describe("GET /api/v1/teams", () => {
    let response: Response;

    beforeAll(async () => {
        response = await getTeams();
    });

    it("should have a successful response status", () => {
        expect(response.status).toBe(200);
    });

    it("should validate the schema of the response", () => {
        const { error } = teamsSchema.validate(response.body);
        expect(error).toBeUndefined();
    });
});
