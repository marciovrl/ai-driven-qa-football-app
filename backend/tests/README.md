# API tests (Jest + Supertest)

HTTP-level tests for `/api/v1/teams` (get, create, delete).

No browser — hit the Express app directly.

## Run

From `backend/`:

```bash
cd backend
npm install        # once
npm run test:api
```

## Tips

- API tests: `integration/teams/`
- Reset seed data if needed: `npm run reset:data`
- Unit tests (no HTTP): `npm run test:unit` → `unit/`
