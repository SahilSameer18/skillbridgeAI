import React from "react";
import { Link } from "react-router";
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiArrowUpRight } from "react-icons/fi";

const SOCIAL_LINKS = [
  {
    icon: <FiGithub className="w-4 h-4" />,
    url: "https://github.com/SahilSameer18",
    label: "GitHub",
  },
  {
    icon: <FiLinkedin className="w-4 h-4" />,
    url: "https://www.linkedin.com/in/sahil-sameer-siddique/",
    label: "LinkedIn",
  },
  {
    icon: <FiInstagram className="w-4 h-4" />,
    url: "https://instagram.com/yourprofile",
    label: "Instagram",
  },
  {
    icon: <FiMail className="w-4 h-4" />,
    url: "mailto:sahilsameer.dev18@gmail.com",
    label: "Email",
  },
];

const PLATFORM_LINKS = [
  { name: "Home Showcase", url: "/" },
  { name: "Strategy Console", url: "/generate" },
  { name: "Preparation Workspace", url: "/dashboard" },
  { name: "Candidate Profile", url: "/profile" },
];

const LEGAL_LINKS = [
  { name: "Privacy Policy", url: "#" },
  { name: "Terms of Service", url: "#" },
  { name: "Security Architecture", url: "#" },
];

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-white/[0.06] bg-[#060608] relative overflow-hidden w-full max-w-full font-sans">
      {/* Specular Ambient Apex Lighting Anchor — Pure gradient, zero blur overhead */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] max-w-full h-[160px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,102,98,0.06) 0%, rgba(254,154,0,0.02) 40%, transparent 75%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12">
          
          {/* Column 1: Brand & Strategic Purpose (Span 5) */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#0e0e12] border-t border-white/[0.16] border-x border-b border-white/[0.06] flex items-center justify-center shadow-md group-hover:border-accent/40 transition-colors">
                <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Skill<span className="text-accent">Bridge</span> <span className="text-white/40 text-xs font-mono font-medium">AI</span>
              </span>
            </Link>

            <p className="text-secondary/80 text-sm leading-relaxed max-w-sm">
              Executive-grade interview intelligence. Benchmark resume credentials against target role expectations, diagnose skill gaps, and execute calibrated preparation roadmaps.
            </p>



            {/* Social Affordance Strip */}
            <div className="flex items-center gap-2 pt-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="studio-btn-icon w-9 h-9 !min-w-[36px] !min-h-[36px] text-white/50 hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Platform Navigation (Span 3) */}
          <div className="md:col-span-3 space-y-3.5">
            <h4 className="type-label text-white/60">Platform Architecture</h4>
            <ul className="space-y-2.5">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.url}
                    className="text-sm text-secondary hover:text-white transition-colors duration-160 inline-flex items-center gap-1 group"
                  >
                    <span>{link.name}</span>
                    <FiArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Security (Span 2) */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="type-label text-white/60">Security & Legal</h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    className="text-sm text-secondary hover:text-white transition-colors duration-160"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Dispatch (Span 2) */}
          <div className="md:col-span-2 space-y-3.5">
            <h4 className="type-label text-white/60">Direct Dispatch</h4>
            <div className="space-y-2">
              <a
                href="mailto:sahilsameer.dev18@gmail.com"
                className="text-xs text-secondary hover:text-accent flex items-center gap-2 transition-colors duration-160 truncate font-mono"
              >
              </a>
              <p className="text-[11px] text-white/40 leading-relaxed font-mono">
                Engineered for high-throughput career acceleration.
              </p>
            </div>
          </div>

        </div>

        {/* Full-width Luxury Specular Divider */}
        <div className="studio-divider mb-6" />

        {/* Bottom Metadata Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <p>© {new Date().getFullYear()} SkillBridge AI. Engineered with precision.</p>
          <p className="flex items-center gap-2">
            <span>Crafted by</span>
            <span className="text-white/80 font-semibold">Sahil Sameer</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


