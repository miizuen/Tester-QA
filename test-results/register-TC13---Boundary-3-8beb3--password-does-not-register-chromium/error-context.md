# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: register.spec.js >> TC13 - Boundary: 300-character password does not register
- Location: tests\register.spec.js:148:1

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/register$/
Received string:  "https://practice.expandtesting.com/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="en">…</html>
       - unexpected value "https://practice.expandtesting.com/login"

```

```yaml
- paragraph:
  - link "PMP Practice":
    - /url: https://pmp.expandtesting.com/
  - text: "| Free PMP Certification Mock Exam Test +900 Questions & Quizzes"
  - link "QA developer training":
    - img
    - text: QA developer training
- banner:
  - navigation "Main navigation":
    - link "SUT":
      - /url: /
      - 'img "Best Website for Practice Automation Testing: Free UI and REST API Examples and Apps. Using Cypress, Playwright, Selenium, WebdriverIO and Postman."'
      - text: Practice
    - list:
      - listitem:
        - button "Demos"
      - listitem:
        - link "Tools":
          - /url: /#tools
      - listitem:
        - link "Tips":
          - /url: /tips
      - listitem:
        - link "Test Cases":
          - /url: /test-cases
      - listitem:
        - link "API Testing":
          - /url: /notes/api/api-docs/
      - listitem:
        - link "About":
          - /url: /about
    - list
    - link "Free ISTQB Mock Exams":
      - /url: https://istqb.expandtesting.com/
- main:
  - alert:
    - text: Successfully registered, you can log in now.
    - button "Close"
  - paragraph:
    - text: Do you enjoy this platform? ❤️
    - link "Buy us a coffee":
      - /url: https://www.buymeacoffee.com/expandtesting
  - insertion:
    - heading "These are topics related to the article that might interest you" [level=2]: Discover more
    - link "Upgrade Mesh Routers"
    - link "Cypress testing training"
    - link "Login page templates"
    - link "Optimize System Speed"
    - link "Secure login systems"
    - link "Automation testing platform"
    - link "Software testing courses"
    - link "Audit Cyber Security"
  - navigation "breadcrumb mb-2":
    - list:
      - listitem:
        - link "Home":
          - /url: /
      - listitem: / Login Page
  - heading "Test Login page for Automation Testing Practice" [level=1]
  - paragraph: This Test Login page is designed for automation testing practice. Test various positive and negative login scenarios in a testing environment.
  - paragraph:
    - text: You can use this login page for practicing with Selenium or other tools like Playwright, Cypress, etc.
    - link "Download Reference Apps":
      - img
      - text: Download Reference Apps
  - paragraph:
    - text: Register
    - link "here":
      - /url: /register
    - text: "or Log in to the secure area with these credentials:"
  - list:
    - listitem: "Username: practice"
    - listitem: "Password: SuperSecretPassword!"
  - paragraph
  - text: Username
  - textbox "Username"
  - text: Password
  - textbox "Password"
  - button "Login"
  - heading "How to test the login page?" [level=2]
  - paragraph:
    - text: If the credentials are correct, you should see a welcome message; otherwise, you will see an error message.
    - link "Compare Developer Tools":
      - img
      - text: Compare Developer Tools
  - paragraph: The login feature is essential for secure websites and is commonly used. Automating the testing of various login scenarios, including different edge cases, is crucial to ensure reliability and security.
  - heading "How Does Form-Based Authentication Work?" [level=3]
  - paragraph: "Take a look at this diagram and review the different steps:"
  - img "How Does Form-Based Authentication Work"
  - list:
    - listitem: "Step 1: A client requests access to a protected resource"
    - listitem: "Step 2: If the client is unauthenticated, the server redirects the client to a login page"
    - listitem: "Step 3: The client submits the login form to the server"
    - listitem: "Step 4: If the login succeeds, the server redirects the client to the resource. If the login fails, the client is redirected to an error page"
  - heading "Login Automation Test Cases" [level=2]
  - insertion:
    - heading "These are topics related to the article that might interest you" [level=2]: Discover more
    - link "Test case templates"
    - link "Test case management"
    - link "Automation practice website"
  - paragraph: Below are the test cases for the login page. These test cases cover both positive and negative scenarios to ensure comprehensive testing of the login functionality.
  - paragraph:
    - text: To perform these tests, please navigate to this
    - link "page":
      - /url: /login
    - link "Install Firewall Software":
      - img
      - text: Install Firewall Software
  - heading "Login Automation Test Cases" [level=2]
  - 'heading "Test Case 1: Successful Login" [level=3]'
  - list:
    - listitem: Launch the browser.
    - listitem:
      - text: Navigate to the
      - link "login":
        - /url: /login
      - text: page URL.
    - listitem: Verify that the login page is displayed successfully.
    - listitem:
      - text: Enter
      - strong: Username
      - text: ":"
      - code: practice
      - text: .
    - listitem:
      - text: Enter
      - strong: Password
      - text: ":"
      - code: SuperSecretPassword!
      - text: .
    - listitem:
      - text: Click the
      - strong: Login
      - text: button.
    - listitem:
      - text: Verify that the user is redirected to the
      - code: /secure
      - text: page.
    - listitem: Confirm the success message "You logged into a secure area!" is visible.
    - listitem:
      - text: Verify that a
      - strong: Logout
      - text: button is displayed.
  - separator
  - 'heading "Test Case 2: Invalid Username" [level=3]'
  - list:
    - listitem: Launch the browser.
    - listitem: Navigate to the login page URL.
    - listitem: Verify that the login page is displayed successfully.
    - listitem:
      - text: Enter an incorrect
      - strong: Username
      - text: (e.g.,
      - code: wrongUser
      - text: ).
    - listitem:
      - text: Enter
      - strong: Password
      - text: ":"
      - code: SuperSecretPassword!
      - text: .
    - listitem:
      - text: Click the
      - strong: Login
      - text: button.
    - listitem: Verify that an error message "Invalid username." is displayed.
    - listitem: Ensure the user remains on the login page.
  - separator
  - 'heading "Test Case 3: Invalid Password" [level=3]'
  - list:
    - listitem: Launch the browser.
    - listitem: Navigate to the login page URL.
    - listitem: Verify that the login page is displayed successfully.
    - listitem:
      - text: Enter
      - strong: Username
      - text: ":"
      - code: practice
      - text: .
    - listitem:
      - text: Enter an incorrect
      - strong: Password
      - text: (e.g.,
      - code: WrongPassword
      - text: ).
    - listitem:
      - text: Click the
      - strong: Login
      - text: button.
    - listitem: Verify that an error message "Invalid password." is displayed.
    - listitem: Ensure the user remains on the login page.
  - insertion:
    - heading "These are topics related to the article that might interest you" [level=2]: Discover more
    - link "Upgrade Industrial Robotics"
    - link "Software testing mock"
    - link "Testing tools guide"
    - link "Authentication security guide"
    - link "Scenario testing workshop"
    - link "Selenium testing guide"
    - link "Download Productivity Apps"
    - link "API testing services"
