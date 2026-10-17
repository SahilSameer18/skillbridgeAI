import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { interviewFormSchema } from "../src/schemas/interview.schema.js";

describe("Client Interview Form Schema Unit Tests", () => {
  it("rejects jobDescription shorter than 30 characters", () => {
    const res = interviewFormSchema.safeParse({
      jobDescription: "Too brief",
      resumeFile: { name: "resume.pdf" },
    });
    assert.strictEqual(res.success, false);
    assert.match(res.error.issues[0].message, /must be at least 30 characters/i);
  });

  it("rejects jobDescription longer than 1200 characters", () => {
    const res = interviewFormSchema.safeParse({
      jobDescription: "x".repeat(1201),
      resumeFile: { name: "resume.pdf" },
    });
    assert.strictEqual(res.success, false);
    assert.match(res.error.issues[0].message, /cannot exceed 1200 characters/i);
  });

  it("accepts valid jobDescription within 30 to 1200 characters", () => {
    const res = interviewFormSchema.safeParse({
      jobDescription: "Senior Frontend Engineer with strong proficiency in React, TypeScript, Tailwind, and Vite.",
      resumeFile: { name: "resume.pdf" },
    });
    assert.strictEqual(res.success, true);
  });

  it("rejects missing resumeFile", () => {
    const res = interviewFormSchema.safeParse({
      jobDescription: "Senior Frontend Engineer with strong proficiency in React, TypeScript, Tailwind, and Vite.",
      resumeFile: null,
    });
    assert.strictEqual(res.success, false);
    assert.match(res.error.issues[0].message, /resume pdf file is required/i);
  });
});
