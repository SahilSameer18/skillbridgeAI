import React, { useState, useEffect, useCallback } from 'react'
import { useInterview } from '../../hooks/useInterview.js'
import { useParams } from 'react-router'
import Skeleton from '../../components/ui/Skeleton'
import { exportReportPdf } from '../../utils/exportReportPdf.js'

const NAV_ITEMS = [
    { id: 'technical',  label: 'Technical Q&A',   short: 'Technical',  icon: 'code'     },
    { id: 'behavioral', label: 'Behavioral Q&A',  short: 'Behavioral', icon: 'messages' },
    { id: 'skills',     label: 'Skill Gaps',       short: 'Skills',     icon: 'target'   },
    { id: 'roadmap',    label: '10-Day Plan',      short: 'Roadmap',    icon: 'map-2'    },
]

const SEVERITY_STYLES = {
    high:     'studio-badge-coral',
    critical: 'studio-badge-coral',
    medium:   'studio-badge-amber',
    low:      'studio-badge-neutral',
}

/* ─────────────────────────────────────────
   SVG Icon Component
───────────────────────────────────────── */
const Icon = ({ name, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" className={className} aria-hidden="true">
        {name === 'code'         && <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>}
        {name === 'messages'     && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
        {name === 'map-2'        && <polygon points="3 11 22 2 13 21 11 13 3 11" />}
        {name === 'target'       && <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>}
        {name === 'chevron-down' && <polyline points="6 9 12 15 18 9" />}
        {name === 'download'     && <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>}
        {name === 'sparkle'      && <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="currentColor" stroke="none" />}
        {name === 'help-circle'  && <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>}
        {name === 'copy'         && <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>}
        {name === 'check'        && <polyline points="20 6 9 17 4 12" />}
    </svg>
)

const YouTubeLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="currentColor" stroke="none" className="text-red-500 shrink-0">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
        <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
)

const DocsLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round" className="text-accent shrink-0">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
)

/* ─────────────────────────────────────────
   Score Count-Up Hook
───────────────────────────────────────── */
const useCountUp = (target, duration = 1000) => {
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (!target) return
        let startTime = null
        let animationFrameId
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step)
            }
        }
        animationFrameId = requestAnimationFrame(step)
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId)
        }
    }, [target, duration])
    return count
}

/* ─────────────────────────────────────────
   Score Widget Component (Animated Gauge + Counter)
───────────────────────────────────────── */
const ScoreWidget = React.memo(({ score, size = 80, strokeWidth = 6 }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const [offset, setOffset] = useState(circumference)
    const displayScore = useCountUp(score, 1100)

    useEffect(() => {
        const t = setTimeout(() => setOffset(circumference - (score / 100) * circumference), 100)
        return () => clearTimeout(t)
    }, [score, circumference])

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                className="-rotate-90"
                role="img"
                aria-label={`Match score: ${displayScore}%`}
            >
                <circle
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth={strokeWidth}
                />
                <circle
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    fill="none"
                    stroke="url(#reportGrad)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)' }}
                />
                <defs>
                    <linearGradient id="reportGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FF6662" />
                        <stop offset="100%" stopColor="#FE9A00" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-xl font-extrabold font-mono text-primary leading-none tracking-tight">
                    {displayScore}%
                </span>
            </div>
        </div>
    )
})

