import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateExtractedResumeText } from "../src/controllers/interview.controller.js";

describe("Resume Parser & Text Validation Unit Tests", () => {
  it("throws 400 when text is empty or not a string", () => {
    assert.throws(
      () => validateExtractedResumeText(""),
      /Uploaded PDF appears to be empty/i
    );
    assert.throws(
      () => validateExtractedResumeText(null),
      /Uploaded PDF appears to be empty/i
    );
  });

  it("sanitizes null bytes to protect PostgreSQL text fields", () => {
    const textWithNull = "John Doe\0 Software Engineer with extensive experience in React, Node.js, and cloud systems building scalable web applications for enterprise clients across distributed microservices architectures.".repeat(2);
    const sanitized = validateExtractedResumeText(textWithNull);
    assert.strictEqual(sanitized.includes("\0"), false);
  });

  it("throws 400 when text has fewer than 30 meaningful words (scanned image PDF)", () => {
    const scannedPdfText = "Page 1 of 1 -- Scanned Document -- Title";
    assert.throws(
      () => validateExtractedResumeText(scannedPdfText),
      /scanned or contains insufficient text/i
    );
  });

  it("accepts text-based resumes with sufficient meaningful word count", () => {
    const validResume = `
      Sahil Sameer Siddique
      Full Stack Software Engineer
      Experience:
      Built scalable cloud applications with Node.js, Express, PostgreSQL, and React.
      Implemented secure OAuth 2.0 authentication, session invalidation with Redis caching,
      and integrated Google Gemini generative AI models for candidate interview evaluations.
      Proficient in Docker, Linux, CI/CD pipelines, and database optimization.
    `;
    const result = validateExtractedResumeText(validResume);
    assert.ok(result);
    assert.ok(result.length > 50);
  });
});
