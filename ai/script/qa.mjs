#!/usr/bin/env node
/**
 * One entry for AI QA: guides in ai/guides/; this file lives in ai/script/.
 * Usage: node ai/script/qa.mjs <analyze|generate|child>
 *
 * analyze  — pr diff + heuristic report; GITHUB_OUTPUT: should_generate, …
 * generate — if gap: OpenAI + write tests; needs OPENAI_API_KEY
 * child    — child PR text per guides/git-pr-and-branches.md
 *
 * Shas: AI_QA_BASE_SHA, AI_QA_HEAD_SHA, or --base / --head
 */
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { writeFile, mkdir, appendFile } from "node:fs/promises";
import { resolve, dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dir, "../..");
const GUIDE_API = join(ROOT, "ai/guides/api-jest-supertest.md");
const GUIDE_PW = join(ROOT, "ai/guides/e2e-playwright.md");
const GUIDE_GIT = join(ROOT, "ai/guides/git-pr-and-branches.md");
const GUIDE_GIT_NAME = "ai/guides/git-pr-and-branches.md";

// --- diff heuristics --------------------------------------------------------

function getDiffState(repoRoot, base, head, maxList = 30) {
  const run = (c) => execSync(c, { cwd: repoRoot, encoding: "utf8" }).trim();
  const list = run(
    "git -c core.quotepath=off diff --name-only " + base + ".." + head
  )
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const isB = (f) => f.startsWith("backend/src/") && f.endsWith(".ts");
  const isF = (f) => f.startsWith("frontend/src/") && /\.(t|j)sx?$/.test(f);
  const isBT = (f) => f.startsWith("backend/tests/") && f.endsWith(".ts");
  const isFT = (f) => f.startsWith("frontend/tests/") && /\.(t|j)sx?$/.test(f);
  const backendSrc = [],
    frontendSrc = [],
    bT = [],
    fT = [],
    oth = [];
  let prodB = false,
    testB = false,
    prodF = false,
    testF = false;
  for (const f of list) {
    if (isB(f)) {
      prodB = true;
      backendSrc.push(f);
    } else if (isF(f)) {
      prodF = true;
      frontendSrc.push(f);
    } else if (isBT(f)) {
      testB = true;
      bT.push(f);
    } else if (isFT(f)) {
      testF = true;
      fT.push(f);
    } else oth.push(f);
  }
  const line = (arr) =>
    arr.length === 0
      ? "_(none)_"
      : arr
          .slice(0, maxList)
          .map((p) => "- `" + p + "`")
          .join("\n") +
        (arr.length > maxList
          ? "\n- _…+" + (arr.length - maxList) + " more_"
          : "");
  const bGap = prodB && !testB;
  const fGap = prodF && !testF;
  const gen = bGap || fGap;
  const md = [
    "### AI QA — change & coverage (heuristic)",
    "",
    "| Check | Result |",
    "|--------|--------|",
    "| backend/src | **" + (prodB ? "yes" : "no") + "** |",
    "| backend/tests in diff | **" + (testB ? "yes" : "no") + "** |",
    "| API test gap | **" + (bGap ? "yes" : "no") + "** |",
    "| frontend/src | **" + (prodF ? "yes" : "no") + "** |",
    "| frontend/tests in diff | **" + (testF ? "yes" : "no") + "** |",
    "| E2E test gap | **" + (fGap ? "yes" : "no") + "** |",
    "| run generate | **" + (gen ? "yes" : "no") + "** |",
    "",
    "#### backend/src",
    line(backendSrc),
    "#### frontend/src",
    line(frontendSrc),
    "#### backend/tests",
    line(bT),
    "#### frontend/tests",
    line(fT),
  ];
  if (oth.length) md.push("#### other", line(oth));
  return {
    allFiles: list,
    backendSrc,
    frontendSrc,
    backendGap: bGap,
    frontendGap: fGap,
    shouldGenerate: gen,
    reportMarkdown: md.join("\n\n"),
  };
}

function parseShas() {
  let base = process.env.AI_QA_BASE_SHA;
  let head = process.env.AI_QA_HEAD_SHA;
  for (let i = 3; i < process.argv.length; i++) {
    if (process.argv[i] === "--base" && process.argv[i + 1]) base = process.argv[++i];
    else if (process.argv[i] === "--head" && process.argv[i + 1])
      head = process.argv[++i];
  }
  if (!base || !head) {
    console.error("Set AI_QA_BASE_SHA and AI_QA_HEAD_SHA, or --base / --head");
    process.exit(1);
  }
  return { base, head };
}

// --- analyze ---------------------------------------------------------------

