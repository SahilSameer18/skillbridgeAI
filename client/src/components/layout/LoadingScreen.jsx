import React, { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * LoadingScreen Component
 * Executive-grade, ambient loading overlay designed by high-end studio principles.
 * Replaces distracting spinners with a refined obsidian glass card, hairline laser progress,
 * and high-precision monospace telemetry.
 */
const LoadingScreen = ({
  message = "Calibrating Assessment...",
  subtitle = "Synthesizing resume credentials and role expectations.",
  steps = [],
  currentStep = 0,
  fullScreen = true,
}) => {
  // Prevent background scrolling while modal is mounted
  useEffect(() => {
    if (fullScreen) {
      const originalHtmlOverflow = document.documentElement.style.overflow;
      const originalBodyOverflow = document.body.style.overflow;

      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";

      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.overflow = originalBodyOverflow;
      };
    }
  }, [fullScreen]);

  const content = (
    <div
      className={`flex flex-col items-center justify-center animate-fade-in ${
        fullScreen
          ? "fixed inset-0 z-[99999] overflow-hidden"
          : "relative py-12 px-6 w-full"
      }`}
      style={{
        background: fullScreen
          ? "rgba(8, 8, 10, 0.88)"
          : "transparent",
        backdropFilter: fullScreen ? "blur(24px) saturate(160%)" : "none",
        WebkitBackdropFilter: fullScreen ? "blur(24px) saturate(160%)" : "none",
      }}
    >
      {/* Subtle radial ambient highlight */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, rgba(255, 102, 98, 0.06) 0%, transparent 65%)",
        }}
      />

      {/* Main Studio Glass Console Card */}
      <div className="studio-card max-w-md w-full px-8 py-9 relative z-10 text-center overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/80">
        
        {/* Whisper-thin laser progress line at the very top rim */}
        <div className="absolute top-0 left-0 right-0 laser-progress" />

        {/* Studio Monogram Emblem */}
        <div className="relative mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center bg-white/[0.03] border-t border-white/[0.18] border-x border-white/[0.06] border-b border-black/40 shadow-xl">
          {/* Ambient inner aura */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/20 to-amber/10 blur-md pointer-events-none" />

          {/* Precision Monogram SVG */}
          <svg className="w-8 h-8 text-accent relative z-10" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 10L16 6L24 10L24 22L16 26L8 22Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-90"
            />
            <path
              d="M16 6V26"
              stroke="url(#emblemGlow)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="16" cy="16" r="3" fill="#fe9a00" />
            <defs>
              <linearGradient id="emblemGlow" x1="16" y1="6" x2="16" y2="26">
                <stop offset="0%" stopColor="#ff6662" />
                <stop offset="100%" stopColor="#fe9a00" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center px-3 py-1 rounded-full studio-badge-coral mb-4">
          <span className="font-mono text-xs uppercase tracking-wider">Processing</span>
        </div>

        {/* Dynamic Typography */}
        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2 tracking-tight">
          {message}
        </h3>
        <p className="text-secondary text-xs sm:text-sm max-w-xs mx-auto mb-7 leading-relaxed">
          {subtitle}
        </p>

        {/* Architectural Checklist Telemetry */}
        {steps.length > 0 && (
          <div className="w-full flex flex-col gap-2.5 studio-well p-4 text-left">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isActive = idx === currentStep;
              const isUpcoming = idx > currentStep;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 py-1 transition-all duration-200 ${
                    isUpcoming ? "opacity-35" : "opacity-100"
                  }`}
                >
                  {/* Status Indicator */}
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 font-mono text-[10px] font-semibold transition-all duration-200 ${
                      isCompleted
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : isActive
                        ? "bg-accent/20 text-accent border border-accent/40"
                        : "bg-white/[0.03] text-muted border border-white/[0.06]"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      `0${idx + 1}`
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={`text-xs truncate ${
                      isActive
                        ? "text-primary font-semibold"
                        : isCompleted
                        ? "text-secondary font-medium"
                        : "text-muted"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return createPortal(content, document.body);
  }

  return content;
};

export default LoadingScreen;

