import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// IMPORTANT — verified against the live site (see AI_WORKLOG.md):
// The AI's first draft assumed this register form had an email field.
// Running src/explorer.js against the real page showed it does NOT:
// the form only has #username, #password, #confirmPassword + a "Register"
// submit button. The login page (#username, #password, #submit-login) has
// no email field either. We adapted the user story's scope accordingly:
// "register using username and password" instead of "email and password".
// ---------------------------------------------------------------------------

function uniqueSuffix() {
  return Date.now().toString().slice(-8);
}

const REGISTER_PATH = '/register';
const LOGIN_PATH = '/login';

async function fillRegisterForm(page, { username, password, confirm }) {
  await page.goto(REGISTER_PATH);
  if (username !== undefined) await page.locator('#username').fill(username);
  if (password !== undefined) await page.locator('#password').fill(password);
  if (confirm !== undefined) await page.locator('#confirmPassword').fill(confirm);
  await page.locator('button[type="submit"]').click();
}

async function fillLoginForm(page, { username, password }) {
  await page.goto(LOGIN_PATH);
  if (username !== undefined) await page.locator('#username').fill(username);
  if (password !== undefined) await page.locator('#password').fill(password);
  await page.locator('#submit-login').click();
}

// A single fixed strong password reused across cases where the exact value
// doesn't matter for the assertion being made.
const STRONG_PASSWORD = 'Str0ngPass!23';

// ---------- TC01 (Positive): valid unique registration ----------
test('TC01 - Positive: register with valid unique username/password succeeds', async ({ page }) => {
  const username = `qauser${uniqueSuffix()}`;
  await fillRegisterForm(page, { username, password: STRONG_PASSWORD, confirm: STRONG_PASSWORD });

  // Success = the app moves us away from /register (commonly to /login with a
  // flash message). We assert on navigation rather than exact message text,
  // since we haven't verified the precise success wording.
  await expect(page).not.toHaveURL(new RegExp(REGISTER_PATH + '$'), { timeout: 8000 });
});

// ---------- TC02 (Positive): register then log in with the same account ----------
test('TC02 - Positive: a freshly registered account can log in', async ({ page }) => {
  const username = `qalogin${uniqueSuffix()}`;
  await fillRegisterForm(page, { username, password: STRONG_PASSWORD, confirm: STRONG_PASSWORD });
  await page.waitForTimeout(1000); // let registration commit before logging in

  await fillLoginForm(page, { username, password: STRONG_PASSWORD });

  // Success = we leave /login (commonly to a "secure area" page).
  await expect(page).not.toHaveURL(new RegExp(LOGIN_PATH + '$'), { timeout: 8000 });
});

// ---------- TC03 (Negative): empty username ----------
test('TC03 - Negative: empty username does not register', async ({ page }) => {
  await fillRegisterForm(page, { username: '', password: STRONG_PASSWORD, confirm: STRONG_PASSWORD });
  // Blocked submission = we stay on /register.
  await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
});

// ---------- TC04 (Negative): empty password ----------
test('TC04 - Negative: empty password does not register', async ({ page }) => {
  await fillRegisterForm(page, { username: `qauser${uniqueSuffix()}`, password: '', confirm: '' });
  await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
});

// ---------- TC05 (Negative): empty confirm-password ----------
test('TC05 - Negative: empty confirm-password does not register', async ({ page }) => {
  await fillRegisterForm(page, {
    username: `qauser${uniqueSuffix()}`,
    password: STRONG_PASSWORD,
    confirm: '',
  });
  await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
});

// ---------- TC06 (Negative): password / confirm mismatch ----------
test('TC06 - Negative: password and confirm-password mismatch does not register', async ({ page }) => {
  await fillRegisterForm(page, {
    username: `qauser${uniqueSuffix()}`,
    password: STRONG_PASSWORD,
    confirm: 'SomethingElse1!',
  });
  await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
});

// ---------- TC07 (Negative): duplicate username ----------
test('TC07 - Negative: duplicate username does not register a second time', async ({ page }) => {
  const fixedUsername = 'qa_dup_check_user';
  await fillRegisterForm(page, { username: fixedUsername, password: STRONG_PASSWORD, confirm: STRONG_PASSWORD });
  await page.waitForTimeout(1000);

  await fillRegisterForm(page, { username: fixedUsername, password: STRONG_PASSWORD, confirm: STRONG_PASSWORD });
  await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
});

// ---------- TC10 (Boundary): very short username ----------
// HYPOTHESIS (unverified): the app enforces a minimum username length and
// rejects 2 characters. If this test FAILS, that is a genuine, real finding
// (not a mistake in the test) — it means no such minimum is enforced. That
// is exactly the kind of result that belongs in a real bug report.
test('TC10 - Boundary: 2-character username does not register', async ({ page }) => {
  await fillRegisterForm(page, {
    username: 'ab',
    password: STRONG_PASSWORD,
    confirm: STRONG_PASSWORD,
  });
  await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
});

// ---------- TC12 (Boundary): very short password ----------
// Same hypothesis-and-verify approach as TC10, applied to password length.
test('TC12 - Boundary: 2-character password does not register', async ({ page }) => {
  await fillRegisterForm(page, {
    username: `qauser${uniqueSuffix()}`,
    password: '12',
    confirm: '12',
  });
  await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
});

// ---------- TC14 (Validation): injection-like username must not crash the app ----------
test('TC14 - Validation: injection-like username does not cause a server error', async ({ page }) => {
  await fillRegisterForm(page, {
    username: `' OR '1'='1_${uniqueSuffix()}`,
    password: STRONG_PASSWORD,
    confirm: STRONG_PASSWORD,
  });
  const bodyText = await page.locator('body').innerText();
  expect(bodyText.toLowerCase()).not.toContain('internal server error');
  expect(bodyText.toLowerCase()).not.toContain('stack trace');
});