- insertion:
  - heading "These are topics related to the article that might interest you" [level=2]: Discover more
  - link "Download Tech Manuals"
  - link "Selenium automation framework"
  - link "Cypress testing guide"
- contentinfo:
  - heading "Practice Test Automation WebSite for Web UI and Rest API" [level=4]
  - paragraph:
    - text: "Version: e64cd80e | Copyright"
    - link "Expand Testing":
      - /url: https://expandtesting.com/
    - text: "2026"
- img
```

# Test source

```ts
  55  | 
  56  |   await fillLoginForm(page, { username, password: STRONG_PASSWORD });
  57  | 
  58  |   // Success = we leave /login (commonly to a "secure area" page).
  59  |   await expect(page).not.toHaveURL(new RegExp(LOGIN_PATH + '$'), { timeout: 8000 });
  60  | });
  61  | 
  62  | // ---------- TC03 (Negative): empty username ----------
  63  | test('TC03 - Negative: empty username does not register', async ({ page }) => {
  64  |   await fillRegisterForm(page, { username: '', password: STRONG_PASSWORD, confirm: STRONG_PASSWORD });
  65  |   // Blocked submission = we stay on /register.
  66  |   await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
  67  | });
  68  | 
  69  | // ---------- TC04 (Negative): empty password ----------
  70  | test('TC04 - Negative: empty password does not register', async ({ page }) => {
  71  |   await fillRegisterForm(page, { username: `qauser${uniqueSuffix()}`, password: '', confirm: '' });
  72  |   await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
  73  | });
  74  | 
  75  | // ---------- TC05 (Negative): empty confirm-password ----------
  76  | test('TC05 - Negative: empty confirm-password does not register', async ({ page }) => {
  77  |   await fillRegisterForm(page, {
  78  |     username: `qauser${uniqueSuffix()}`,
  79  |     password: STRONG_PASSWORD,
  80  |     confirm: '',
  81  |   });
  82  |   await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
  83  | });
  84  | 
  85  | // ---------- TC06 (Negative): password / confirm mismatch ----------
  86  | test('TC06 - Negative: password and confirm-password mismatch does not register', async ({ page }) => {
  87  |   await fillRegisterForm(page, {
  88  |     username: `qauser${uniqueSuffix()}`,
  89  |     password: STRONG_PASSWORD,
  90  |     confirm: 'SomethingElse1!',
  91  |   });
  92  |   await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
  93  | });
  94  | 
  95  | // ---------- TC07 (Negative): duplicate username ----------
  96  | test('TC07 - Negative: duplicate username does not register a second time', async ({ page }) => {
  97  |   const fixedUsername = 'qa_dup_check_user';
  98  |   await fillRegisterForm(page, { username: fixedUsername, password: STRONG_PASSWORD, confirm: STRONG_PASSWORD });
  99  |   await page.waitForTimeout(1000);
  100 | 
  101 |   await fillRegisterForm(page, { username: fixedUsername, password: STRONG_PASSWORD, confirm: STRONG_PASSWORD });
  102 |   await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
  103 | });
  104 | 
  105 | // ---------- TC10 (Boundary): very short username ----------
  106 | // HYPOTHESIS (unverified): the app enforces a minimum username length and
  107 | // rejects 2 characters. If this test FAILS, that is a genuine, real finding
  108 | // (not a mistake in the test) — it means no such minimum is enforced. That
  109 | // is exactly the kind of result that belongs in a real bug report.
  110 | test('TC10 - Boundary: 2-character username does not register', async ({ page }) => {
  111 |   await fillRegisterForm(page, {
  112 |     username: 'ab',
  113 |     password: STRONG_PASSWORD,
  114 |     confirm: STRONG_PASSWORD,
  115 |   });
  116 |   await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
  117 | });
  118 | 
  119 | // ---------- TC12 (Boundary): very short password ----------
  120 | // Same hypothesis-and-verify approach as TC10, applied to password length.
  121 | test('TC12 - Boundary: 2-character password does not register', async ({ page }) => {
  122 |   await fillRegisterForm(page, {
  123 |     username: `qauser${uniqueSuffix()}`,
  124 |     password: '12',
  125 |     confirm: '12',
  126 |   });
  127 |   await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
  128 | });
  129 | 
  130 | // ---------- TC11 (Boundary): very long username ----------
  131 | // HYPOTHESIS (unverified): a reasonable app should reject an unreasonably long
  132 | // username (200 chars) rather than silently accepting it. If this test FAILS
  133 | // (i.e. the app actually accepts it and navigates away from /register), that
  134 | // is a genuine finding worth a real bug report — many apps forget to enforce
  135 | // a max length even when they enforce a min length.
  136 | test('TC11 - Boundary: 200-character username does not register', async ({ page }) => {
  137 |   const longUsername = 'a'.repeat(200);
  138 |   await fillRegisterForm(page, {
  139 |     username: longUsername,
  140 |     password: STRONG_PASSWORD,
  141 |     confirm: STRONG_PASSWORD,
  142 |   });
  143 |   await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
  144 | });
  145 | 
  146 | // ---------- TC13 (Boundary): very long password ----------
  147 | // Same hypothesis-and-verify approach as TC11, applied to password length.
  148 | test('TC13 - Boundary: 300-character password does not register', async ({ page }) => {
  149 |   const longPassword = 'Aa1!'.repeat(75); // 300 chars
  150 |   await fillRegisterForm(page, {
  151 |     username: `qauser${uniqueSuffix()}`,
  152 |     password: longPassword,
  153 |     confirm: longPassword,
  154 |   });
> 155 |   await expect(page).toHaveURL(new RegExp(REGISTER_PATH + '$'));
      |                      ^ Error: expect(page).toHaveURL(expected) failed
  156 | });
  157 | 
  158 | // ---------- TC14 (Validation): injection-like username must not crash the app ----------
  159 | test('TC14 - Validation: injection-like username does not cause a server error', async ({ page }) => {
  160 |   await fillRegisterForm(page, {
  161 |     username: `' OR '1'='1_${uniqueSuffix()}`,
  162 |     password: STRONG_PASSWORD,
  163 |     confirm: STRONG_PASSWORD,
  164 |   });
  165 |   const bodyText = await page.locator('body').innerText();
  166 |   expect(bodyText.toLowerCase()).not.toContain('internal server error');
  167 |   expect(bodyText.toLowerCase()).not.toContain('stack trace');
  168 | });
  169 | 
```