async function runAnalyze() {
  const { base, head } = parseShas();
  const s = getDiffState(ROOT, base, head);
  const p =
    process.env.AI_QA_REPORT_FILE || join(process.cwd(), "ai-qa-pr-analysis.md");
  const body = s.reportMarkdown + "\n\n";
  await writeFile(p, body, "utf8");
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, body, "utf8");
  }
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      "should_generate=" +
        s.shouldGenerate +
        "\nbackend_gap=" +
        s.backendGap +
        "\nfrontend_gap=" +
        s.frontendGap +
        "\n",
      "utf8"
    );
  }
  console.log("analyze", { p, shouldGenerate: s.shouldGenerate });
}

// --- child PR text ---------------------------------------------------------

function childTitle(a, n) {
  if (a === "BE")
    return "test[BE]: add AI-suggested API (integration) tests (parent #" + n + ")";
  if (a === "FE")
    return "test[FE]: add AI-suggested E2E (Playwright) tests (parent #" + n + ")";
  if (a === "BE+FE")
    return "test[BE+FE]: add AI-suggested API and E2E tests (parent #" + n + ")";
  return "test: add AI-suggested tests (parent #" + n + ")";
}
function childWhat(a) {
  if (a === "BE+FE" || !a) return "API and/or E2E";
  if (a === "BE") return "API (Jest, Supertest)";
  return "E2E (Playwright)";
}

async function runChild() {
  const num = process.env.PARENT_PR_NUM;
  const area = process.env.PR_AREA || "";
  const baseRef = process.env.BASE_REF || "unknown";
  const f = (process.env.FILES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const bodyFile = process.env.CHILD_PR_BODY_FILE;
  if (!num || !bodyFile) {
    console.error("Need PARENT_PR_NUM and CHILD_PR_BODY_FILE");
    process.exit(1);
  }
  const rid = process.env.GITHUB_RUN_ID || "local";
  const att = process.env.GITHUB_RUN_ATTEMPT || "1";
  const br =
    "test/ai-qa-suggested-for-pr-" + num + "-" + rid + "-" + att;
  const msg =
    "test: add AI-suggested " +
    childWhat(area) +
    " tests for parent PR #" +
    num +
    " [ai-qa]";
  const tit = childTitle(area, num);
  const tech =
    f.length > 0
      ? f.map((p) => "- `" + p + "`").join("\n")
      : "- _(ai-qa output)_";
  const md = [
    "## PR Reason:",
    "Parent change set is missing tests in the same diff. Follow " + GUIDE_GIT_NAME + " for style.",
    "",
    "## Technical Changes:",
    tech,
    "",
    "## How to Test:",
    "1. cd backend, npm ci, npm run test:api",
    "2. docker compose -f docker-compose.ci.yml up -d --build, then run --rm e2e",
    "",
    "## Notes:",
    "- **QA must approve.**",
    "- branch **" + br + "** — base: **" + baseRef + "**",
  ].join("\n");
  const esc = (v) => v.replace(/\r?\n/g, " ");
  await writeFile(bodyFile, md + "\n", "utf8");
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      "child_branch=" +
        esc(br) +
        "\ncommit_msg=" +
        esc(msg) +
        "\npr_title=" +
        esc(tit) +
        "\n",
      "utf8"
    );
  }
  console.log("child", { br, tit, bodyFile });
}

// --- generate (OpenAI) -----------------------------------------------------

function runI(cmd) {
  execSync(cmd, { cwd: ROOT, stdio: "inherit" });
}
function runC(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim();
}

function readCapped(f, max) {
  if (!existsSync(f)) return { text: "", m: true };
  const t = readFileSync(f, "utf8");
  if (t.length <= max) return { text: t, m: false };
  return { text: t.slice(0, max) + "\n[truncated]\n", m: false };
}

function allowPath(p) {
  return !p.includes("..") && !p.startsWith("/")
    && (p.startsWith("backend/tests/") || p.startsWith("frontend/tests/"));
}

function parseFiles(text) {
  const m = new Map();
  const re = /<file\s+path="([^"]+)">\s*([\s\S]*?)<\/file>/gi;
  let x;
  while ((x = re.exec(text)) !== null) {
    const rel = x[1].trim();
    if (!allowPath(rel)) continue;
    let b = x[2].trim();
    if (b.startsWith("```")) {
      b = b.replace(/^```\w*\s*\n?/, "").replace(/\n?```\s*$/, "");
    }
    m.set(rel, b);
  }
  return m;
}

function readSrcs(paths, max) {
  const o = [];
  for (const line of paths) {
    const abs = resolve(ROOT, line);
    if (!existsSync(abs)) continue;
    let t = readFileSync(abs, "utf8");
    if (t.length > max) t = t.slice(0, max) + "\n/*…*/\n";
    o.push({ path: line, content: t });
  }
  return o;
}

function gDiffT(base, head) {
  try {
    return runC(
      "git -c core.quotepath=off diff -U3 " +
        base +
        ".." +
        head +
        " -- backend/src frontend/src"
    );
  } catch {
    return "";
  }
}

