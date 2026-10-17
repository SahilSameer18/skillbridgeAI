import React, { useRef, useState, useEffect } from "react";

const STEPS = [
  {
    num: "01",
    label: "INGEST & CALIBRATE",
    title: "Define Target Specifications",
    desc: "Paste your target job description and upload your resume. Our parser tokenizes credentials and expectations in under 5 seconds.",
    color: "#FF6662",
    icon: (
      <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    detail: "PDF PARSING · RAW TEXT EXTRACTION",
  },
  {
    num: "02",
    label: "NEURAL GAP SYNTHESIS",
    title: "Correlate Skills & Missing Stacks",
    desc: "The Gemini AI engine extracts role requirements, evaluates candidate proof points, and identifies severity-ranked technical gaps.",
    color: "#FE9A00",
    icon: (
      <svg className="w-6 h-6 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="m16.2 7.8-2 2" />
        <path d="m7.8 16.2 2-2" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    detail: "CROSS-REGION BENCHMARKING",
  },
  {
    num: "03",
    label: "STRATEGY EXECUTION",
    title: "Targeted Roadmap & Interview Dossier",
    desc: "Study tailored scenario questions, execute the 10-day prep roadmap, track readiness metrics, and export executive PDF dossiers.",
    color: "#34D399",
    icon: (
      <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    detail: "PRINT-READY EXECUTIVE DOSSIER",
  },
];

const ProcessTimeline = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#08080A] font-sans">
      <div className="max-w-6xl mx-auto relative">
        {/* Section Heading */}
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.035em] mb-4">
            From raw application to <br />
            <span className="text-gradient-coral">interview ready</span>
          </h2>
          <p className="text-secondary/75 text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-normal">
            Three simple steps that turn your job description into an actionable interview preparation strategy.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-14 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {STEPS.map((step, index) => (
              <div
                key={step.num}
                className={`relative flex flex-col items-center text-center transition-all duration-500 ${
                  visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setActiveStep(step.num)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Node Box */}
                <div
                  className="studio-card relative z-10 w-28 h-28 rounded-2xl flex flex-col items-center justify-center mb-8 transition-all duration-300 group cursor-default"
                  style={{
                    boxShadow:
                      activeStep === step.num
                        ? `0 12px 36px -8px ${step.color}25`
                        : "0 12px 36px -8px rgba(0,0,0,0.7)",
                    transform: activeStep === step.num ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {step.icon}
                  <span
                    className="text-[10px] font-mono font-bold uppercase tracking-widest mt-2"
                    style={{ color: activeStep === step.num ? step.color : "rgba(255,255,255,0.4)" }}
                  >
                    PHASE {step.num}
                  </span>
                </div>

                {/* Content */}
                <span
                  className="text-[10px] font-mono font-bold uppercase tracking-wider mb-3 px-3 py-1 rounded-md"
                  style={{
                    color: step.color,
                    background: `${step.color}10`,
                    border: `1px solid ${step.color}25`,
                  }}
                >
                  {step.label}
                </span>

                <h3 className="text-base font-bold text-white mb-2 tracking-tight">{step.title}</h3>
                <p className="text-xs sm:text-sm text-secondary/70 leading-relaxed mb-4 max-w-xs font-normal">
                  {step.desc}
                </p>

                <span className="text-[10px] font-mono tracking-wider text-white/40">
                  {step.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;