import React, { useState, useRef, useEffect } from "react";
import { useInterview } from "../../hooks/useInterview.js";
import { useNavigate } from "react-router";

const LOADING_STEPS = [
  { label: "Parsing Resume Data...", icon: "📄" },
  { label: "Analyzing Job Description...", icon: "🔍" },
  { label: "Generating Technical Questions...", icon: "🤖" },
  { label: "Finalizing Preparation Plan...", icon: "✨" },
];

const Form = () => {
  const { generateReport } = useInterview();
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  const canGenerate = Boolean(
    jobDescription.trim() || selfDescription.trim() || resumeFileName,
  );

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    console.log("resumeFile:", resumeFile);
    setIsGenerating(true);
    try {
      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      if (data && data.interviewReport?.id) {
        navigate(`/interview/${data.interviewReport.id}`);
      } else {
        alert("Failed to generate report. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    let interval;
    if (isGenerating) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
      }, 5000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (isGenerating) {
    const progress = ((loadingStep + 1) / LOADING_STEPS.length) * 100;
    return (
      <div className="min-h-[70vh] flex items-center justify-center animate-fade-in">
        <div className="text-center max-w-md mx-auto px-4">
          {/* Animated icon */}
          <div
            className="w-20 h-20 mx-auto mb-8 rounded-2xl flex items-center justify-center text-4xl animate-float"
            style={{
              background:
                "linear-gradient(135deg,rgba(6,182,212,0.15),rgba(168,85,247,0.15))",
              border: "1px solid rgba(6,182,212,0.2)",
            }}
          >
            {LOADING_STEPS[loadingStep].icon}
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 animate-fade-in-up">
            {LOADING_STEPS[loadingStep].label}
          </h2>
          <p className="text-slate-400 mb-8">
            AI is preparing your personalized interview plan...
          </p>

          {/* Progress bar */}
          <div className="w-full rounded-full h-1.5 mb-3 bg-slate-800">
            <div
              className="h-1.5 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg,#06b6d4,#a855f7)",
              }}
            />
          </div>
          <p className="text-xs text-slate-500">
            Step {loadingStep + 1} of {LOADING_STEPS.length}
          </p>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {LOADING_STEPS.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${i <= loadingStep ? "w-6 h-2" : "w-2 h-2"}`}
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
    );
  }

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

      {/* Main Card */}
      <div
        className="rounded-2xl overflow-hidden shadow-2xl shadow-black/30"
        style={{
          background: "rgba(10,18,35,0.8)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/60">
          {/* Left: Job Description */}
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
                <span className="text-xs text-cyan-400">Required</span>
              </div>
            </div>
            <textarea
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

          {/* Right: Profile */}
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
                className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer transition-all duration-200 border-2 border-dashed ${resumeFileName ? "border-cyan-500/50 bg-cyan-500/5" : "border-slate-700/60 hover:border-slate-600 bg-slate-900/30 hover:bg-slate-900/50"}`}
              >
                <div className="text-2xl mb-2">
                  {resumeFileName ? "📄" : "☁️"}
                </div>
                <p className="text-sm font-medium text-slate-300">
                  {resumeFileName
                    ? resumeFileName
                    : "Click to upload or drag & drop"}
                </p>
                {!resumeFileName && (
                  <p className="text-xs text-slate-600 mt-1">
                    PDF or DOCX · Max 5MB
                  </p>
                )}
                <input
                  ref={resumeInputRef}
                  onChange={(e) =>
                    setResumeFileName(e.target.files[0]?.name || "")
                  }
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                />
              </label>
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
                Either a <strong className="text-slate-300">Resume</strong> or a{" "}
                <strong className="text-slate-300">Self Description</strong> is
                required to generate a personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 border-t border-slate-800/60 bg-slate-900/30">
          <span className="text-sm text-slate-500">
            AI-Powered · ~30 seconds
          </span>
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
