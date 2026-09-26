# AI QA Engineer — AI Testing Assistant

An assistant that turns a plain-English user story into: AI-generated test cases →
automated Playwright tests → AI-drafted bug reports on failure.

## 1. Problem
QA teams lose time on repetitive parts of the testing loop: turning a requirement into a
checklist of test cases, writing the automation for each one, and writing up a bug report
every time something fails. This project automates the *scaffolding* of that loop while
keeping a human in charge of verifying the AI's assumptions (which, as documented in
`AI_WORKLOG.md`, are sometimes wrong).

## 2. Solution / Workflow
```
User story (text)
      │
      ▼
[1] src/generate-test-cases.js  ──► calls Claude ──► docs/test-cases.generated.json
      │ (human reviews/corrects → docs/test-cases.md, the actual deliverable)
      ▼
[2] tests/register.spec.js  ──► Playwright automates 8 of the 18 documented cases
      │
      ▼
[3] npm test  ──► test-results/results.json + HTML report + screenshots/traces
      │
      ▼
[4] src/generate-bug-report.js ──► for each failure, calls Claude with the error +
      │                             evidence path ──► bug-reports/bug-N-*.md
      ▼
   Human reviews the AI-drafted bug report before filing it "for real"
```

**Bonus:** `src/explorer.js` crawls a page, extracts every interactive element (inputs,
buttons, links, their `required`/`maxlength`/`type` attributes), and asks Claude to
suggest test ideas grounded in what it actually found on the page — not generic filler.

## 3. Test website
**https://practice.expandtesting.com/register** (+ its `/login` page) — chosen because it's a
free public QA practice site with real server-side validation and a real duplicate-username
check, so testing it produces genuine pass/fail behavior instead of a trivial static form.

**Important, verified finding:** the user story says "register using email and password," but
this form has **no email field** — only `username`, `password`, `confirmPassword`. We
confirmed this with the bonus explorer script (see `AI_WORKLOG.md`) rather than guessing, and
adapted the tested scope to "register using username and password" to match the real
application, testing both **Register** and **Login** (since a registration-only test can't
verify the account actually works).

## 4. AI usage (see AI_WORKLOG.md for full detail)
- **Test case generation:** Claude was prompted (system prompt in
  `src/generate-test-cases.js`) to produce positive/negative/boundary/validation cases for
  the user story. Its first draft assumed specific validation messages and length limits
  that turned out to be guesses — corrected after checking the live site (documented in
  AI_WORKLOG.md).
- **Bug report drafting:** `src/generate-bug-report.js` sends the real Playwright error +
  evidence path to Claude and asks it to fill the required report sections, explicitly
  instructed to label its root-cause guess as a *hypothesis*, not a confirmed diagnosis.
- **Scaffolding/code:** this repository's structure, config, and boilerplate were written
  with AI assistance and then run/read/corrected by hand — not copy-pasted blind.

## 5. How to run
```bash
npm install
npx playwright install chromium
npm test                 # runs the 8 automated tests, produces evidence in test-results/
npm run report            # opens the HTML report with screenshots/traces
npm run generate:bugs     # AI-drafts a bug-reports/*.md for any failing test (needs .env)
npm run generate:cases    # (optional) regenerate test cases from a new user story via AI
npm run explore            # (bonus) crawl a page and get AI test suggestions
```
To enable the AI-powered scripts, copy `.env.example` to `.env` and add an
`ANTHROPIC_API_KEY` from https://console.anthropic.com/settings/keys. Without a key,
`npm test` still runs fully (automation doesn't need AI at runtime); the AI scripts fall
back to a template-based bug report instead of failing silently.

## 6. Deliverables map
| Requirement | Location |
|---|---|
| Test Strategy | `docs/test-strategy.md` |
| AI-generated test cases (18, ≥15 required) | `docs/test-cases.md` |
| Automated tests | `tests/register.spec.js` (8 cases, Playwright) |
| Test results / evidence | `test-results/` after running `npm test` |
| Bug report | `bug-reports/sample-bug-report.md` (worked example) + auto-generated ones after a real run |
| Bonus: AI explores site | `src/explorer.js` |

## 7. Limitations
- Only Chromium is run (Playwright config supports adding Firefox/WebKit with one line).
- Only 8 of 18 documented test cases are automated; the rest are flagged in
  `docs/test-cases.md` as manual/backlog, prioritized by risk, not automated for volume's sake.
- Bug-report drafting quality depends on the Playwright error message being informative;
  very generic timeouts still need a human to dig into the trace file.
- Registering repeatedly against a shared public practice site means some test data
  (e.g. duplicate-username checks) is intentionally hard-coded/reused across runs — a real
  project would use an isolated test environment or API-level test-data seeding instead.
