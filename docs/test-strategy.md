# Test Strategy — AI Testing Assistant

## 1. User story under test
> As a user, I can register using email and password.

**Adapted to:** "As a user, I can register using username and password." Running the bonus
`src/explorer.js` script against the real register page showed it has no email field at all —
only `username`, `password`, `confirmPassword`. We chose to test the real system as it exists
rather than invent an email field that isn't there. Full detail in `docs/test-cases.md` and
`AI_WORKLOG.md`.

## 2. Application under test (AUT)
**Site:** https://practice.expandtesting.com/register
**Why this site:**
- It is a free, public, intentionally-testable QA practice site (no legal/ToS risk, unlike testing a real production login form).
- Its register form has exactly the fields our user story needs: username, email, password, confirm password — plus real server-side validation (length limits, duplicate-username check, format checks), which gives us genuine positive/negative/boundary/validation behavior to probe instead of a trivial static form.
- It is stable and designed to be re-tested repeatedly (unlike a live SaaS signup, which would create real spam accounts).

**Scope of this run:** only the **Register** flow (not login, not password reset), because that is what the given user story covers. Login is a natural "7-more-days" extension (see AI_WORKLOG.md).

## 3. Risk-based test thinking
Instead of generating "as many tests as possible," we asked: *where is this form most likely to break, and what would actually hurt a real user or the business?*

| Risk area | Why it matters | Test group |
|---|---|---|
| Required fields missing | Most common real-world bug (silent submit / 500 error) | Negative |
| Email format | Bad emails = undeliverable accounts, support tickets | Validation |
| Password/confirm mismatch | Account lockout risk, user frustration | Negative |
| Duplicate username | Data integrity — must not silently overwrite/duplicate | Negative |
| Field length boundaries | Off-by-one bugs are extremely common at min/max limits | Boundary |
| Special/unicode/injection-like input | Security & i18n — must not crash server or execute as code | Validation |
| Happy path | Sanity check the feature works at all before testing edge cases | Positive |

## 4. Test levels & tools
- **Test case generation:** AI-assisted (Claude), human-reviewed and corrected (see AI_WORKLOG.md — several AI guesses about the site's exact validation messages/limits were wrong and had to be verified against the real app).
- **Automation:** Playwright (`@playwright/test`), Chromium.
- **Failure analysis / bug reporting:** AI-assisted, using the Playwright error message, expected/actual DOM state, and screenshot path as grounding context (script in `src/generate-bug-report.js`), always reviewed by a human before filing.
- **Evidence:** Playwright HTML report + screenshots + trace files, stored under `test-results/`.

## 5. What is explicitly out of scope
- Load/performance testing
- Cross-browser matrix (only Chromium run for this challenge, to keep runtime short — Playwright config can add Firefox/WebKit trivially)
- Login and "forgot password" flows
- Accessibility audit (though the bonus "explorer" script does list form elements, which is a first step toward this)
