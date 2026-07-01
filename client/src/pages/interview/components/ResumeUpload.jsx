import React, { useState, useRef } from "react";

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * ResumeUpload Component
 * Handles file drag-and-drop, validation (file type, size limits),
 * and preview of the selected PDF resume file.
 */
const ResumeUpload = ({ onChange }) => {
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Validate and handle file input
  const processFile = (file) => {
    setFileError("");
    if (!file) return;

    // Supported formats (Standard Text-based PDFs)
    const validTypes = ["application/pdf"];
    if (file.type !== "application/pdf") {
      setFileError("Only text-based PDF files are supported.");
      onChange(null);
      return;
    }

    // Size limit checks
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      onChange(null);
      return;
    }

    setFileName(file.name);
    onChange(file);
  };

  // Remove the selected file
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFileName("");
    setFileError("");
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Drag and drop event handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0] || null;
    processFile(file);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/40 p-6 rounded-2xl border border-slate-800/80 transition-all duration-300 hover:border-cyan-500/20">
      {/* Header section */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-105"
            style={{
              background: "rgba(168,85,247,0.08)",
              border: "1px solid rgba(168,85,247,0.2)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-white text-base tracking-wide">
              Your Resume
            </h2>
            <p className="text-xs text-cyan-400 font-medium mt-0.5">Required</p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
          Best Results
        </span>
      </div>

      {/* Drag & Drop Container */}
      <div className="flex-1 flex flex-col justify-center min-h-[300px]">
        <label
          htmlFor="resume-upload-input"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center p-8 rounded-xl cursor-pointer transition-all duration-300 border-2 border-dashed h-full ${
            isDragging
              ? "border-cyan-400/80 bg-cyan-500/10 scale-[1.01]"
              : fileName
              ? "border-cyan-500/40 bg-cyan-500/5 hover:border-cyan-500/60"
              : fileError
              ? "border-red-500/40 bg-red-500/5"
              : "border-slate-800 bg-slate-950/30 hover:bg-slate-950/60 hover:border-slate-700"
          }`}
        >
          {/* Status Icon */}
          <div className="text-4xl mb-4 transition-transform duration-300 hover:scale-110">
            {fileError ? "⚠️" : fileName ? "📄" : "☁️"}
          </div>

          {fileName ? (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-semibold text-slate-200 text-center max-w-[220px] truncate">
                {fileName}
              </p>
              <button
                onClick={handleRemove}
                className="mt-2 text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-400 bg-slate-800/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                aria-label="Remove resume"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Remove PDF
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm font-medium text-slate-300">
                {fileError ? fileError : "Click to browse or drag & drop"}
              </p>
              {!fileError && (
                <p className="text-xs text-slate-500 mt-2">
                  Text-based PDF only · Max {MAX_FILE_SIZE_MB}MB
                </p>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            onChange={(e) => processFile(e.target.files[0] || null)}
            hidden
            type="file"
            id="resume-upload-input"
            name="resume"
            accept=".pdf"
          />
        </label>
      </div>

      {/* Info Tip box */}
      <div className="mt-5 flex items-start gap-3 p-3.5 rounded-xl text-xs text-slate-400 bg-cyan-500/5 border border-cyan-500/10">
        <svg
          className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="leading-relaxed">
          Ensure your resume PDF contains selectable text (not scanned images) for the best analysis results.
        </p>
      </div>
    </div>
  );
};

export default ResumeUpload;
