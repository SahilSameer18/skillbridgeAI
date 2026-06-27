import React, { useState, useEffect } from 'react'
import { useInterview } from '../../hooks/useInterview.js'
import { useParams } from 'react-router'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical', icon: 'code' },
    { id: 'behavioral', label: 'Behavioral', icon: 'messages' },
    { id: 'skills', label: 'Skill Gaps', icon: 'target' },
    { id: 'roadmap', label: 'Roadmap', icon: 'map-2' },
]

const SEVERITY_STYLES = {
    high: 'bg-red-500/10 text-red-400 border border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
}

/* ── Tabler icon helper ── */
const Icon = ({ name, className = '' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16" height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
    >
        {name === 'code' && <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>}
        {name === 'messages' && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
        {name === 'map-2' && <polygon points="3 11 22 2 13 21 11 13 3 11" />}
        {name === 'target' && <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>}
        {name === 'chevron-down' && <polyline points="6 9 12 15 18 9" />}
        {name === 'download' && <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>}
        {name === 'sparkle' && <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956Z" fill="currentColor" stroke="none" />}
        {name === 'help-circle' && <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>}
        {name === 'calendar' && <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>}
        {name === 'chart-pie' && <><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></>}
        {name === 'file-text' && <><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /></>}
        {name === 'player-play' && <><circle cx="12" cy="12" r="9" /><path d="M10 9l5 3l-5 3z" /></>}
    </svg>
)

/* ── Stat Card (top bar) ── */
const StatCard = ({ icon, label, value, sub, iconClass }) => (
    <div className="flex items-center gap-3 rounded-xl p-4 bg-slate-900/60 border border-slate-800/60">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconClass}`}>
            <Icon name={icon} />
        </div>
        <div className="min-w-0">
            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
            <p className="text-lg font-semibold text-white leading-none">{value}</p>
            {sub && <p className="text-xs mt-0.5 truncate" style={{ color: 'inherit' }}>{sub}</p>}
        </div>
    </div>
)

/* ── Question accordion card ── */
const QuestionCard = ({ item, index, accentClass, bodyBg }) => {
    const [open, setOpen] = useState(false)
    return (
        <div
            className="rounded-xl overflow-hidden border border-slate-800/60 bg-slate-900/50 hover:border-slate-700/70 transition-colors duration-150"
        >
            <button
                className="w-full flex items-start gap-3 p-4 text-left"
                onClick={() => setOpen(o => !o)}
            >
                <span className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-semibold mt-0.5 ${accentClass}`}>
                    {index + 1}
                </span>
                <p className="flex-1 text-sm text-slate-200 leading-relaxed">{item.question}</p>
                <Icon
                    name="chevron-down"
                    className={`shrink-0 mt-1 text-slate-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-800/50">
                    <div className="pt-3">
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Intention</p>
                        <p className="text-sm text-slate-400 leading-relaxed bg-slate-800/40 rounded-lg px-3 py-2.5">
                            {item.intention}
                        </p>
                    </div>
                    <div>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Model answer</p>
                        <p className={`text-sm text-slate-300 leading-relaxed rounded-lg px-3 py-2.5 ${bodyBg}`}>
                            {item.answer}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ── Skill gap card — full width, no truncation, resources as labeled buttons ── */
const SkillGapCard = ({ gap }) => {
    const resources = gap.skillRef?.resources ?? []
    const severityKey = gap.severity?.toLowerCase()

    return (
        <div className="rounded-xl p-4 border border-slate-800/60 bg-slate-900/50 hover:border-slate-700/70 transition-colors duration-150">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-slate-200 leading-snug">{gap.skill}</p>
                <span
                    className={`shrink-0 whitespace-nowrap text-[11px] px-2 py-0.5 rounded-md font-medium capitalize ${SEVERITY_STYLES[severityKey] ?? SEVERITY_STYLES.low}`}
                >
                    {gap.severity ?? 'low'}
                </span>
            </div>

            {resources.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                    {resources.map((resource) => (
                        <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-cyan-400 bg-slate-800/50 hover:bg-cyan-500/10 border border-slate-700/50 hover:border-cyan-500/30 rounded-lg px-2.5 py-1.5 transition-colors"
                        >
                            <Icon name={resource.type === 'VIDEO' ? 'player-play' : 'file-text'} />
                            {resource.type === 'VIDEO' ? 'Video tutorial' : 'Documentation'}
                        </a>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-slate-600 mt-2.5">No curated resources yet for this skill</p>
            )}
        </div>
    )
}

/* ── Roadmap day row ── */
const RoadmapDay = ({ day, index, total }) => (
    <div className="flex gap-4">
        <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 bg-gradient-to-br from-cyan-500 to-violet-500">
                {day.day}
            </div>
            {index < total - 1 && (
                <div className="w-px flex-1 mt-2 bg-slate-800 min-h-6" />
            )}
        </div>
        <div className="pb-6 flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white mb-2 mt-1">{day.focus}</h3>
            <ul className="space-y-1.5">
                {day.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="mt-2 w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    </div>
)

/* ── Circular score ring ── */
const ScoreRing = ({ score, color, size = 80, strokeWidth = 6 }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const [offset, setOffset] = useState(circumference)

    useEffect(() => {
        const t = setTimeout(() => setOffset(circumference - (score / 100) * circumference), 120)
        return () => clearTimeout(t)
    }, [score, circumference])

    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle r={radius} cx={size / 2} cy={size / 2} fill="none" stroke="rgba(51,65,85,0.5)" strokeWidth={strokeWidth} />
            <circle
                r={radius} cx={size / 2} cy={size / 2}
                fill="none" stroke={color}
                strokeWidth={strokeWidth} strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
            />
        </svg>
    )
}

/* ── Main component ── */
const InterviewReport = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) getReportById(interviewId)
    }, [interviewId])

    if (loading || !report) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                    <p className="text-sm text-slate-500">Loading your interview plan...</p>
                </div>
            </div>
        )
    }

    const skillGaps = report.skillGaps ?? []
    const scoreColor = report.matchScore >= 80 ? '#34d399' : report.matchScore >= 60 ? '#fbbf24' : '#f87171'
    const scoreLabel = report.matchScore >= 80 ? 'Strong match' : report.matchScore >= 60 ? 'Average match' : 'Low match'
    const scoreLabelColor = report.matchScore >= 80 ? 'text-emerald-400' : report.matchScore >= 60 ? 'text-amber-400' : 'text-red-400'

    return (
        <div className="animate-fade-in space-y-5">

            {/* ── Page header ── */}
            <div>
                <h1 className="text-xl font-bold text-white">Interview preparation</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                    {report.jobTitle ?? 'Role'} · {report.company ?? 'Company'}
                </p>
            </div>

            {/* ── Top stat bar ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatCard
                    icon="chart-pie"
                    label="Match score"
                    value={`${report.matchScore}%`}
                    sub={scoreLabel}
                    iconClass="bg-emerald-500/10 text-emerald-400"
                />
                <StatCard
                    icon="help-circle"
                    label="Questions prepared"
                    value={report.technicalQuestions.length + report.behavioralQuestions.length}
                    sub={`${report.technicalQuestions.length} technical · ${report.behavioralQuestions.length} behavioral`}
                    iconClass="bg-cyan-500/10 text-cyan-400"
                />
                <StatCard
                    icon="calendar"
                    label="Prep roadmap"
                    value={`${report.preparationPlan.length} days`}
                    sub="Structured plan"
                    iconClass="bg-violet-500/10 text-violet-400"
                />
            </div>

            {/* ── Body: main + sidebar ── */}
            <div className="flex gap-5 items-start">

                {/* Main content */}
                <div className="flex-1 min-w-0">

                    {/* Tab row — drives both this row and the mobile footer bar below from one source */}
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-px no-scrollbar">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                                    activeNav === item.id
                                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                                        : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-800'
                                }`}
                            >
                                <Icon name={item.icon} />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Section heading */}
                    <div className="flex items-baseline justify-between mb-3">
                        <h2 className="text-base font-semibold text-white">
                            {activeNav === 'technical' && 'Technical questions'}
                            {activeNav === 'behavioral' && 'Behavioral questions'}
                            {activeNav === 'skills' && 'Skill gaps'}
                            {activeNav === 'roadmap' && 'Preparation roadmap'}
                        </h2>
                        <span className="text-xs text-slate-600">
                            {activeNav === 'technical' && `${report.technicalQuestions.length} questions`}
                            {activeNav === 'behavioral' && `${report.behavioralQuestions.length} questions`}
                            {activeNav === 'skills' && `${skillGaps.length} identified`}
                            {activeNav === 'roadmap' && `${report.preparationPlan.length}-day plan`}
                        </span>
                    </div>

                    {/* Technical */}
                    {activeNav === 'technical' && (
                        <div className="space-y-2">
                            {report.technicalQuestions.map((q, i) => (
                                <QuestionCard
                                    key={i}
                                    item={q}
                                    index={i}
                                    accentClass="bg-cyan-500/10 text-cyan-400"
                                    bodyBg="bg-cyan-500/5 border border-cyan-500/10"
                                />
                            ))}
                        </div>
                    )}

                    {/* Behavioral */}
                    {activeNav === 'behavioral' && (
                        <div className="space-y-2">
                            {report.behavioralQuestions.map((q, i) => (
                                <QuestionCard
                                    key={i}
                                    item={q}
                                    index={i}
                                    accentClass="bg-violet-500/10 text-violet-400"
                                    bodyBg="bg-violet-500/5 border border-violet-500/10"
                                />
                            ))}
                        </div>
                    )}

                    {/* Skill gaps — full width on every screen size, no truncation */}
                    {activeNav === 'skills' && (
                        <div className="space-y-2">
                            {skillGaps.length > 0 ? (
                                skillGaps.map((gap, i) => (
                                    <SkillGapCard key={i} gap={gap} />
                                ))
                            ) : (
                                <div className="rounded-xl p-6 border border-slate-800/60 bg-slate-900/50 text-center">
                                    <p className="text-sm text-slate-500">No skill gaps identified for this report.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Roadmap */}
                    {activeNav === 'roadmap' && (
                        <div className="pt-1">
                            {report.preparationPlan.map((day, i) => (
                                <RoadmapDay
                                    key={day.day}
                                    day={day}
                                    index={i}
                                    total={report.preparationPlan.length}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right sidebar — desktop only. Skill gaps now live in the tab above, not duplicated here. */}
                <aside className="hidden lg:flex flex-col gap-4 w-56 shrink-0">

                    {/* Score card */}
                    <div className="rounded-xl p-4 bg-slate-900/60 border border-slate-800/60">
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Match score</p>
                        <div className="flex items-center gap-3 mb-3">
                            <ScoreRing score={report.matchScore} color={scoreColor} size={72} strokeWidth={6} />
                            <div>
                                <p className="text-2xl font-bold text-white leading-none">{report.matchScore}<span className="text-sm font-normal text-slate-500">%</span></p>
                                <p className={`text-xs font-medium mt-1 ${scoreLabelColor}`}>{scoreLabel}</p>
                            </div>
                        </div>
                        <div className="h-1 rounded-full bg-slate-800">
                            <div
                                className="h-full rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${report.matchScore}%`, backgroundColor: scoreColor }}
                            />
                        </div>
                    </div>

                    {/* Quick skill-gap summary — links into the tab, doesn't duplicate its content */}
                    <button
                        onClick={() => setActiveNav('skills')}
                        className={`text-left rounded-xl p-4 border transition-colors duration-150 ${
                            activeNav === 'skills'
                                ? 'bg-cyan-500/10 border-cyan-500/30'
                                : 'bg-slate-900/60 border-slate-800/60 hover:border-slate-700/70'
                        }`}
                    >
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Skill gaps</p>
                        <p className="text-2xl font-bold text-white leading-none">{skillGaps.length}</p>
                        <p className="text-xs text-slate-500 mt-1">View details &amp; resources →</p>
                    </button>

                    {/* Download */}
                    <button
                        onClick={() => getResumePdf(interviewId)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-150 active:scale-95 hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)', boxShadow: '0 4px 14px rgba(168,85,247,0.25)' }}
                    >
                        <Icon name="sparkle" />
                        Download resume
                    </button>
                </aside>
            </div>

            {/* ── Mobile footer bar ── */}
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-20 px-4 pb-5 pt-3"
                style={{ background: 'linear-gradient(to top, rgba(2,6,23,1) 70%, transparent)' }}>
                <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-xl bg-slate-900/80 border border-slate-800/80 flex divide-x divide-slate-800">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                                    activeNav === item.id ? 'text-cyan-400' : 'text-slate-600'
                                }`}
                            >
                                <Icon name={item.icon} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => getResumePdf(interviewId)}
                        className="h-11 w-11 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)' }}
                        aria-label="Download resume"
                    >
                        <Icon name="download" />
                    </button>
                </div>
            </div>

            {/* Bottom padding so mobile footer doesn't overlap content */}
            <div className="lg:hidden h-20" />
        </div>
    )
}

export default InterviewReport


