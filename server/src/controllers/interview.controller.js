import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";
import prisma from "../lib/prisma.js";
import { attachSkillIds } from "../services/skillMatcher.service.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
const generateInterViewReportController = asyncHandler(async (req, res, next) => {
  const { jobDescription } = req.body;

  if (!jobDescription || jobDescription.trim() === "") {
    throw new ApiError(400, "Job description is required");
  }

  // Resume PDF file is now mandatory
  if (!req.file) {
    throw new ApiError(400, "Resume PDF file is required");
  }

  let resumeText = "";
  try {
    const resumeContent = await new pdfParse.PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
    resumeText = resumeContent.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new ApiError(400, "Failed to parse uploaded resume PDF");
  }

  const interViewReportByAi = await generateInterviewReport({
    resume: resumeText,
    jobDescription,
  });

  const skillGapsWithIds = await attachSkillIds(
    interViewReportByAi.skillGaps,
    prisma,
  );

  const interviewReport = await prisma.interviewReport.create({
    data: {
      userId: req.user.id,
      resume: resumeText,
      jobDescription,
      matchScore: interViewReportByAi.matchScore,
      title: interViewReportByAi.title,
      technicalQuestions: {
        create: interViewReportByAi.technicalQuestions,
      },
      behavioralQuestions: {
        create: interViewReportByAi.behavioralQuestions,
      },
      skillGaps: {
        create: skillGapsWithIds.map((gap) => ({
          skill: gap.skill,
          severity: gap.severity.toLowerCase(),
          skillId: gap.skillId,
        })),
      },
      preparationPlan: {
        create: interViewReportByAi.preparationPlan.map((plan) => ({
          ...plan,
          tasks: plan.tasks,
        })),
      },
    },

    include: {
      technicalQuestions: true,
      behavioralQuestions: true,
      skillGaps: {
        include: {
          skillRef: {
            include: {
              resources: true,
            },
          },
        },
      },
      preparationPlan: true,
    },
  });

  res.status(201).json({
    success: true,
    message: "Interview report generated successfully",
    interviewReport: interviewReport,
  });
});

/**
 * @description Controller to get interview report by interviewId.
 */
const getInterviewReportByIdController = asyncHandler(async (req, res, next) => {
  const { interviewId } = req.params;

  const interviewReport = await prisma.interviewReport.findUnique({
    where: { id: interviewId },
    include: {
      technicalQuestions: true,
      behavioralQuestions: true,
      skillGaps: {
        include: {
          skillRef: {
            include: {
              resources: true,
            },
          },
        },
      },
      preparationPlan: true,
    },
  });

  if (!interviewReport || interviewReport.userId !== req.user.id) {
    throw new ApiError(404, "Interview report not found");
  }

  res.status(200).json({
    success: true,
    message: "Interview report retrieved successfully",
    interviewReport: interviewReport,
  });
});

/**
 * @description Controller to get all interview reports of logged in user.
 */
const getAllInterviewReportsController = asyncHandler(async (req, res, next) => {
  const interviewReports = await prisma.interviewReport.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      jobDescription: true,
      matchScore: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    success: true,
    message: "Interview reports retrieved successfully",
    interviewReports,
  });
});

/**
 * @description Controller to delete an interview report by ID.
 */
const deleteInterviewReportController = asyncHandler(async (req, res, next) => {
  const { interviewId } = req.params;

  const report = await prisma.interviewReport.deleteMany({
    where: { id: interviewId, userId: req.user.id },
  });

  if (report.count === 0) {
    throw new ApiError(404, "Interview report not found or insufficient permissions");
  }

  res.status(200).json({
    success: true,
    message: "Interview report deleted successfully",
  });
});

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
const generateResumePdfController = asyncHandler(async (req, res, next) => {
  const { interviewReportId } = req.params;

  const interviewReport = await prisma.interviewReport.findUnique({
    where: { id: interviewReportId },
  });

  if (!interviewReport || interviewReport.userId !== req.user.id) {
    throw new ApiError(404, "Interview report not found");
  }

  const { resume, jobDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    jobDescription,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
  });

  res.send(pdfBuffer);
});

export {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  deleteInterviewReportController,
  generateResumePdfController,
};
