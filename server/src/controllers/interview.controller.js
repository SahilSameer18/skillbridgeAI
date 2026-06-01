import * as pdfParse from "pdf-parse";
import {
  generateInterviewReport,
  generateResumePdf,
} from "../services/ai.service.js";
import interviewReportModel from "../models/interviewReport.model.js";

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
  const { selfDescription, jobDescription } = req.body;

  if (!jobDescription || jobDescription.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Job description is required" });
  }

  let resumeText = "";
  if (req.file) {
    try {
      const resumeContent = await new pdfParse.PDFParse(
        Uint8Array.from(req.file.buffer),
      ).getText();
      resumeText = resumeContent.text;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      return res.status(400).json({
        success: false,
        message: "Failed to parse uploaded resume PDF",
      });
    }
  } else if (!selfDescription || selfDescription.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Either resume or self description is required",
    });
  }

  try {
    const interViewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      ...interViewReportByAi,
      jobDescription, // Place after spread to prevent overriding
    });

    res.status(201).json({
      success: true,
      message: "Interview report generated successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error generating interview report:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate interview report" });
  }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
  const { interviewId } = req.params;

  try {
    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
      user: req.user.id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview report retrieved successfully",
      interviewReport,
    });
  } catch (error) {
    console.error("Error fetching interview report by ID:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch interview report" });
  }
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
      );

    res.status(200).json({
      success: true,
      message: "Interview reports retrieved successfully",
      interviewReports,
    });
  } catch (error) {
    console.error("Error fetching all interview reports:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch interview reports" });
  }
}

/**
 * @description Controller to delete an interview report by ID.
 */
async function deleteInterviewReportController(req, res) {
  const { interviewId } = req.params;

  try {
    const deletedReport = await interviewReportModel.findOneAndDelete({
      _id: interviewId,
      user: req.user.id,
    });

    if (!deletedReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found or insufficient permissions",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview report deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting an interview report:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete interview report" });
  }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
  const { interviewReportId } = req.params;

  try {
    const interviewReport =
      await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview report not found",
      });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({
      resume,
      jobDescription,
      selfDescription,
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate resume PDF" });
  }
}

export {
  generateInterViewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  deleteInterviewReportController,
  generateResumePdfController,
};
