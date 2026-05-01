import React from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const features = [
    { icon: '🔍', title: 'Deep Resume Profiling', desc: 'AI extracts skills and maps them against target job requirements instantly.' },
    { icon: '🤖', title: 'AI-Generated Questions', desc: '10+ tailored technical & behavioral questions with model answers specific to your role.' },
    { icon: '📈', title: 'Skill Gap Analysis', desc: 'See exactly which skills you\'re missing with severity ratings — High, Medium, Low.' },
    { icon: '🗺️', title: '7-Day Prep Roadmap', desc: 'Day-by-day preparation tasks to close your skill gaps before the interview.' },
    { icon: '📄', title: 'AI Resume Generator', desc: 'Download a polished ATS-friendly PDF resume tailored to the job in under a minute.' },
    { icon: '💾', title: 'Report History', desc: 'All plans saved to your dashboard. Track multiple applications and revisit anytime.' },
]

const steps = [
    { num: '01', icon: '📤', title: 'Upload & Describe', desc: 'Paste the job description and upload your PDF resume or write a quick self-description.' },
    { num: '02', icon: '⚡', title: 'AI Analyzes', desc: 'Gemini AI parses your resume, compares it to the JD, and calculates a match score in ~30s.' },
    { num: '03', icon: '🎯', title: 'Study Your Plan', desc: 'Review tailored questions, skill gap tags, and follow the roadmap. Download your resume.' },
]

