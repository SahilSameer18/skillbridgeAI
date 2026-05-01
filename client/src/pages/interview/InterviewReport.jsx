import React, { useState, useEffect } from 'react'
import { useInterview } from '../../hooks/useInterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
    {
        id: 'technical', label: 'Technical',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>)
    },
    {
        id: 'behavioral', label: 'Behavioral',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>)
    },
    {
        id: 'roadmap', label: 'Roadmap',
        icon: (<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>)
    },
]

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-600 animate-fade-in-up"
            style={{ background: 'rgba(10,18,35,0.7)', border: '1px solid rgba(51,65,85,0.5)' }}>
            <button className="w-full flex items-start gap-4 p-5 text-left" onClick={() => setOpen(o => !o)}>
                <span className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-cyan-400"
                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                    Q{index + 1}
                </span>
                <p className="flex-1 text-sm font-medium text-slate-200 leading-relaxed pt-1">{item.question}</p>
                <span className={`shrink-0 mt-1.5 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </button>
            {open && (
                <div className="px-5 pb-5 pt-0 space-y-4 border-t border-slate-800/60 animate-slide-up">
                    <div className="pt-4">
                        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 text-purple-400"
                            style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                            💡 Intention
                        </span>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.intention}</p>
                    </div>
                    <div>
                        <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 text-emerald-400"
                            style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                            ✅ Model Answer
                        </span>
                        <p className="text-slate-400 text-sm leading-relaxed">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day, index }) => (
    <div className="flex gap-5 animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
        <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)' }}>
                {day.day}
            </div>
            {index < 6 && <div className="w-px flex-1 mt-2 bg-gradient-to-b from-purple-500/30 to-transparent min-h-8" />}
        </div>
        <div className="pb-8 flex-1">
            <h3 className="font-semibold text-white text-sm mb-3">{day.focus}</h3>
            <ul className="space-y-2">
                {day.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-400">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)' }} />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    </div>
)

/* ── Score + Skill Gap Panel (reused in sidebar & mobile strip) ── */
const ScorePanel = ({ report, scoreColor, scoreLabel, circumference, progressOffset, compact = false }) => (
    <div className={`rounded-2xl p-5 text-center ${compact ? 'flex items-center gap-4 text-left' : ''}`}
        style={{ background: 'rgba(10,18,35,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className={`relative inline-flex items-center justify-center ${compact ? 'shrink-0' : 'mb-3'}`}>
            <svg width={compact ? 64 : 92} height={compact ? 64 : 92} className="-rotate-90">
                <circle r={compact ? 28 : 38} cx={compact ? 32 : 46} cy={compact ? 32 : 46}
                    fill="none" stroke="rgba(51,65,85,0.6)" strokeWidth={compact ? 5 : 6} />
                <circle r={compact ? 28 : 38} cx={compact ? 32 : 46} cy={compact ? 32 : 46}
                    fill="none" stroke={scoreColor}
                    strokeWidth={compact ? 5 : 6} strokeLinecap="round"
                    strokeDasharray={compact ? 2 * Math.PI * 28 : circumference}
                    strokeDashoffset={compact
                        ? 2 * Math.PI * 28 - (report.matchScore / 100) * 2 * Math.PI * 28
                        : progressOffset}
                    style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-bold text-white ${compact ? 'text-base' : 'text-2xl'}`}>{report.matchScore}</span>
                {!compact && <span className="text-xs text-slate-500">%</span>}
            </div>
        </div>
        <div>
            {!compact && <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Match Score</p>}
            {compact && <p className="text-xs text-slate-500 mb-0.5">Match Score</p>}
            <p className="text-xs font-medium" style={{ color: scoreColor }}>{scoreLabel}</p>
        </div>
    </div>
)