function sysP({ bGap, fGap, a, w, g }) {
  const p = [
    "You write only test files under backend/tests/ or frontend/tests/ as <file path=…>…</file>. English only.",
  ];
  if (bGap && fGap) {
    p.push(
      "MANDATORY: include at least one file under backend/tests/ AND one under frontend/tests/."
    );
  } else if (bGap) p.push("MANDATORY: at least one backend/tests/ file for the API.");
  else if (fGap) p.push("MANDATORY: at least one frontend/tests/ e2e file.");
  if (bGap) p.push("--- API / Jest rules ---\n" + a);
  if (fGap) p.push("--- Playwright rules ---\n" + w);
  p.push("--- Git/PR style (context) ---\n" + g);
  return p.join("\n\n");
}

async function oai(s, u, m, k) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + k,
    },
    body: JSON.stringify({
      model: m,
      messages: [
        { role: "system", content: s },
        { role: "user", content: u },
      ],
      temperature: 0.2,
      max_tokens: 12_000,
    }),
  });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()).choices[0].message.content;
}

async function runGenerate() {
  const { base, head } = parseShas();
  const st = getDiffState(ROOT, base, head);
  const { backendGap, frontendGap } = st;
  if (!st.shouldGenerate) {
    console.log("no gap, skip");
    if (process.env.GITHUB_OUTPUT)
      await appendFile(process.env.GITHUB_OUTPUT, "skip=true\n", "utf8");
    return;
  }
  const k = process.env.OPENAI_API_KEY;
  if (!k) {
    console.error("Missing OPENAI_API_KEY");
    process.exit(1);
  }
  const m = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const cap = +process.env.AI_QA_MAX_AGENT_CHARS || 8000;
  const sm = +process.env.AI_QA_MAX_SRC_CHARS || 12_000;
  const a = readCapped(GUIDE_API, cap);
  const w = readCapped(GUIDE_PW, cap);
  const g = readCapped(GUIDE_GIT, cap);
  const system = sysP({
    bGap: backendGap,
    fGap: frontendGap,
    a: a.text,
    w: w.text,
    g: g.text,
  });
  const sn = readSrcs([...st.backendSrc, ...st.frontendSrc], sm);
  const d = gDiffT(base, head).slice(0, 2e4);
  const user =
    "Gaps: API " +
    backendGap +
    ", E2E " +
    frontendGap +
    ".\n\nDiff:\n```\n" +
    d +
    "\n```\n\n" +
    sn.map((s) => "---" + s.path + "---\n" + s.content + "\n").join("\n");
  console.log("openai", m);
  const out = await oai(system, user, m, k);
  const by = parseFiles(out);
  if (by.size === 0) {
    console.error(out.slice(0, 600));
    process.exit(1);
  }
  for (const [rel, c] of by) {
    const abs = resolve(ROOT, rel);
    await mkdir(dirname(abs), { recursive: true });
    await writeFile(abs, c.endsWith("\n") ? c : c + "\n", "utf8");
    console.log("wrote", rel);
  }
  const nB = [...by.keys()].some((p) => p.startsWith("backend/tests"));
  const nF = [...by.keys()].some((p) => p.startsWith("frontend/tests"));
  if (backendGap && !nB) {
    console.error("missing backend/tests file");
    process.exit(1);
  }
  if (frontendGap && !nF) {
    console.error("missing frontend/tests file");
    process.exit(1);
  }
  if (nB) {
    runI("cd backend && npm ci && npm run test:api");
  }
  if (nF) {
    runI("docker compose -f docker-compose.ci.yml up -d --build backend frontend");
    for (let i = 0; i < 30; i++) {
      try {
        runC("curl -fsS http://127.0.0.1:3000/");
        runC("curl -fsS http://127.0.0.1:5173/");
        break;
      } catch {
        if (i === 29) throw new Error("timeout");
        await (await import("node:timers/promises")).setTimeout(2000);
      }
    }
    runI("docker compose -f docker-compose.ci.yml run --rm e2e");
    runI("docker compose -f docker-compose.ci.yml down --remove-orphans");
  }
  const pl = [...by.keys()].join(",");
  let ar = nB && nF ? "BE+FE" : nB ? "BE" : nF ? "FE" : "";
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(
      process.env.GITHUB_OUTPUT,
      "files=" + pl + "\npr_area=" + ar + "\n",
      "utf8"
    );
  }
  console.log("ok", pl, ar);
}

// --- main ------------------------------------------------------------------

const c = process.argv[2];
const main = async () => {
  if (c === "analyze") await runAnalyze();
  else if (c === "generate") await runGenerate();
  else if (c === "child") await runChild();
  else {
    console.log(
      "Usage: node " +
        basename(process.argv[1]) +
        " <analyze|generate|child>\n" +
        "  Shas: AI_QA_BASE_SHA, AI_QA_HEAD_SHA, or --base / --head\n" +
        "  child: PARENT_PR_NUM, PR_AREA, FILES, BASE_REF, CHILD_PR_BODY_FILE"
    );
    process.exit(c ? 1 : 0);
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
