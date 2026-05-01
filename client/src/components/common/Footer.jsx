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
                                '7-Day Roadmap',
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
