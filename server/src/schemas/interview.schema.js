import { z } from "zod";

export const createInterviewSchema = z.object({
  jobDescription: z
    .string({ message: "Job description is required" })
    .trim()
    .min(30, "Job description must be at least 30 characters")
    .max(1200, "Job description cannot exceed 1200 characters"),
});

export const interviewIdParamSchema = z.object({
  interviewId: z
    .string({ message: "Interview ID is required" })
    .trim()
    .min(1, "Interview ID is required"),
});

export const severityEnum = z.preprocess(
  (val) => (typeof val === "string" ? val.toLowerCase().trim() : val),
  z.enum(["low", "medium", "high"])
);

export const technicalQuestionOutputSchema = z.object({
  question: z.string().trim().min(1, "Question cannot be empty"),
  intention: z.string().trim().min(1, "Intention cannot be empty"),
  answer: z.string().trim().min(1, "Answer cannot be empty"),
});

export const behavioralQuestionOutputSchema = z.object({
  question: z.string().trim().min(1, "Question cannot be empty"),
  intention: z.string().trim().min(1, "Intention cannot be empty"),
  answer: z.string().trim().min(1, "Answer cannot be empty"),
});

export const skillGapOutputSchema = z.object({
  skill: z.string().trim().min(1, "Skill name cannot be empty"),
  severity: severityEnum,
});

export const preparationPlanDayOutputSchema = z.object({
  day: z.coerce.number().int().min(1),
  focus: z.string().trim().min(1, "Focus cannot be empty"),
  tasks: z.array(z.string().trim().min(1)).min(1, "Must contain at least one task"),
});

export const interviewReportOutputSchema = z.object({
  matchScore: z.coerce
    .number()
    .min(0)
    .max(100)
    .transform((val) => Math.round(val)),
  title: z.string().trim().min(1).default("Technical Interview Preparation"),
  technicalQuestions: z
    .array(technicalQuestionOutputSchema)
    .min(1, "Must contain at least 1 technical question"),
  behavioralQuestions: z
    .array(behavioralQuestionOutputSchema)
    .min(1, "Must contain at least 1 behavioral question"),
  skillGaps: z.array(skillGapOutputSchema).default([]),
  preparationPlan: z
    .array(preparationPlanDayOutputSchema)
    .min(1, "Must contain at least 1 preparation day"),
});