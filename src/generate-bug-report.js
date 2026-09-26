// src/generate-bug-report.js
// Reads test-results/results.json (Playwright JSON reporter output),
// finds failed tests, and asks Claude to draft a bug report for each.
// Falls back to a template-based report if no ANTHROPIC_API_KEY is set,
// so the pipeline never silently produces nothing.
//
// Usage: node src/generate-bug-report.js   (run AFTER `npm test`)

import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const RESULTS_PATH = 'test-results/results.json';
const OUT_DIR = 'bug-reports';

function collectFailures(suite, out = []) {
  for (const spec of suite.specs || []) {
    for (const t of spec.tests || []) {
      for (const r of t.results || []) {
        if (r.status === 'failed' || r.status === 'timedOut') {
          out.push({
            title: spec.title,
            file: spec.file,
            error: (r.error && r.error.message) || 'Unknown error',
            attachments: (r.attachments || []).map((a) => a.path).filter(Boolean),
          });
        }
      }
    }
  }
  for (const child of suite.suites || []) collectFailures(child, out);
  return out;
}

function templateReport(failure) {
  return `## Bug Report: ${failure.title}

**Test Case:** ${failure.title}
**File:** ${failure.file}

**Expected Result:** The assertion in this test case (see test-cases.md for the mapped TC ID) should have passed.

**Actual Result:**
\`\`\`
${failure.error}
\`\`\`

**Evidence:** ${failure.attachments.length ? failure.attachments.join(', ') : 'See playwright-report/ for screenshot/trace.'}

**Severity suggestion:** Medium (template fallback — no AI reasoning applied; re-run with ANTHROPIC_API_KEY set for a graded severity + root-cause hypothesis).

**Possible cause:** Not analyzed (fallback mode).
`;
}

async function aiReport(failure, apiKey) {
  const prompt = `A Playwright test named "${failure.title}" failed with this error:
${failure.error}

Write a structured bug report in Markdown with these exact sections:
- Test Case
- Expected Result
- Actual Result
- Evidence (say: see attached screenshot/trace at the given path)
- Severity suggestion (Critical/High/Medium/Low, with 1-line justification)
- Possible cause (a short technical hypothesis, clearly labelled as a hypothesis to verify, not a confirmed diagnosis)

Attachments available: ${failure.attachments.join(', ') || 'none'}
Be concise. Do not invent facts not implied by the error message.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic API error ${response.status}`);
  const data = await response.json();
  return data.content.map((b) => b.text || '').join('\n').trim();
}

async function main() {
  if (!fs.existsSync(RESULTS_PATH)) {
    console.error(`No ${RESULTS_PATH} found. Run "npm test" first.`);
    process.exit(1);
  }
  const results = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8'));
  const failures = (results.suites || []).flatMap((s) => collectFailures(s));

  if (failures.length === 0) {
    console.log('No failing tests found — nothing to report. (See bug-reports/sample-bug-report.md for the required example format.)');
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const apiKey = process.env.ANTHROPIC_API_KEY;

  for (const [i, failure] of failures.entries()) {
    const md = apiKey ? await aiReport(failure, apiKey).catch((e) => {
      console.error('AI report failed, using template fallback:', e.message);
      return templateReport(failure);
    }) : templateReport(failure);

    const outPath = path.join(OUT_DIR, `bug-${i + 1}-${failure.title.replace(/[^a-z0-9]+/gi, '-')}.md`);
    fs.writeFileSync(outPath, md);
    console.log('Wrote', outPath);
  }
}

main();
