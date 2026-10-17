import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createInterviewSchema,
  interviewIdParamSchema,
  interviewReportOutputSchema,
} from "../src/schemas/interview.schema.js";

describe("Interview Schema Unit Tests", () => {
  describe("createInterviewSchema", () => {
    it("rejects jobDescription shorter than 30 characters", () => {
      const res = createInterviewSchema.safeParse({
        jobDescription: "Short text",
      });
      assert.strictEqual(res.success, false);
      assert.match(res.error.issues[0].message, /must be at least 30 characters/i);
    });

    it("rejects jobDescription longer than 1200 characters", () => {
      const res = createInterviewSchema.safeParse({
        jobDescription: "x".repeat(1201),
      });
      assert.strictEqual(res.success, false);
      assert.match(res.error.issues[0].message, /cannot exceed 1200 characters/i);
    });

    it("accepts valid jobDescription within 30 to 1200 characters", () => {
      const res = createInterviewSchema.safeParse({
        jobDescription: "Senior Software Engineer with deep expertise in Node.js, Express, and PostgreSQL databases.",
      });
      assert.strictEqual(res.success, true);
      assert.strictEqual(
        res.data.jobDescription,
        "Senior Software Engineer with deep expertise in Node.js, Express, and PostgreSQL databases."
      );
    });
  });

  describe("interviewIdParamSchema", () => {
    it("rejects empty interviewId", () => {
      const res = interviewIdParamSchema.safeParse({ interviewId: "" });
      assert.strictEqual(res.success, false);
    });

    it("accepts valid interviewId", () => {
      const res = interviewIdParamSchema.safeParse({ interviewId: "int_abc123" });
      assert.strictEqual(res.success, true);
    });
  });

  describe("interviewReportOutputSchema", () => {
    it("validates well-formed report and rounds matchScore", () => {
      const mockReport = {
        matchScore: 84.7,
        title: "Senior Backend Engineer",
        technicalQuestions: [
          { question: "Explain event loop", intention: "Test concurrency understanding", answer: "Node uses libuv..." },
        ],
        behavioralQuestions: [
          { question: "Describe a project conflict", intention: "Assess communication", answer: "I used active listening..." },
        ],
        skillGaps: [{ skill: "Redis", severity: "medium" }],
        preparationPlan: [
          { day: 1, focus: "Event Loop & Streams", tasks: ["Review docs", "Write sample script"] },
        ],
      };

      const res = interviewReportOutputSchema.safeParse(mockReport);
      assert.strictEqual(res.success, true);
      assert.strictEqual(res.data.matchScore, 85); // Rounded from 84.7
      assert.strictEqual(res.data.technicalQuestions.length, 1);
    });

    it("rejects report missing technical questions", () => {
      const invalidReport = {
        matchScore: 70,
        technicalQuestions: [],
        behavioralQuestions: [{ question: "Q", intention: "I", answer: "A" }],
        preparationPlan: [{ day: 1, focus: "F", tasks: ["T"] }],
      };
      const res = interviewReportOutputSchema.safeParse(invalidReport);
      assert.strictEqual(res.success, false);
    });
  });
});
