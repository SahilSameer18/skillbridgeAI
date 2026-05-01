import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

const Footer = () => {
    const { user } = useAuth();

    return (
        <footer className="relative mt-auto border-t border-white/5 overflow-hidden">
            {/* Gradient top line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            {/* Subtle mesh background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 60% 50% at 10% 0%, rgba(6,182,212,0.04) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 90% 0%, rgba(168,85,247,0.04) 0%, transparent 70%)',
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
                {/* Main grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
                                S
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                SkillBridge AI
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            The AI-powered interview prep platform that turns your resume into a personalised
                            study plan — so you walk into every interview with full confidence.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                            Product
                        </p>
                        <ul className="space-y-3">
                            {[
                                { label: 'Home', to: '/' },
                                { label: 'New Plan', to: '/generate' },
                                { label: 'Dashboard', to: '/dashboard' },
                                ...(!user ? [{ label: 'Register', to: '/register' }, { label: 'Login', to: '/login' }] : []),
                            ].map((link) => (
                                <li key={link.to}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-cyan-400 transition-all duration-300" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* What you get */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                            Features
                        </p>
                        <ul className="space-y-3">
                            {[
                                'AI Question Generation',
                                'Skill Gap Analysis',
                                '10-Day Roadmap',
                                'Resume PDF Export',
                                'Report History',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                                    <svg className="w-3.5 h-3.5 text-cyan-500/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Contact Me / Socials */}
                    <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                            Contact Me
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                            <a href="#insta" className="w-9 h-9 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/></svg>
                            </a>
                            <a href="https://github.com/SahilSameer18" className="w-9 h-9 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </a>
                            <a href="https://www.linkedin.com/in/sahil-sameer-siddique/" className="w-9 h-9 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            </a>
                        </div>
                        <a href="mailto:sahilsameer.dev18@gmail.com" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Sahil Sameer
                        </a>
                    </div>

                </div>

                {/* Divider */}
                <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-600 text-xs">
                        © {new Date().getFullYear()} SkillBridge AI. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;