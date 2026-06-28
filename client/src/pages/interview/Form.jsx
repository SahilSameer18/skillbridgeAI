import React, { useState, useEffect } from "react";
import { useInterview } from "../../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { interviewFormSchema } from "../../schemas/interview.schema.js";
import JobDescriptionInput from "./components/JobDescriptionInput.jsx";
import ResumeUpload from "./components/ResumeUpload.jsx";

// Simulated step notifications during AI generation process
const LOADING_STEPS = [
  { label: "Parsing Resume Data...", icon: "📄" },
  { label: "Analyzing Job Description...", icon: "🔍" },
  { label: "Generating Technical Questions...", icon: "🤖" },
  { label: "Finalizing Preparation Plan...", icon: "✨" },
];

/**
 * Form Component
 * Main page for triggering the AI interview preparation analysis.
 * Combines JobDescriptionInput and ResumeUpload side-by-side.
 */
const Form = () => {
  const { generateReport } = useInterview();
  const navigate = useNavigate();

  // Core Form State
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");

  // Zod validation check to reactively enable/disable CTA button
  const canGenerate = interviewFormSchema.safeParse({
    jobDescription,
    resumeFile,
  }).success;

  // Triggers AI report generation
  const handleGenerateReport = async () => {
    setError("");

    // Double-check validation before dispatching
    const validationResult = interviewFormSchema.safeParse({
      jobDescription,
      resumeFile,
    });
    
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    setIsGenerating(true);
    try {
      const data = await generateReport({
        jobDescription,
        resumeFile,
      });
      if (data && data.id) {
        // Navigate to the dynamic report dashboard
        navigate(`/interview/${data.id}`);
      } else {
        setError("Failed to generate report. Please try again.");
      }
    } catch (err) {
      setError(
        err?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Step-by-step loading animation interval
  useEffect(() => {
    let interval;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 5000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const progress = ((loadingStep + 1) / LOADING_STEPS.length) * 100;

  return (
    <div className="animate-fade-in py-4">
      {/* Header Info */}
      <div className="mb-8 text-center">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          AI-Powered Match Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Compare Your <span className="text-gradient-cyan">Resume & Job Description</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Upload your resume and paste the job description to get a customized interview questions bank and a 10-day prep roadmap.
        </p>
      </div>

      {/* Global error banner */}
      {error && (
        <div
          className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl text-sm text-red-300 animate-fade-in"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.25a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6a.875.875 0 100-1.75.875.875 0 000 1.75z" clipRule="evenodd" />
          </svg>
          <p>{error}</p>
          <button
            onClick={() => setError("")}
            className="ml-auto shrink-0 text-red-400 hover:text-red-200 transition-colors"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Console Box */}
      <div
        className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 relative"
        style={{
          background: "rgba(10,18,35,0.8)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Loading Overlay */}
        {isGenerating && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl animate-fade-in"
            style={{
              background: "rgba(10,18,35,0.92)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="text-center max-w-sm mx-auto px-6">
              <div
                className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl animate-float"
                style={{
                  background: "linear-gradient(135deg,rgba(6,182,212,0.15),rgba(168,85,247,0.15))",
                  border: "1px solid rgba(6,182,212,0.2)",
                }}
              >
                {LOADING_STEPS[loadingStep].icon}
              </div>

              <h2 className="text-xl font-bold text-white mb-2">
                {LOADING_STEPS[loadingStep].label}
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                AI is preparing your personalized interview plan...
              </p>

              <div className="w-full rounded-full h-1.5 mb-2 bg-slate-800">
                <div
                  className="h-1.5 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg,#06b6d4,#a855f7)",
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Step {loadingStep + 1} of {LOADING_STEPS.length}
              </p>

              <div className="flex justify-center gap-2">
                {LOADING_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i <= loadingStep ? "w-6 h-2" : "w-2 h-2"
                    }`}
                    style={{
                      background:
                        i <= loadingStep
                          ? "linear-gradient(90deg,#06b6d4,#a855f7)"
                          : "rgba(100,116,139,0.4)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Side-by-side Grid Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 md:p-8">
          <JobDescriptionInput
            value={jobDescription}
            onChange={setJobDescription}
          />
          <ResumeUpload
            onChange={setResumeFile}
          />
        </div>

        {/* Footer Area */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 border-t border-slate-800/60 bg-slate-900/30">
          <span className="text-xs text-slate-500">AI-Powered Analysis · takes ~30 seconds</span>
          <button
            onClick={handleGenerateReport}
            disabled={!canGenerate}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            style={{
              background: "linear-gradient(135deg,#06b6d4,#a855f7)",
              boxShadow: "0 4px 20px rgba(168,85,247,0.2)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            Generate My Interview Strategy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form;
