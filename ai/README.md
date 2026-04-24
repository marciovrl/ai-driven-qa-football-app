# `/ai` — rules + one runner

| What | Path |
|------|------|
| **Guides** (Jest+API, Playwright, Git/PR) | `ai/guides/*.md` |
| **Index for editors** (optional) | `ai/skills/suggested-tests-qa/SKILL.md` |
| **CI + local** | `ai/script/qa.mjs` |

## `ai/script/qa.mjs` (the only script)

```text
node ai/script/qa.mjs analyze   # diff heuristics + report (shas: AI_QA_BASE_SHA, AI_QA_HEAD_SHA)
node ai/script/qa.mjs generate  # if gap: OpenAI + write tests; needs OPENAI_API_KEY
node ai/script/qa.mjs child     # child PR text (env: PARENT_PR_NUM, PR_AREA, FILES, …)
```

GitHub Actions: `.github/workflows/ai-qa-generate-pr.yml` calls these three. Details stay in the `guides/` files; the runner loads the guides in code.

## Adding a guide

New topic → new `ai/guides/area-name.md` and, if the runner must use it, a small change in `ai/script/qa.mjs` (or keep it human-only, e.g. `http-endpoint-express`).
