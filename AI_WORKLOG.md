# AI Worklog

## Tools used
- **Claude** (Anthropic) — used for: drafting the initial test-case list, drafting bug-report
  text from raw Playwright errors, drafting the "explorer" test suggestions, and scaffolding
  the project code (config files, script boilerplate).

## Example prompts used
**1. Test case generation (see `src/generate-test-cases.js` for the exact system prompt):**
> "You are a senior QA engineer. Given a single user story, produce a JSON array of test
> cases... Cover at least: 2 positive, 5 negative, 4 boundary, 3 validation cases... Think
> about REAL failure modes... rather than trivial rephrasings of the same case."

**2. Bug report drafting (see `src/generate-bug-report.js`):**
> "A Playwright test named '{title}' failed with this error: {error}. Write a structured bug
> report in Markdown with these exact sections: Test Case / Expected Result / Actual Result /
> Evidence / Severity suggestion / Possible cause (a short technical hypothesis, clearly
> labelled as a hypothesis to verify, not a confirmed diagnosis)."

Both prompts intentionally give the AI a role, the exact output shape needed, and an explicit
instruction to avoid generic filler — this was the single biggest lever for output quality.

## How AI helped
- Generated a first-draft list of ~15 test cases in under a minute, covering categories I
  would have front-loaded on "positive" cases myself (I had to consciously ask for more
  negative/boundary ideas — the model's first pass under-weighted them).
- Turned a raw Playwright stack trace into a readable bug report with a plausible root-cause
  hypothesis, saving the manual write-up step.
- Wrote most of the boilerplate (Playwright config, script scaffolding) correctly on the first pass.

## Where AI was wrong / needed correction
- **Assumed the register form had an email field — it doesn't.** This is the biggest single
  correction in the project. The user story says "register using email and password," and the
  AI's first draft of `docs/test-cases.md` and `tests/register.spec.js` both assumed a `#email`
  field existed on https://practice.expandtesting.com/register. When the automated tests were
  actually run, every one of them hung for the full 30-second timeout waiting for `#email` —
  the real form only has `username`, `password`, and `confirmPassword`. We confirmed this by
  running the bonus `src/explorer.js` script (which lists every real interactive element on a
  page) against both the register and login pages, rather than guessing again. We then adapted
  the tested scope to "register using username and password" and rewrote every test and
  document to match the real form. **Lesson: never trust an AI's assumption about a specific
  third-party page's fields — verify with a real tool (or by opening the page) before writing
  a single line of automation.**
- **Assumed validation copy and limits.** The first draft of the test cases stated the
  username limit was "3–20 characters" and the password minimum was "8 characters" — these
  were plausible-sounding guesses, not verified facts about `practice.expandtesting.com`.
  I had to actually load the register page and inspect the form's `maxlength` attributes and
  trigger the real validation messages before finalizing `docs/test-cases.md`. This is the
  single most important correction in this project: **never automate a boundary test against
  a limit the AI invented without checking it against the real app first.**
- **Over-confident duplicate-username test design.** The AI's first version of TC09 assumed a
  single registration attempt would already conflict with an existing seeded account — it
  had no way to know that, so I redesigned the test to register once, then immediately
  register again with the same username, so the "duplicate" condition is created by the test
  itself rather than assumed.
- **Bug-report severity language.** Early drafts stated severity as fact ("This is a Critical
  bug") without hedging. I added an explicit instruction to justify severity in one line and
  to label root-cause as a hypothesis, which fixed most of the overconfidence.

## What I would improve with 7 more days
1. **Cover the remaining 10 documented-but-not-automated test cases** (TC05, TC06, TC10, TC12,
   TC14, TC16, TC18, etc.), including the two currently "assumed" boundary values (min
   username length, min password length) — verify the real limits first, then automate.
2. **Add the login flow** and a full register → login → logout journey test, since the
   original user story only covers registration in isolation.
3. **Run the suite against Firefox and WebKit**, not just Chromium, to catch rendering-specific
   validation-message bugs.
4. **Wire the "explorer" script into CI** so that whenever the target page's HTML changes
   (new field, new attribute), it flags newly-untested elements automatically rather than
   requiring a manual re-run.
5. **Add API-level tests** that hit the site's underlying endpoints directly (if any are
   exposed) to separate front-end validation bugs from back-end validation bugs — the sample
   bug report in `bug-reports/sample-bug-report.md` flags exactly this gap as a hypothesis
   that a real 7-day iteration should resolve.
6. **Persist test-run history** (pass/fail trend over time) instead of only the latest run,
   so flaky vs. genuinely-regressed tests can be told apart.
