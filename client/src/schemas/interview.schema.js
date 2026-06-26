import { z } from "zod";

export const interviewFormSchema = z
  .object({
    jobDescription: z
      .string()
      .trim()
      .min(1, "Job description is required."),
    selfDescription: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),
    resumeFile: z
      .any()
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      const hasSelfDesc = !!(data.selfDescription && data.selfDescription.trim().length > 0);
      const hasResume = !!data.resumeFile;
      return hasSelfDesc || hasResume;
    },
    {
      message: "Either resume or self description is required to generate your personalized plan.",
      path: ["selfDescription"],
    }
  );


  