const personas = [
    { emoji: '🎓', title: 'Fresh Graduates', desc: 'Crack your first tech role with targeted prep even without a polished resume.', color: 'from-cyan-500/10 to-cyan-500/5', border: 'border-cyan-500/20' },
    { emoji: '🏢', title: 'Career Switchers', desc: 'Transition domains with a clear map of the gaps you need to close.', color: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20' },
    { emoji: '⚡', title: 'Senior Engineers', desc: 'Prep for MAANG-level system design and behavioral rounds.', color: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/20' },
    { emoji: '🌍', title: 'International Applicants', desc: 'Align your profile with local market expectations and JD language.', color: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20' },
]

const Home = () => {
    const { user } = useAuth()

    return (
        <div className="animate-fade-in -mx-4 sm:-mx-6 lg:-mx-8">

            {/* ── HERO ── */}
            <section className="relative min-h-[92vh] flex items-center overflow-hidden"
                style={{
                    background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(6,182,212,0.12) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(168,85,247,0.10) 0%, transparent 70%), #030712'
                }}>
                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                        backgroundSize: '64px 64px'
                    }} />

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                        {/* Left: Text */}
                        <div className="flex-1 text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8 animate-scale-in"
                                style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.25)', color: '#67e8f9' }}>
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                Powered by AI · Free to start
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6 animate-fade-in-up">
                                Ace Every
                                <br />
                                <span className="text-gradient-cyan">Technical</span>
                                <br />
                                Interview
                            </h1>

                            <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 animate-fade-in-up delay-100">
                                Upload your resume + job description. Our AI builds a personalised question bank,
                                identifies skill gaps, and gives you a 7-day prep roadmap — in under a minute.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up delay-200">
                                <Link
                                    to={user ? '/generate' : '/register'}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 active:scale-95 glow-cyan"
                                    style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7)', boxShadow: '0 8px 32px rgba(168,85,247,0.25)' }}
                                >
                                    {user ? '✨ Generate My Plan' : '🚀 Start For Free'}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <Link
                                    to={user ? '/dashboard' : '/login'}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-slate-300 transition-all duration-300 hover:text-white hover:border-cyan-500/50"
                                    style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}
                                >
                                    {user ? 'View Reports' : 'Sign In'}
                                </Link>
                            </div>

                            <p className="mt-6 text-xs text-slate-600 animate-fade-in-up delay-300">
                                No credit card · Ready in 30 seconds
                            </p>
                        </div>

                        {/* Right: Visual card */}
                        <div className="flex-1 w-full max-w-md lg:max-w-none animate-fade-in-up delay-200">
                            <div className="relative rounded-3xl overflow-hidden p-6"
                                style={{ background: 'rgba(10,18,35,0.85)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
                                {/* Fake UI top bar */}
                                <div className="flex items-center gap-1.5 mb-5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                                    <div className="ml-3 flex-1 h-5 rounded-md" style={{ background: 'rgba(255,255,255,0.05)' }} />
                                </div>

                                {/* Match score ring */}
                                <div className="flex items-center gap-5 mb-5 p-4 rounded-2xl" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.12)' }}>
                                    <div className="relative w-16 h-16 shrink-0">
                                        <svg width="64" height="64" className="-rotate-90">
                                            <circle r="28" cx="32" cy="32" fill="none" stroke="rgba(51,65,85,0.6)" strokeWidth="5" />
                                            <circle r="28" cx="32" cy="32" fill="none" stroke="#34d399" strokeWidth="5" strokeLinecap="round"
                                                strokeDasharray={2 * Math.PI * 28}
                                                strokeDashoffset={2 * Math.PI * 28 * 0.18}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-sm font-bold text-white">82%</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">Match Score</p>
                                        <p className="text-base font-semibold text-emerald-400">Strong Match</p>
                                        <p className="text-xs text-slate-600 mt-0.5">Frontend Engineer · Google</p>
                                    </div>
                                </div>

                                {/* Skill gaps preview */}
                                <div className="mb-5">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Skill Gaps Detected</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['System Design', 'GraphQL', 'Docker'].map((s, i) => (
                                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg font-medium text-red-400" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{s}</span>
                                        ))}
                                        {['TypeScript', 'Redis'].map((s, i) => (
                                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg font-medium text-amber-400" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Question preview */}
                                <div className="rounded-xl p-4" style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.12)' }}>
                                    <p className="text-xs text-purple-400 font-semibold mb-2">Q3 · Technical</p>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        "Explain how you would architect a scalable real-time notification system for 1M+ concurrent users..."
                                    </p>
                                </div>

                                {/* Animated dots at bottom */}
                                <div className="flex items-center justify-center gap-1.5 mt-5">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full"
                                            style={{ background: i === 1 ? '#06b6d4' : 'rgba(71,85,105,0.6)' }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <div className="border-y border-slate-800/60 py-8 px-4"
                style={{ background: 'rgba(10,18,35,0.5)' }}>
                <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 md:gap-0 md:grid md:grid-cols-4">
                    {[
                        { num: '10K+', label: 'Plans Generated', icon: '📋' },
                        { num: '95%', label: 'Match Accuracy', icon: '🎯' },
                        { num: '50+', label: 'Questions Per Plan', icon: '❓' },
                        { num: '7-Day', label: 'Prep Roadmap', icon: '🗓️' },
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 px-6 border-r border-slate-800/50 last:border-r-0">
                            <span className="text-2xl mb-1">{s.icon}</span>
                            <span className="text-3xl font-bold text-gradient-cyan">{s.num}</span>
                            <span className="text-xs text-slate-500">{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FEATURES ── */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
                            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#67e8f9' }}>
                            Core Features
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Everything to <span className="text-gradient-cyan">Ace the Interview</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">
                            A complete prep suite powered by advanced AI — from analysis to final PDF.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((f, i) => (
                            <div key={i}
                                className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-default"
                                style={{ background: 'rgba(10,18,35,0.7)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
                                {/* Hover border glow */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                    style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.05),rgba(168,85,247,0.05))', border: '1px solid rgba(6,182,212,0.2)' }} />

                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300"
                                        style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.15)' }}>
                                        {f.icon}
                                    </div>
                                    {/* Number tag */}
                                    <span className="absolute top-5 right-5 text-xs font-bold text-slate-700">
                                        0{i + 1}
                                    </span>
                                    <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
                style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(168,85,247,0.05) 0%, transparent 70%)' }}>
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
                            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: '#c084fc' }}>
                            How It Works
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Zero to <span className="text-gradient-cyan">Interview Ready</span> in 3 Steps
                        </h2>
                    </div>

                    {/* Steps — horizontal on desktop, vertical on mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connector line (desktop only) */}
                        <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.4), rgba(168,85,247,0.4), transparent)' }} />

                        {steps.map((step, i) => (
                            <div key={i} className="relative flex flex-col items-center text-center md:items-center">
                                <div className="relative z-10 w-20 h-20 rounded-2xl flex flex-col items-center justify-center mb-5 shadow-xl"
                                    style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.15),rgba(168,85,247,0.15))', border: '1px solid rgba(6,182,212,0.25)' }}>
                                    <span className="text-2xl mb-0.5">{step.icon}</span>
                                    <span className="text-xs font-bold text-slate-500">{step.num}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHO IT'S FOR ── */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
                            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#67e8f9' }}>
                            Who Is This For?
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Built for Every <span className="text-gradient-cyan">Stage of Your Journey</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {personas.map((p, i) => (
                            <div key={i}
                                className={`group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 bg-gradient-to-b ${p.color} ${p.border} border`}>
                                <div className="text-4xl mb-4">{p.emoji}</div>
                                <h4 className="font-bold text-white mb-2">{p.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
                        style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.08),rgba(168,85,247,0.08))', border: '1px solid rgba(6,182,212,0.2)' }}>
                        <div className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
                            style={{ background: 'rgba(168,85,247,0.1)' }} />
                        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                            style={{ background: 'rgba(6,182,212,0.1)' }} />
                        <div className="relative z-10">
                            <span className="text-5xl mb-6 block">🚀</span>
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                                Ready to Get the Job?
                            </h2>
                            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                                Join thousands of candidates who used SkillBridge AI to walk into interviews with full confidence.
                            </p>
                            <Link
                                to={user ? '/generate' : '/register'}
                                className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-lg font-bold text-white transition-all duration-300 active:scale-95 glow-cyan"
                                style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)', boxShadow: '0 12px 40px rgba(168,85,247,0.3)' }}>
                                {user ? '✨ Generate New Plan' : '🚀 Start For Free'}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default Home
