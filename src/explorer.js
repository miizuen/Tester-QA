// src/explorer.js  (BONUS: "AI explores the site and suggests what to test")
// Crawls one page with Playwright, extracts every interactive element
// (inputs, buttons, links, selects) with its attributes, then asks Claude
// to suggest test ideas we might have missed.
//
// Usage: node src/explorer.js https://practice.expandtesting.com/register

import 'dotenv/config';
import { chromium } from '@playwright/test';

const url = process.argv[2] || 'https://practice.expandtesting.com/register';

async function extractElements(page) {
  return page.evaluate(() => {
    const describe = (el) => ({
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute('type'),
      id: el.id || null,
      name: el.getAttribute('name'),
      placeholder: el.getAttribute('placeholder'),
      required: el.hasAttribute('required'),
      maxlength: el.getAttribute('maxlength'),
      text: (el.innerText || '').trim().slice(0, 60) || null,
    });
    const els = [
      ...document.querySelectorAll('input, button, select, textarea, a[href]'),
    ];
    return els.map(describe);
  });
}

async function suggestTests(elements, apiKey) {
  const prompt = `Here is a JSON list of interactive elements found on a web page:
${JSON.stringify(elements, null, 2)}

As a QA engineer, suggest 8-12 test ideas this page's form(s) likely need,
based ONLY on what these elements imply (required attributes, maxlength, input types, links).
For each idea give: a one-line title, and which element(s) it targets.
Be specific to what you actually see (e.g. "maxlength=39 on #username implies a boundary test at 39/40 chars"),
not generic filler like "test all fields".`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!response.ok) throw new Error(`Anthropic API error ${response.status}`);
  const data = await response.json();
  return data.content.map((b) => b.text || '').join('\n').trim();
}

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const elements = await extractElements(page);
  await browser.close();

  console.log(`Found ${elements.length} interactive elements on ${url}\n`);
  console.log(JSON.stringify(elements, null, 2));

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log('\n(No ANTHROPIC_API_KEY set — skipping AI suggestions. Set it in .env to get AI-generated test ideas from this element list.)');
    return;
  }
  const suggestions = await suggestTests(elements, apiKey);
  console.log('\n=== AI-suggested tests based on discovered elements ===\n');
  console.log(suggestions);
}

main();
