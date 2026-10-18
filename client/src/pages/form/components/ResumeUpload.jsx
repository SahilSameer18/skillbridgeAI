import React, { useState, useRef, useMemo } from "react";

const MAX_FILE_SIZE_MB = 4;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * ResumeUpload Component
 * Handles file drag-and-drop, validation (file type, size limits),
 * and preview of the selected PDF resume file with an animated parsing status.
 */
const ResumeUpload = ({ value, onChange }) => {
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Derived state directly from value prop — eliminates redundant effect & cascading renders
  const fileName = value ? (value.name || "resume.pdf") : "";
  const fileSize = useMemo(() => {
    if (!value) return "";
    const sizeInBytes = value.size || 1024 * 1024 * 1.2;
    const sizeInKb = (sizeInBytes / 1024).toFixed(1);
    return sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${sizeInKb} KB`;
  }, [value]);

  // Validate and handle file input
  const processFile = (file) => {
    setFileError("");

    if (!file) return;

    // Supported formats (Standard Text-based PDFs)
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

    // Attach file immediately for validation
    onChange(file);
  };

  // Remove the selected file
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className={`flex flex-col h-full studio-card p-4 sm:p-6 md:p-7 transition-all duration-300 ${
      isDragging ? "border-amber/50 shadow-xs" : ""
    }`}>
      {/* Header section */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 border border-accent/25 shadow-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-primary text-base tracking-tight font-display">
              Candidate Resume
            </h2>
            <p className="text-xs text-accent font-mono font-medium mt-0.5">PDF FORMAT REQUIRED</p>
          </div>
        </div>
        <span className="studio-badge-coral">
          Primary Input
        </span>
      </div>

      {/* Drag & Drop Container */}
      <div className="flex-grow flex flex-col justify-center min-h-[280px]">
        <label
          htmlFor="resume-upload-input"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl cursor-pointer transition-all duration-200 border-2 border-dashed h-full studio-well ${
            isDragging
              ? "border-amber/80 bg-amber/10 scale-[1.01]"
              : fileName
              ? "border-accent/40 bg-accent/5 hover:border-accent/60"
              : fileError
              ? "border-red-500/40 bg-red-500/5"
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50/50"
          }`}
        >
          {/* Status Icon */}
          <div className={`mb-4 transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}>
            {fileError ? (
              <svg className="w-12 h-12 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ) : fileName ? (
              <svg className="w-12 h-12 text-emerald-600 animate-fade-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className={`w-12 h-12 transition-colors duration-300 ${isDragging ? "text-amber-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>

          {fileName ? (
            <div className="flex flex-col items-center gap-3 w-full max-w-xs text-center">
              <div className="studio-card p-3.5 w-full bg-white shadow-xs">
                <p className="text-sm font-semibold text-primary truncate font-display">
                  {fileName}
                </p>
                <p className="text-[11px] text-muted mt-1 font-mono">
                  {fileSize} · VALIDATED PDF
                </p>
              </div>

              {/* Ready status indicator */}
              <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-mono font-bold mt-1 animate-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-xs" />
                DOCUMENT READY
              </div>

              <button
                onClick={handleRemove}
                className="mt-1 text-xs studio-btn-secondary px-3 py-1.5 rounded-lg text-red-600 hover:text-red-700"
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
                Remove File
              </button>
            </div>
          ) : (
            <div className="text-center px-4">
              <p className="text-sm font-semibold text-primary leading-relaxed">
                {fileError ? fileError : "Click to browse or drag & drop"}
              </p>
              {!fileError && (
                <p className="text-xs text-secondary mt-2 font-mono">
                  PDF format only · Max {MAX_FILE_SIZE_MB}MB
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
      <div className="mt-5 flex items-start gap-3 p-3.5 rounded-xl text-xs text-amber-900 bg-amber-50 border border-amber-200">
        <svg
          className="w-4 h-4 mt-0.5 shrink-0 text-amber-700"
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
        <p className="leading-relaxed font-sans font-medium">
          Make sure your resume is in text-based PDF format. Scanned image files cannot be read accurately by the AI engine.
        </p>
      </div>
    </div>
  );
};

export default ResumeUpload;