/* ─────────────────────────────────────────
   Question Accordion Card (Memoized)
───────────────────────────────────────── */
const QuestionCard = React.memo(({ item, index, badgeColor = 'bg-accent/15 text-accent border border-accent/25' }) => {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const contentId = `qa-content-${index}`

    const handleCopy = (e) => {
        e.stopPropagation()
        if (!item.answer) return
        navigator.clipboard.writeText(item.answer)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className={`studio-card rounded-2xl transition-all duration-200 overflow-hidden ${
            open ? 'border-accent/40 shadow-lg' : 'hover:border-slate-300'
        }`}>
            <button
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                className="w-full flex items-start gap-3.5 p-4 sm:p-5 text-left focus:outline-none cursor-pointer group/q"
                onClick={() => setOpen(o => !o)}
            >
                <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center type-micro shadow-inner ${badgeColor}`}>
                    {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                    <p className={`text-sm sm:text-base font-semibold leading-snug transition-colors duration-200 ${
                        open ? 'text-primary' : 'text-primary/90 group-hover/q:text-primary'
                    }`}>
                        {item.question}
                    </p>
                </div>
                <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 border border-border text-secondary transition-transform duration-300 ${
                    open ? 'rotate-180 text-primary border-slate-300' : 'group-hover/q:text-primary group-hover/q:border-slate-300'
                }`}>
                    <Icon name="chevron-down" className="w-3.5 h-3.5" />
                </div>
            </button>

            <div
                id={contentId}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-3.5 border-t border-border pt-4">
                        {/* Intention Section */}
                        {item.intention && (
                            <div className="studio-well rounded-xl p-3.5 border border-border">
                                <p className="type-micro text-accent mb-1.5 flex items-center gap-1.5 font-mono">
                                    <Icon name="target" className="w-3 h-3 text-accent" /> Why Interviewers Ask This
                                </p>
                                <p className="type-body text-secondary leading-relaxed font-sans">
                                    {item.intention}
                                </p>
                            </div>
                        )}

                        {/* Model Answer Section */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                                <p className="type-micro text-secondary flex items-center gap-1.5 font-mono">
                                    <Icon name="sparkle" className="w-3 h-3 text-amber" /> Model Answer Framework
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    aria-label="Copy model answer"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg type-micro text-secondary hover:text-primary bg-slate-100 border border-border hover:border-slate-300 transition-colors cursor-pointer"
                                >
                                    {copied ? (
                                        <>
                                            <Icon name="check" className="w-3 h-3 text-emerald-600" />
                                            <span className="text-emerald-600 font-semibold">Copied</span>
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="copy" className="w-3 h-3" />
                                            <span>Copy Answer</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="type-body text-primary leading-relaxed rounded-xl p-4 studio-well border border-border font-sans">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

/* ─────────────────────────────────────────
   Skill Gap Card (Memoized)
───────────────────────────────────────── */
const SkillGapCard = React.memo(({ gap }) => {
    const resources = gap.skillRef?.resources ?? []
    const severityKey = gap.severity?.toLowerCase() || 'low'

    return (
        <div className="studio-card rounded-2xl p-4 sm:p-5 transition-colors duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                    <span className="text-sm sm:text-base font-bold text-primary tracking-tight">{gap.skill}</span>
                </div>
                <span className={`self-start sm:self-auto ${
                    SEVERITY_STYLES[severityKey] ?? SEVERITY_STYLES.low
                }`}>
                    {gap.severity ?? 'LOW'} PRIORITY
                </span>
            </div>

            {resources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                    {resources.map((resource) => (
                        <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 p-3 rounded-xl studio-well border border-border hover:border-accent/40 transition-all duration-200"
                        >
                            <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 border border-border shadow-sm group-hover:scale-105 transition-transform duration-200">
                                {resource.type === 'VIDEO' ? <YouTubeLogo /> : <DocsLogo />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-primary group-hover:text-accent transition-colors duration-200 truncate">
                                    {resource.title || (resource.type === 'VIDEO' ? 'Watch Guide' : 'Read Documentation')}
                                </p>
                                <p className="type-micro text-secondary mt-0.5">
                                    {resource.type === 'VIDEO' ? 'Video Resource' : 'Official Spec'}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="flex items-center gap-2 p-3 mt-2 rounded-xl studio-well border border-border type-caption text-secondary font-mono">
                    <Icon name="help-circle" className="w-3.5 h-3.5 shrink-0" />
                    <span>No external resources identified. Review core documentation for this competency.</span>
                </div>
            )}
        </div>
    )
})

/* ─────────────────────────────────────────
   Roadmap Day Timeline (Memoized)
───────────────────────────────────────── */
const RoadmapDay = React.memo(({ day, index, total }) => {
    const isFirst = index === 0;
    return (
        <div className="relative flex gap-4 sm:gap-5 pb-6 group">
            {index < total - 1 && (
                <div className="absolute left-[19px] sm:left-5 top-11 bottom-0 w-[2px] bg-gradient-to-b from-accent/30 via-amber/20 to-transparent" />
            )}
            <div className={`relative z-10 shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center studio-card border shadow-sm group-hover:border-accent/50 transition-colors duration-300 ${
                isFirst
                    ? 'border-accent/40 shadow-sm'
                    : 'border-border'
            }`}>
                <span className="text-[7px] font-mono font-bold text-secondary uppercase tracking-wider leading-none mb-0.5">DAY</span>
                <span className="text-sm font-mono font-bold text-accent leading-none">{day.day}</span>
            </div>
            <div className="flex-1 studio-card rounded-2xl p-4 sm:p-5 hover:border-slate-300 transition-colors duration-200 border-l-[3px] border-l-accent/40">
                <h3 className="text-sm sm:text-base font-bold text-primary mb-2.5 flex items-center gap-2 tracking-tight">
                    <span className="text-accent">●</span>
                    {day.focus}
                </h3>
                <ul className="space-y-2">
                    {day.tasks.map((task, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-secondary leading-relaxed font-sans">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                            <span>{task}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
})

/* ─────────────────────────────────────────
   Skeleton Loader
───────────────────────────────────────── */
const SkeletonLoader = () => (
    <div className="w-full max-w-6xl mx-auto space-y-6 py-6 font-sans">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="space-y-2">
                <Skeleton width="160px" height="1.5rem" />
                <Skeleton width="340px" height="2.5rem" />
            </div>
            <Skeleton width="160px" height="2.5rem" />
        </div>
        <Skeleton width="300px" height="1.25rem" />
        <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-64 shrink-0 space-y-3">
                <Skeleton height="14rem" />
            </div>
            <div className="flex-1 w-full space-y-3">
                <Skeleton height="4.5rem" />
                <Skeleton height="4.5rem" />
                <Skeleton height="4.5rem" />
            </div>
        </div>
    </div>
)

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
const InterviewReport = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const [isExporting, setIsExporting] = useState(false)
    const { report, getReportById, loading } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        window.scrollTo(0, 0)
        if (interviewId) getReportById(interviewId)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interviewId])

    const handleExportPdf = useCallback(async () => {
        if (!report || isExporting) return
        setIsExporting(true)
        try {
            await exportReportPdf(report)
        } catch (err) {
            console.error('Failed exporting report PDF:', err)
        } finally {
            setIsExporting(false)
        }
    }, [report, isExporting])

    if (loading || !report) return <SkeletonLoader />

    const technicalQuestions = report.technicalQuestions ?? []
    const behavioralQuestions = report.behavioralQuestions ?? []
    const preparationPlan   = report.preparationPlan ?? []
    const skillGaps         = report.skillGaps ?? []
    const totalQuestions    = technicalQuestions.length + behavioralQuestions.length
    const scoreLabel      = report.matchScore >= 80 ? 'Strong Match' : report.matchScore >= 60 ? 'Moderate Match' : 'Low Match'
    const scoreLabelColor = report.matchScore >= 80 ? 'text-emerald-400' : report.matchScore >= 60 ? 'text-amber' : 'text-red-400'
    const matchBadgeClass = report.matchScore >= 80
        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
        : report.matchScore >= 60
        ? 'bg-[#FE9A00]/10 border-amber/30 text-amber'
        : 'bg-red-500/10 border-red-500/30 text-red-400'

    return (
        <div className="w-full max-w-6xl mx-auto pb-20 font-sans">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-border">
                <div className="space-y-1.5">
                    <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold block">
                        Interview Preparation Dossier
                    </span>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
                        {report.title || 'Target Role Analysis'}
                    </h1>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                    <div className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-mono font-semibold ${matchBadgeClass}`}>
                        <span>{report.matchScore}% {scoreLabel}</span>
                    </div>

                    <button
                        id="export-pdf-btn"
                        onClick={handleExportPdf}
                        disabled={isExporting}
                        className="w-full sm:w-auto studio-btn-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white cursor-pointer disabled:opacity-50"
                    >
                        {isExporting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Exporting Dossier...</span>
                            </>
                        ) : (
                            <>
                                <Icon name="download" className="w-4 h-4" />
                                <span>Download PDF Dossier</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ── Inline Stats Strip ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                <div className="studio-card p-4 rounded-xl flex flex-col justify-between">
                    <span className="text-[11px] font-mono text-secondary uppercase">Total Questions</span>
                    <span className="text-xl font-mono font-bold text-primary mt-1">{totalQuestions}</span>
                </div>
                <div className="studio-card p-4 rounded-xl flex flex-col justify-between">
                    <span className="text-[11px] font-mono text-secondary uppercase">Skill Gaps Flagged</span>
                    <span className="text-xl font-mono font-bold text-accent mt-1">{skillGaps.length}</span>
                </div>
                <div className="studio-card p-4 rounded-xl flex flex-col justify-between">
                    <span className="text-[11px] font-mono text-secondary uppercase">Preparation Plan</span>
                    <span className="text-xl font-mono font-bold text-amber mt-1">{preparationPlan.length} Days</span>
                </div>
                <div className="studio-card p-4 rounded-xl flex flex-col justify-between">
                    <span className="text-[11px] font-mono text-secondary uppercase">Overall Match</span>
                    <span className="text-xl font-mono font-bold text-emerald-600 mt-1">{report.matchScore}%</span>
                </div>
            </div>

            {/* ── Mobile Tab Navigation ── */}
            <div className="md:hidden flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveNav(item.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-semibold whitespace-nowrap shrink-0 border transition-all duration-200 ${
                            activeNav === item.id
                                ? 'bg-accent/15 border-accent/40 text-accent font-bold'
                                : 'studio-well text-secondary hover:text-primary'
                        }`}
                    >
                        <Icon name={item.icon} className="w-3.5 h-3.5" />
                        <span>{item.short}</span>
                        {item.id === 'skills' && skillGaps.length > 0 && (
                            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-accent text-white">
                                {skillGaps.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Main Layout: Sticky Sidebar + Content ── */}
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start relative">

                {/* ── Pinned Sticky Sidebar ── */}
                <aside className="hidden md:flex flex-col w-60 lg:w-72 shrink-0 sticky top-20 self-start space-y-4">
                    <nav className="studio-card p-2 rounded-2xl space-y-1">
                        {NAV_ITEMS.map(item => {
                            const isActive = activeNav === item.id
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
                                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 text-left cursor-pointer ${
                                        isActive
                                            ? 'bg-accent/10 text-primary font-semibold border-l-[3px] border-l-accent'
                                            : 'text-secondary hover:text-primary hover:bg-slate-100'
                                    }`}
                                >
                                    <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                                        isActive ? 'bg-accent text-white' : 'bg-slate-100 border border-border text-secondary'
                                    }`}>
                                        <Icon name={item.icon} className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="truncate">{item.label}</span>
                                    {item.id === 'skills' && skillGaps.length > 0 && (
                                        <span className={`ml-auto shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                            isActive ? 'bg-accent text-white' : 'bg-slate-200 text-secondary'
                                        }`}>
                                            {skillGaps.length}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </nav>

                    {/* Match Score Card inside Sidebar */}
                    <div className="studio-card p-5 rounded-2xl flex flex-col items-center text-center">
                        <p className="type-micro text-secondary mb-3">OVERALL MATCH RATING</p>
                        <div className="mb-2">
                            <ScoreWidget score={report.matchScore} size={82} strokeWidth={6} />
                        </div>
                        <span className={`type-micro tracking-wider ${scoreLabelColor}`}>
                            {scoreLabel}
                        </span>
                        <p className="type-caption text-secondary mt-1 max-w-[180px]">
                            Calculated against target role specifications
                        </p>
                    </div>
                </aside>

                {/* ── Main Content Column (With Tab Cross-Fade) ── */}
                <main className="flex-1 min-w-0 w-full space-y-4">
                    <div key={activeNav} className="page-enter space-y-4">
                        {/* Section Header */}
                        <div className="mb-4">
                            <h2 className="text-lg sm:text-xl font-bold text-primary tracking-tight mb-1">
                                {activeNav === 'technical'  && 'Technical Interview Questions'}
                                {activeNav === 'behavioral' && 'Behavioral & Leadership Scenarios'}
                                {activeNav === 'skills'     && 'Targeted Skill Gaps & References'}
                                {activeNav === 'roadmap'    && '10-Day Targeted Action Plan'}
                            </h2>
                            <p className="text-secondary/70 text-xs sm:text-sm leading-relaxed">
                                {activeNav === 'technical'  && 'Tailored technical questions generated directly from your resume and target role requirements.'}
                                {activeNav === 'behavioral' && 'Situational prompts evaluated against the STAR framework (Situation, Task, Action, Result).'}
                                {activeNav === 'skills'     && 'Competencies to reinforce before your interview, with verified technical resources.'}
                                {activeNav === 'roadmap'    && 'A day-by-day structured execution checklist to build confidence and mastery.'}
                            </p>
                        </div>

                        {/* Section 1: Technical Questions */}
                        {activeNav === 'technical' && (
                            <div className="space-y-3.5">
                                {technicalQuestions.length > 0 ? (
                                    technicalQuestions.map((q, i) => (
                                        <QuestionCard
                                            key={i}
                                            item={q}
                                            index={i}
                                            badgeColor="bg-accent/15 text-accent border border-accent/25"
                                        />
                                    ))
                                ) : (
                                    <div className="studio-card rounded-2xl p-8 text-center">
                                        <p className="text-sm text-secondary/60">No technical questions available for this report.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Section 2: Behavioral Questions */}
                        {activeNav === 'behavioral' && (
                            <div className="space-y-3.5">
                                {behavioralQuestions.length > 0 ? (
                                    behavioralQuestions.map((q, i) => (
                                        <QuestionCard
                                            key={i}
                                            item={q}
                                            index={i}
                                            badgeColor="bg-amber/15 text-amber border border-amber/25"
                                        />
                                    ))
                                ) : (
                                    <div className="studio-card rounded-2xl p-8 text-center">
                                        <p className="text-sm text-secondary/60">No behavioral questions available for this report.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Section 3: Skill Gaps */}
                        {activeNav === 'skills' && (
                            <div className="space-y-3.5">
                                {skillGaps.length > 0 ? (
                                    skillGaps.map((gap, i) => <SkillGapCard key={i} gap={gap} />)
                                ) : (
                                    <div className="studio-card rounded-2xl p-8 sm:p-10 text-center">
                                        <div className="w-12 h-12 mx-auto rounded-xl studio-well flex items-center justify-center mb-3">
                                            <Icon name="target" className="w-6 h-6 text-accent" />
                                        </div>
                                        <p className="text-base font-bold text-primary mb-1">No Skill Gaps Identified</p>
                                        <p className="text-xs sm:text-sm text-secondary/70 max-w-sm mx-auto leading-relaxed">
                                            Your background aligns seamlessly with target requirements. Focus on polishing question delivery!
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Section 4: Roadmap */}
                        {activeNav === 'roadmap' && (
                            <div className="pt-2">
                                {preparationPlan.length > 0 ? (
                                    preparationPlan.map((day, i) => (
                                        <RoadmapDay
                                            key={day.day || i}
                                            day={day}
                                            index={i}
                                            total={preparationPlan.length}
                                        />
                                    ))
                                ) : (
                                    <div className="studio-card rounded-2xl p-8 text-center">
                                        <p className="text-sm text-secondary/60">No preparation plan available for this report.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default InterviewReport
