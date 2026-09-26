## Bug Report: TC13 — Username above maximum length is not rejected

> **Note:** This is a worked *example* showing the required report format and the reasoning
> process. Replace with your own run's actual failure once you execute `npm test` +
> `npm run generate:bugs` — real severity/cause must come from a real failing assertion,
> not be copied from this file.

**Test Case:** TC13 — Boundary: username 1 character above the documented maximum (40 chars) should be rejected.

**Expected Result:** Submitting the register form with a 40-character username should show a
client- or server-side length-validation error and NOT create the account.

**Actual Result:** The form accepted the 40-character username with no error and the account
was created (confirmed by the success redirect to `/login`).

**Evidence:**
- Screenshot: `playwright-report/` (attached automatically by Playwright's `screenshot: only-on-failure` setting)
- Trace file: viewable via `npx playwright show-trace test-results/.../trace.zip`
- Playwright error output logged in `test-results/results.json`

**Severity suggestion:** **Low–Medium.** No security impact and no data corruption, but it means
the documented/assumed length constraint is not actually enforced — could indicate the front-end
validation and back-end validation are out of sync, which is a common source of bugs when the
API is called directly (e.g. from a mobile client) bypassing the web form's own JS checks.

**Possible cause (hypothesis, not confirmed):** The front-end may validate `maxlength` via an
HTML attribute that a script-driven test can bypass, while the actual server-side check either
doesn't exist or uses a different, larger limit than the UI implies. Needs a follow-up test that
sends the request directly to the API (bypassing the browser form) to isolate front-end vs.
back-end validation.
