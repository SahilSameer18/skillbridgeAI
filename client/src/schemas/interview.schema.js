import { z } from "zod";

export const interviewFormSchema = z.object({
  jobDescription: z
    .string({ message: "Job description is required." })
    .trim()
    .min(30, "Job description must be at least 30 characters.")
    .max(1200, "Job description cannot exceed 1200 characters."),
  resumeFile: z
    .any()
    .refine((file) => file !== null && file !== undefined, "Resume PDF file is required."),
});


  