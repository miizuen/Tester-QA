# AI-Generated Test Cases

**Original user story:** As a user, I can register using email and password.
**Adapted scope (see note below):** As a user, I can register using username and password.

> ⚠️ **Verification note (important):** The AI's first draft of these test cases assumed the
> register form had an **email** field, based on the wording of the user story. Running the
> bonus `src/explorer.js` script against the live page (https://practice.expandtesting.com/register)
> showed the real form only has `username`, `password`, `confirmPassword` — **no email field
> exists on this site**. Rather than force-fit the original story onto a field that doesn't
> exist, we adapted the tested behavior to "register using username and password," which is
> what the actual application under test supports, and documented the discrepancy here and in
> `AI_WORKLOG.md`. This is the single biggest correction in the whole project — a good example
> of why AI-generated test plans must be checked against the real system before automating them.

**Generated with:** Claude, prompt logged in `AI_WORKLOG.md`.

| ID | Type | Title | Steps (summary) | Expected Result | Automated? |
|----|------|-------|------------------|------------------|:--:|
| TC01 | Positive | Register with valid unique username/password | Fill username, password, confirm with fresh valid values → Submit | Registration succeeds; app navigates away from /register | ✅ |
| TC02 | Positive | Freshly registered account can log in | Register a new account, then log in on /login with the same credentials | Login succeeds; app navigates away from /login | ✅ |
| TC03 | Negative | Empty username | Leave username blank, fill password/confirm, submit | Submission blocked; user stays on /register | ✅ |
| TC04 | Negative | Empty password | Leave password & confirm blank, fill username, submit | Submission blocked; user stays on /register | ✅ |
| TC05 | Negative | Empty confirm-password | Leave confirm blank, fill username/password, submit | Submission blocked; user stays on /register | ✅ |
| TC06 | Negative | Password / confirm mismatch | password ≠ confirmPassword | Submission blocked; user stays on /register | ✅ |
| TC07 | Negative | Duplicate username | Register once, then register again with the same username | Second submission blocked; user stays on /register | ✅ |
| TC08 | Negative | Wrong password on login | Register an account, then log in with the correct username but a wrong password | Login rejected with an error; user stays on /login | ⬜ (manual — exact error copy not yet verified) |
| TC09 | Negative | Non-existent username on login | Log in with a username that was never registered | Login rejected with an error | ⬜ (manual) |
| TC10 | Boundary | Very short username (2 chars) | username = "ab" | **Hypothesis:** rejected as too short. **Unverified** — if this test passes it confirms the hypothesis; if it fails, that is a genuine finding (no minimum enforced) worth a real bug report. | ✅ |
| TC11 | Boundary | Very long username (200 chars) | username = 200 repeated chars | **Hypothesis:** rejected as too long. If it actually registers, that's a real max-length bug worth reporting. | ✅ |
| TC12 | Boundary | Very short password (2 chars) | password = "12" | **Hypothesis:** rejected as too short. Same unverified/real-finding logic as TC10. | ✅ |
| TC13 | Boundary | Very long password (300 chars) | password = 300 repeated chars | **Hypothesis was WRONG — real bug found.** The app actually accepts a 300-char password with no max-length check. See `bug-reports/bug-1-TC13-no-max-password-length.md`. | ✅ 🐞 **FAILED — real bug** |
| TC14 | Validation | SQL-injection-like username | username = `' OR '1'='1` | App must not crash (no HTTP 500 / stack trace), regardless of whether the value is accepted or rejected | ✅ |
| TC15 | Validation | Leading/trailing whitespace in username | username = `"  qauser123  "` | Behavior should be consistent (either trimmed-and-accepted, or rejected) — not silently broken | ⬜ (manual) |
| TC16 | Validation | Unicode/emoji username | username = `"用户🙂test"` | App should not crash; accept-or-reject decision should be deliberate, not accidental | ⬜ (manual) |

## Actual run result (see full evidence in test-results/ and playwright-report/)
**11 passed, 1 failed** out of 12 automated tests. The 1 failure (TC13) is a genuine bug, not a
broken test — see `bug-reports/bug-1-TC13-no-max-password-length.md` for the full report.

**Total: 16 test cases** (2 positive / 7 negative / 4 boundary / 3 validation).
**Automated in this challenge: 12** (`tests/register.spec.js`), covering every category at
least once with real, executable assertions against the live site. The ⬜ rows are the
documented manual/backlog items — see `AI_WORKLOG.md` for what 7 more days would add
(mainly: verifying exact validation copy so TC08/TC09/TC15/TC16 can be automated with
precise assertions instead of only behavioral ones).

## Why some automated assertions check "stayed on page" instead of an error message
For TC03–TC07, TC10 and TC12 we assert the app did **not** move past `/register`, rather than
asserting a specific error message string. We deliberately did not hard-code an exact
validation message we hadn't verified — after the email-field mistake above, guessing exact
UI copy a second time seemed like the wrong lesson to take from it. The behavioral assertion
(blocked vs. not blocked) is what actually matters for the test's purpose and is robust to
wording changes; verifying and asserting the *exact* message text is listed as manual/backlog
work in `AI_WORKLOG.md`.
