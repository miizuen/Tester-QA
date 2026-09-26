## Bug Report: TC13 — No maximum length enforced on the password field

**Test Case:** TC13 — Boundary: register with a 300-character password.
Source: `tests/register.spec.js:148`

**Expected Result:** A 300-character password is unreasonably long for a real system to accept
without some upper bound. We expected the registration to be rejected (form stays on
`/register`), matching the common pattern of most auth systems capping password length
(commonly somewhere between 64–128 characters) to avoid hashing-cost and input-abuse issues.

**Actual Result:** The registration **succeeded**. The app accepted the 300-character password,
submitted the form, and navigated to `/login` — the same behavior as a normal successful
registration (see TC01). No client-side or server-side length limit was enforced.

```
Error: expect(page).toHaveURL(expected) failed
Expected pattern: /\/register$/
Received string:  "https://practice.expandtesting.com/login"
Timeout: 5000ms
```

**Evidence:**
- Screenshot: `test-results/register-TC13---Boundary-3-8beb3--password-does-not-register-chromium/test-failed-1.png`
- Trace (full replay): `test-results/register-TC13---Boundary-3-8beb3--password-does-not-register-chromium/trace.zip`
  — viewable with `npx playwright show-trace <path above>`
- Reproducible via: `npx playwright test tests/register.spec.js -g "TC13"`

**Severity suggestion:** **Low–Medium.** No data was corrupted and no crash occurred, so this
is not a critical failure. However, accepting arbitrarily long passwords without any upper
bound is a real input-validation gap: it can be used to send oversized payloads to the
password-hashing routine, which for algorithms like bcrypt has known cost/behavior issues with
very long inputs, and more generally it's a missing basic validation rule that a production
auth system should have. Not urgent, but worth fixing.

**Possible cause (hypothesis, not confirmed):** The registration form likely validates
minimum password requirements (if any) but has no `maxlength` check either in the client-side
form (no `maxlength` attribute was found on `#password` via `src/explorer.js`) or on the
server side, since the request was accepted and processed as a normal successful registration
rather than rejected. A follow-up test hitting the API directly (bypassing the browser form)
would confirm whether this is purely a missing UI constraint or also missing on the backend.

**Note:** TC11 (200-character *username*) was also tested with the same hypothesis and
**passed** (i.e., the long username WAS rejected) — so this max-length gap appears to be
specific to the password field, not a blanket lack of length validation across the form.
