# `/specs` — behavioral test specs

Living specs for what the product should do. Written in Gherkin-style `.feature`
files so humans, the **test-planner** agent, and the **test-engineer** agent share
the same source of truth.

These files describe **behavior**, not how to click the UI or call the API.

## Layout

```text
specs/
  README.md
  <domain>/
    <feature>.feature
```

Examples:

- `specs/teams/create-team.feature`
- `specs/teams/get-teams.feature`
- `specs/teams/delete-team.feature`

Rules:

- One feature/flow per file
- Extension is always `.feature`
- Group by domain (`teams`, later `players`, etc.)

## Who writes / who consumes

| Role | Responsibility |
|------|----------------|
| **test-planner** (`ai/agents/test-planner.md`) | Creates and refines `.feature` files |
| **test-engineer** (`ai/agents/test-engineer.md`) | Implements API/E2E tests from the scenarios |
| Humans | Review language, scope, and coverage |

Planner plans. Engineer automates. Specs stay free of selectors and framework code.

## File shape

Use Gherkin keywords (`Feature`, `Background`, `Scenario`, `Scenario Outline`, `Examples`).
Do not use Markdown headings (`#`, `##`) inside `.feature` files.

```gherkin
Feature: Create team
  Short business context.

  Background:
    Given the user is viewing the teams catalog

  Scenario: Create a team with a valid name
    When the user adds a team with a valid unique name
    Then the team is available in the teams catalog
    And the user is informed that the team was created

  Scenario Outline: Invalid team name is rejected
    When the user tries to add a team with <invalid_name>
    Then the team is not created
    And the user is told <message>

    Examples:
      | invalid_name   | message                |
      | empty name     | name is required       |
      | duplicate name | name is already in use |
```

## Conventions (short version)

- **Valid Gherkin** — `Feature` / `Scenario` keywords, not Markdown `##`
- **What, not how** — outcomes and business rules, not buttons/modals/endpoints
- **Independent scenarios** — any order, no dependency on a previous scenario
- **Small files** — prefer 3–7 steps per scenario; keep the file focused
- **Given / When / Then** — context → action → observable result
- **Background** — only setup shared by every scenario in the file
- **Scenario Outline** — same flow, different data (especially validation/errors)
- **Generic When** — when the exact error cause does not matter (`adding a team fails with an error`)
- **Short Examples** — few columns, short cells (`empty name`, `duplicate name`)
Full rules live in `ai/agents/test-planner.md`.

## Reference

Start from [`teams/create-team.feature`](./teams/create-team.feature) when adding a new spec.