const SkillGapsPanel = ({ report }) => {
    const styles = {
        high: 'bg-red-500/10 text-red-400 border-red-500/20',
        medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    }
    return (
        <div className="rounded-2xl p-5" style={{ background: 'rgba(10,18,35,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Skill Gaps</p>
            <div className="flex flex-wrap gap-2">
                {report.skillGaps.map((gap, i) => (
                    <span key={i} className={`text-xs px-2 py-1 rounded-lg border font-medium ${styles[gap.severity?.toLowerCase()] || styles.low}`}>
                        {gap.skill}
                    </span>
                ))}
            </div>
        </div>
    )
}

const InterviewReport = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()
    const radius = 38
    const circumference = 2 * Math.PI * radius
    const [progressOffset, setProgressOffset] = useState(circumference)

    useEffect(() => {
        if (interviewId) getReportById(interviewId)
    }, [interviewId])

    useEffect(() => {
        if (report) {
            const finalOffset = circumference - (report.matchScore / 100) * circumference
            setTimeout(() => setProgressOffset(finalOffset), 100)
        }
    }, [report, circumference])

    if (loading || !report) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <div className="w-12 h-12 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                    <p className="text-slate-400">Loading your interview plan...</p>
                </div>
            </div>
        )
    }

    const scoreColor = report.matchScore >= 80 ? '#34d399' : report.matchScore >= 60 ? '#fbbf24' : '#f87171'
    const scoreLabel = report.matchScore >= 80 ? 'Strong match' : report.matchScore >= 60 ? 'Average match' : 'Low match'

    return (
        <div className="animate-fade-in">

            {/* ── Mobile: compact score strip + tab nav ── */}
            <div className="lg:hidden mb-5 space-y-3">
                {/* Score + skill gaps row — always visible on mobile */}
                <div className="grid grid-cols-2 gap-3">
                    <ScorePanel
                        report={report}
                        scoreColor={scoreColor}
                        scoreLabel={scoreLabel}
                        circumference={circumference}
                        progressOffset={progressOffset}
                        compact
                    />
                    <div className="rounded-2xl p-4" style={{ background: 'rgba(10,18,35,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Skill Gaps</p>
                        <div className="flex flex-wrap gap-1.5">
                            {(() => {
                                const styles = { high: 'bg-red-500/10 text-red-400 border-red-500/20', medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20', low: 'bg-blue-500/10 text-blue-400 border-blue-500/20' }
                                return report.skillGaps.slice(0, 4).map((gap, i) => (
                                    <span key={i} className={`text-xs px-2 py-0.5 rounded-lg border font-medium ${styles[gap.severity?.toLowerCase()] || styles.low}`}>{gap.skill}</span>
                                ))
                            })()}
                            {report.skillGaps.length > 4 && <span className="text-xs text-slate-600">+{report.skillGaps.length - 4} more</span>}
                        </div>
                    </div>
                </div>

                {/* Mobile tab nav */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {NAV_ITEMS.map(item => (
                        <button key={item.id} onClick={() => setActiveNav(item.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeNav === item.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                            style={activeNav === item.id
                                ? { background: 'linear-gradient(135deg,rgba(6,182,212,0.2),rgba(168,85,247,0.2))', border: '1px solid rgba(6,182,212,0.3)' }
                                : { background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(51,65,85,0.5)' }}>
                            {item.icon}{item.label}
                        </button>
                    ))}
                    {/* Download on mobile tab row */}
                    <button onClick={() => getResumePdf(interviewId)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white whitespace-nowrap ml-auto shrink-0"
                        style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)' }}>
                        ✨ Download
                    </button>
                </div>
            </div>

            {/* ── Desktop 3-column layout ── */}
            <div className="flex gap-6">

                {/* Left sidebar: section nav — desktop only */}
                <aside className="hidden lg:flex flex-col gap-2 w-52 shrink-0">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 px-3">Sections</p>
                    {NAV_ITEMS.map(item => (
                        <button key={item.id} onClick={() => setActiveNav(item.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeNav === item.id ? 'text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900/50'}`}
                            style={activeNav === item.id
                                ? { background: 'linear-gradient(135deg,rgba(6,182,212,0.12),rgba(168,85,247,0.12))', border: '1px solid rgba(6,182,212,0.2)' }
                                : {}}>
                            <span className={activeNav === item.id ? 'text-cyan-400' : ''}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}

                    <div className="mt-4 pt-4 border-t border-slate-800/60">
                        <button onClick={() => getResumePdf(interviewId)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-95"
                            style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)', boxShadow: '0 4px 16px rgba(168,85,247,0.2)' }}>
                            <svg height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956Z" /></svg>
                            Download Resume
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-xl font-bold text-white">
                                {activeNav === 'technical' && 'Technical Questions'}
                                {activeNav === 'behavioral' && 'Behavioral Questions'}
                                {activeNav === 'roadmap' && 'Preparation Roadmap'}
                            </h2>
                            <p className="text-sm text-slate-500 mt-0.5">
                                {activeNav === 'technical' && `${report.technicalQuestions.length} questions`}
                                {activeNav === 'behavioral' && `${report.behavioralQuestions.length} questions`}
                                {activeNav === 'roadmap' && `${report.preparationPlan.length}-day plan`}
                            </p>
                        </div>
                    </div>

                    {activeNav === 'technical' && (
                        <div className="space-y-3">
                            {report.technicalQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
                        </div>
                    )}
                    {activeNav === 'behavioral' && (
                        <div className="space-y-3">
                            {report.behavioralQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
                        </div>
                    )}
                    {activeNav === 'roadmap' && (
                        <div className="pt-2">
                            {report.preparationPlan.map((day, i) => <RoadMapDay key={day.day} day={day} index={i} />)}
                        </div>
                    )}
                </main>

                {/* Right sidebar: Score + Skill Gaps — always on lg+ */}
                <aside className="hidden lg:flex flex-col gap-5 w-60 shrink-0">
                    {/* Score */}
                    <div className="rounded-2xl p-5 text-center"
                        style={{ background: 'rgba(10,18,35,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Match Score</p>
                        <div className="relative inline-flex items-center justify-center mb-3">
                            <svg width="92" height="92" className="-rotate-90">
                                <circle r={radius} cx="46" cy="46" fill="none" stroke="rgba(51,65,85,0.6)" strokeWidth="6" />
                                <circle r={radius} cx="46" cy="46" fill="none" stroke={scoreColor}
                                    strokeWidth="6" strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={progressOffset}
                                    style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold text-white">{report.matchScore}</span>
                                <span className="text-xs text-slate-500">%</span>
                            </div>
                        </div>
                        <p className="text-xs font-medium" style={{ color: scoreColor }}>{scoreLabel}</p>
                    </div>

                    {/* Skill Gaps */}
                    <SkillGapsPanel report={report} />
                </aside>

            </div>
        </div>
    )
}

export default InterviewReport
