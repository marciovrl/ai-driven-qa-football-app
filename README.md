# AI-driven QA — Football Teams

Small football teams CRUD app used to learn **AI-assisted QA**: specs, manual exploration, API tests, and E2E tests — without a huge codebase.

## Quick start

```bash
# install (once)
cd backend && npm install && cd ../frontend && npm install && cd ..

# run app (API :3000 + UI :5173)
./dev.sh
```

Open http://127.0.0.1:5173

## Where things live

| Path | What |
|------|------|
| `frontend/` | React UI (Vite) |
| `backend/` | Express API + JSON data |
| `specs/` | Behavioral specs (`.feature`) |
| `ai/agents/` | Role prompts (planner, engineer, etc.) |
| `frontend/tests/` | Playwright E2E |
| `backend/tests/` | Jest API (+ unit) tests |

## Learn path (suggested)

1. Read a spec → `specs/teams/`
2. Run the app → `./dev.sh`
3. Try an agent → `ai/README.md`
4. Run API tests → `backend/tests/`
5. Run E2E → `frontend/tests/`

Each folder has a short README with run commands.
