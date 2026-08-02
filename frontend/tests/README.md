# E2E tests (Playwright)

UI flows against the real app (create team, list teams, …).

Page objects live in `pages/`. Specs in `e2e/` map to behaviors in `/specs`.

## Run

From `frontend/`:

```bash
cd frontend
npm install                          # once
npx playwright install chromium      # once
npm run test:e2e                     # full suite
npm run test:e2e:smoke               # @smoke only
npm run test:e2e:ui                  # Playwright UI mode
```

Playwright starts API + UI for you (or reuses them if already up via `./dev.sh`).

## Tips

- Base URL: `http://localhost:5173` (override with `PLAYWRIGHT_BASE_URL`)
- Prefer `data-testid` in the app; page objects wrap the selectors
- Specs are the “what”; these tests are the “how”
