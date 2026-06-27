import React, { useState, useEffect, useRef } from "react";
import { useInterview } from "../../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { interviewFormSchema } from "../../schemas/interview.schema.js";

const LOADING_STEPS = [
  { label: "Parsing Resume Data...", icon: "📄" },
  { label: "Analyzing Job Description...", icon: "🔍" },
  { label: "Generating Technical Questions...", icon: "🤖" },
  { label: "Finalizing Preparation Plan...", icon: "✨" },
];

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const Form = () => {
  const { generateReport } = useInterview();
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Validate using Zod schema reactively to enable/disable button
  const canGenerate = interviewFormSchema.safeParse({
    jobDescription,
    selfDescription,
    resumeFile,
  }).success;

  const handleFileSelect = (file) => {
    setFileError("");
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setFileError("Only Text based PDF files are supported.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setResumeFile(file);
    setResumeFileName(file.name);
  };

  const handleRemoveFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setResumeFile(null);
    setResumeFileName("");
    setFileError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0] || null;
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => setIsDraggingOver(false);

  const handleGenerateReport = async () => {
    setError("");
    const validationResult = interviewFormSchema.safeParse({
      jobDescription,
      selfDescription,
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
        selfDescription,
        resumeFile,
      });
      if (data && data.id) {
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

  // Advance loading step based on time, but never go past last step
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

  // ─── Main form ───────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in py-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-4 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          AI-Powered Analysis
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Create Your Custom{" "}
          <span className="text-gradient-cyan">Interview Plan</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Let our AI analyze the job requirements and your unique profile to
          build a winning strategy.
        </p>
      </div>

      {/* Inline error banner */}
      {error && (
        <div
          className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl text-sm text-red-300 animate-fade-in"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <svg
            className="w-4 h-4 mt-0.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.25a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6a.875.875 0 100-1.75.875.875 0 000 1.75z"
              clipRule="evenodd"
            />
          </svg>
          <p>{error}</p>
          <button
            onClick={() => setError("")}
            className="ml-auto shrink-0 text-red-400 hover:text-red-200 transition-colors"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Main Card */}
      <div
        className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30 relative"
        style={{
          background: "rgba(10,18,35,0.8)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* ── Loading overlay — sits on top of the card, no layout shift ── */}
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
                  background:
                    "linear-gradient(135deg,rgba(6,182,212,0.15),rgba(168,85,247,0.15))",
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

        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/60">
          {/* ── Left: Job Description ─────────────────────────────────────── */}
          <div className="p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(6,182,212,0.1)",
                  border: "1px solid rgba(6,182,212,0.2)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">
                  Target Job Description
                </h2>
                {/* Fixed: was misleadingly "Required" — any field is enough */}
                <span className="text-xs text-red-400">Required</span>
              </div>
            </div>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript...'`}
              maxLength={5000}
              className="flex-1 min-h-64 w-full rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200 leading-relaxed"
              style={{
                background: "rgba(3,7,18,0.6)",
                border: "1px solid rgba(51,65,85,0.6)",
              }}
            />
            <p className="text-xs text-slate-600 text-right mt-2">
              {jobDescription.length} / 5000
            </p>
          </div>

          {/* ── Right: Profile ────────────────────────────────────────────── */}
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "rgba(168,85,247,0.1)",
                  border: "1px solid rgba(168,85,247,0.2)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">
                  Your Profile
                </h2>
                <span className="text-xs text-slate-500">
                  Resume or description
                </span>
              </div>
            </div>

            {/* Dropzone */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-slate-300">
                  Upload Resume
                </label>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Best Results
                </span>
              </div>

              <label
                htmlFor="resume"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer transition-all duration-200 border-2 border-dashed ${
                  isDraggingOver
                    ? "border-cyan-400/70 bg-cyan-500/10 scale-[1.01]"
                    : resumeFileName
                    ? "border-cyan-500/50 bg-cyan-500/5"
                    : fileError
                    ? "border-red-500/50 bg-red-500/5"
                    : "border-slate-700/60 hover:border-slate-600 bg-slate-900/30 hover:bg-slate-900/50"
                }`}
              >
                <div className="text-2xl mb-2">
                  {fileError ? "⚠️" : resumeFileName ? "📄" : "☁️"}
                </div>

                {resumeFileName ? (
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-300 truncate max-w-[180px]">
                      {resumeFileName}
                    </p>
                    {/* Remove file button */}
                    <button
                      onClick={handleRemoveFile}
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      aria-label="Remove file"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-slate-300">
                      {fileError
                        ? fileError
                        : "Click to upload or drag & drop"}
                    </p>
                    {!fileError && (
                      <p className="text-xs text-slate-600 mt-1">
                        Text based PDF only · Max {MAX_FILE_SIZE_MB}MB
                      </p>
                    )}
                  </>
                )}

                <input
                  ref={fileInputRef}
                  onChange={(e) => handleFileSelect(e.target.files[0] || null)}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf"
                />
              </label>

              {/* Inline file error below dropzone (also shown inside above) */}
              {fileError && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <svg
                    className="w-3 h-3 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.25a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6a.875.875 0 100-1.75.875.875 0 000 1.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {fileError}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs text-slate-600 font-medium">OR</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Self Description */}
            <div>
              <label
                htmlFor="selfDescription"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Quick Self-Description
              </label>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                id="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience..."
                className="w-full min-h-28 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 leading-relaxed"
                style={{
                  background: "rgba(3,7,18,0.6)",
                  border: "1px solid rgba(51,65,85,0.6)",
                }}
              />
            </div>

            {/* Info tip */}
            <div
              className="flex items-start gap-3 p-3 rounded-xl text-sm text-slate-400"
              style={{
                background: "rgba(6,182,212,0.05)",
                border: "1px solid rgba(6,182,212,0.12)",
              }}
            >
              <svg
                className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                <strong className="text-slate-300">Job Description</strong> is
                required, plus at least one of{" "}
                <strong className="text-slate-300">Resume</strong> or{" "}
                <strong className="text-slate-300">Self Description</strong> to
                generate your personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 border-t border-slate-800/60 bg-slate-900/30">
          <span className="text-sm text-slate-500">AI-Powered · ~30 seconds</span>
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
