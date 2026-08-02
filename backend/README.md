# Backend

Node.js + Express + TypeScript. JSON file storage (no database). OpenAPI/Swagger.

Swagger: http://127.0.0.1:3000/api-docs

## Architecture

```text
data/                 # JSON store (teams.json + seed)
src/
  controllers/        # request/response only
  services/           # business logic
  repositories/       # read/write JSON
  routes/             # Express routes
  docs/               # Swagger / OpenAPI
```

Flow: **Controller → Service → Repository**

## Run

```bash
./dev.sh                 # from repo root (API + UI)
# or
cd backend && npm run dev
```

→ http://127.0.0.1:3000

```bash
npm run reset:data       # restore seed
```

Tests: see `tests/README.md`
