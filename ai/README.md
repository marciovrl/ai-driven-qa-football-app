# `/ai` — agents

Role prompts for teaching and interactive use (Cursor, Claude, etc.).

| File | Role |
|------|------|
| `agents/dev-frontend.md` | React / Vite UI |
| `agents/dev-backend.md` | Express API endpoints |
| `agents/test-planner.md` | Behavioral specs in `/specs` (Gherkin-style) |
| `agents/manual-tester.md` | Execute `/specs` manually + scenario results |
| `agents/test-engineer.md` | API (Jest) + E2E (Playwright) from specs |
| `agents/git-workflow.md` | Branch, commit, PR conventions |

## Adding an agent

New role → new `ai/agents/role-name.md`.

## Using the manual tester

1. Start the application under test.
2. In your AI assistant (Cursor, Claude, Copilot, etc.), load this agent and ask:

Example:

```text
Using ai/agents/manual-tester.md, run manual tests for specs/teams/create-team.feature
```

The agent reads that feature, exercises the live UI, and replies with a scenario results table (`PASS` / `FAIL` / `BLOCKED`).
