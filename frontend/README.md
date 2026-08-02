# Frontend

React + TypeScript + Vite. Simple UI for the teams catalog.

API: `http://localhost:3000`

## Architecture

```text
src/
  pages/        # screens (state + call services)
  components/   # reusable UI (no business logic)
  services/     # fetch / API calls
  types/        # TypeScript types (match backend)
```

- Functional components + hooks only (no Redux/Zustand)
- No UI libraries
- `data-testid` on key elements (Playwright-friendly)

## Run

```bash
./dev.sh                 # from repo root (API + UI)
# or
cd frontend && npm run dev
```

→ http://127.0.0.1:5173

Tests: see `tests/README.md`
