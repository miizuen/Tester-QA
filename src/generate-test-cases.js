// src/generate-test-cases.js
// Usage:  node src/generate-test-cases.js "As a user, I can register using email and password."
// Requires ANTHROPIC_API_KEY in .env (see .env.example).
// Writes docs/test-cases.generated.json

import 'dotenv/config';
import fs from 'fs';

const userStory = process.argv.slice(2).join(' ') ||
  'As a user, I can register using email and password.';

const SYSTEM_PROMPT = `You are a senior QA engineer. Given a single user story, produce a JSON array
of test cases. Each test case must have: id, type (one of "positive","negative","boundary","validation"),
title, steps (array of short strings), expectedResult.
Cover at least: 2 positive, 5 negative, 4 boundary, 3 validation cases (14+ total).
Think about REAL failure modes (required fields, format checks, length limits at the exact boundary,
duplicate data, mismatched confirmation fields, injection-like or unicode input) rather than trivial
rephrasings of the same case.
Return ONLY the JSON array, no prose, no markdown fences.`;

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('No ANTHROPIC_API_KEY found in .env — see .env.example.');
    console.error('Falling back to the pre-generated, human-reviewed set in docs/test-cases.md.');
    process.exit(1);
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `User story: ${userStory}` }],
    }),
  });

  if (!response.ok) {
    console.error('Anthropic API error:', response.status, await response.text());
    process.exit(1);
  }

  const data = await response.json();
  const text = data.content.map((b) => b.text || '').join('\n').trim();

  let parsed;
  try {
    parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (e) {
    console.error('Could not parse AI output as JSON. Raw output:\n', text);
    process.exit(1);
  }

  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/test-cases.generated.json', JSON.stringify(parsed, null, 2));
  console.log(`Wrote ${parsed.length} AI-generated test cases to docs/test-cases.generated.json`);
  console.log('IMPORTANT: review these against the real app before automating — AI can guess wrong limits/messages.');
}

main();
