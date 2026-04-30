import React from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Home = () => {
    const { user } = useAuth()

    return (
        <div className="animate-fade-in">

            {/* ── Hero ── */}
            <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden mesh-bg">
                {/* Decorative blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-8 animate-scale-in">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        🤖 Powered by Gemini AI
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
                        Master Your Next{' '}
                        <span className="text-gradient-cyan">
                            Technical Interview
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up delay-100">
                        Upload your resume, paste the job description — our AI analyzes your profile,
                        generates tailored questions, maps skill gaps, and builds a personalized
                        preparation roadmap. Land your dream job.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
                        {user ? (
                            <Link
                                to="/generate"
                                className="px-8 py-3.5 rounded-full text-base font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/25 glow-cyan active:scale-95"
                            >
                                ✨ Generate My Plan
                            </Link>
                        ) : (
                            <Link
                                to="/register"
                                className="px-8 py-3.5 rounded-full text-base font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/25 glow-cyan active:scale-95"
                            >
                                🚀 Get Started Free
                            </Link>
                        )}
                        <Link
                            to={user ? "/dashboard" : "/login"}
                            className="px-8 py-3.5 rounded-full text-base font-semibold glass border border-slate-700 text-slate-200 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300"
                        >
                            {user ? "View My Reports" : "Sign In"}
                        </Link>
                    </div>

                    <p className="mt-6 text-sm text-slate-500 animate-fade-in-up delay-300">
                        No credit card required · Ready in 30 seconds
                    </p>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-float">
                    <span className="text-xs tracking-widest uppercase">Scroll</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </section>

            {/* ── Stats Bar ── */}
            <div className="border-y border-slate-800/60 py-8 px-4">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { num: '10K+', label: 'Plans Generated' },
                        { num: '95%', label: 'Match Accuracy' },
                        { num: '50+', label: 'Questions Per Plan' },
                        { num: '7-Day', label: 'Prep Roadmap' },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <span className="text-3xl font-bold text-gradient-cyan">{stat.num}</span>
                            <span className="text-sm text-slate-500">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Features ── */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
                            Core Features
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gradient-cyan mb-4">
                            Everything You Need to Ace
                        </h2>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto">
                            A complete interview preparation suite powered by advanced AI.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: '🔍', title: 'Deep Resume Profiling', desc: 'Our AI intelligently extracts skills, experience, and achievements from your PDF resume and maps them directly against the target job requirements.' },
                            { icon: '🤖', title: 'AI-Generated Questions', desc: 'Get 10+ tailored technical and behavioral questions with model answers and interview intentions — specific to the exact role and your background.' },
                            { icon: '📈', title: 'Skill Gap Analysis', desc: 'Instantly see which skills you\'re missing for the role with severity ratings (Low, Medium, High) so you know exactly what to study.' },
                            { icon: '🗺️', title: '7-Day Prep Roadmap', desc: 'A day-by-day preparation plan with focused tasks, curated to close your specific skill gaps before the interview day.' },
                            { icon: '📄', title: 'AI Resume Generator', desc: 'Generate a polished, ATS-friendly PDF resume tailored to the target job — ready to download and send in under a minute.' },
                            { icon: '💾', title: 'Saved Report History', desc: 'All your generated plans are saved to your personal dashboard so you can track multiple job applications and revisit any report anytime.' },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className="group relative glass rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent pointer-events-none" />
                <div className="relative max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
                            How It Works
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            From Zero to{' '}
                            <span className="text-gradient-cyan">Interview Ready</span>{' '}
                            in 3 Steps
                        </h2>
                    </div>

                    <div className="flex flex-col gap-0">
                        {[
                            { num: '01', title: 'Upload & Describe', desc: 'Paste the target job description and upload your PDF resume (or write a quick self-description if you don\'t have one handy).' },
                            { num: '02', title: 'AI Analyzes Your Profile', desc: 'Our Gemini AI engine parses your resume, compares it to the JD, calculates a match score, and identifies gaps — all in about 30 seconds.' },
                            { num: '03', title: 'Study Your Custom Plan', desc: 'Review tailored questions with model answers, check the skill gap tags, follow the day-by-day roadmap, and download your optimized resume.' },
                        ].map((step, i) => (
                            <div key={i} className="flex gap-6 relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/20 shrink-0 z-10">
                                        {step.num}
                                    </div>
                                    {i < 2 && <div className="w-0.5 h-16 bg-gradient-to-b from-purple-500/50 to-transparent mt-2" />}
                                </div>
                                <div className="pb-12 pt-2">
                                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Who It's For ── */}
            <section className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
                            Who Is This For?
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Built for Every{' '}
                            <span className="text-gradient-cyan">Stage of Your Journey</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { emoji: '🎓', title: 'Fresh Graduates', desc: 'Crack your first tech role with targeted prep even if you don\'t have a polished resume yet.' },
                            { emoji: '🏢', title: 'Career Switchers', desc: 'Transition into a new tech domain with a clear map of the gaps you need to close.' },
                            { emoji: '⚡', title: 'Senior Engineers', desc: 'Prepare for MAANG-level system design and behavioral rounds with senior-specific questions.' },
                            { emoji: '🌍', title: 'International Applicants', desc: 'Align your profile with local market expectations and language used in the JD.' },
                        ].map((card, i) => (
                            <div key={i} className="glass rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 group">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {card.emoji}
                                </div>
                                <h4 className="font-semibold text-white mb-2">{card.title}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="relative glass rounded-3xl p-12 overflow-hidden gradient-border">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10">
                            <h2 className="text-4xl font-bold text-white mb-4">Ready to Get the Job?</h2>
                            <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
                                Join thousands of candidates who used SkillBridge AI to walk into interviews with full confidence.
                            </p>
                            <Link
                                to={user ? "/generate" : "/register"}
                                className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-lg font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-2xl shadow-purple-500/30 glow-cyan active:scale-95"
                            >
                                {user ? "✨ Generate New Plan" : "🚀 Start For Free"}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-slate-800/60 py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">S</div>
                            <span className="text-lg font-bold text-gradient-cyan">SkillBridge AI</span>
                        </div>
                        <p className="text-slate-500 text-sm">AI-powered interview preparation for the modern job seeker.</p>
                        <div className="flex items-center gap-6 text-sm text-slate-500">
                            <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                            <Link to="/generate" className="hover:text-cyan-400 transition-colors">New Plan</Link>
                            <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
                            {!user && <Link to="/register" className="hover:text-cyan-400 transition-colors">Register</Link>}
                        </div>
                    </div>
                    <div className="border-t border-slate-800/60 pt-6 text-center">
                        <p className="text-slate-600 text-sm">© 2026 SkillBridge AI. All rights reserved.</p>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default Home
