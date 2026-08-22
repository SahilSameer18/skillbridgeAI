import React, { useState, useEffect } from 'react'
import { useInterview } from '../../hooks/useInterview.js'
import { useParams } from 'react-router'
import Skeleton from '../../components/ui/Skeleton'
import { exportReportPdf } from '../../utils/exportReportPdf.js'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Q&A', icon: 'code' },
    { id: 'behavioral', label: 'Behavioral Q&A', icon: 'messages' },
    { id: 'skills', label: 'Skill Gaps & Resources', icon: 'target' },
    { id: 'roadmap', label: 'Action Plan', icon: 'map-2' },
]

const SEVERITY_STYLES = {
    high: 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-sm',
    medium: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm',
    low: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm',
}

/* ── Generic Icon Helper ── */
const Icon = ({ name, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        {name === 'code' && <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>}
        {name === 'messages' && <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />}
        {name === 'map-2' && <polygon points="3 11 22 2 13 21 11 13 3 11" />}
        {name === 'target' && <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>}
        {name === 'chevron-down' && <polyline points="6 9 12 15 18 9" />}
        {name === 'download' && <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>}
        {name === 'sparkle' && <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956Z" fill="currentColor" stroke="none" />}
        {name === 'help-circle' && <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>}
    </svg>
)

/* ── Brand Logos for Resources ── */
const YouTubeLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-red-500">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
        <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
)

const DocsLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
)

/* ── Circular score ring (Memoized) ── */
const ScoreRing = React.memo(({ score, color, size = 64, strokeWidth = 5 }) => {
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
})

/* ── Hero Stats Component (Memoized) ── */
const HeroStats = React.memo(({ report }) => {
    const scoreColor = report.matchScore >= 80 ? '#34d399' : report.matchScore >= 60 ? '#fbbf24' : '#f87171'
    const scoreLabel = report.matchScore >= 80 ? 'Strong match' : report.matchScore >= 60 ? 'Average match' : 'Low match'
    const scoreLabelColor = report.matchScore >= 80 ? 'text-emerald-400' : report.matchScore >= 60 ? 'text-amber-400' : 'text-red-400'

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="md:col-span-1 rounded-2xl p-4 sm:p-5 bg-surface/80 border border-border/80 relative overflow-hidden flex flex-col items-center justify-center text-center shadow-lg">
                <div className="relative z-10 mb-3">
                    <ScoreRing score={report.matchScore} color={scoreColor} size={72} strokeWidth={6} />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-xl font-bold text-primary leading-none">{report.matchScore}</span>
                    </div>
                </div>
                <h3 className="relative z-10 text-sm font-semibold text-primary mb-0.5">Match Score</h3>
                <p className={`relative z-10 text-[10px] font-bold uppercase tracking-wider ${scoreLabelColor}`}>{scoreLabel}</p>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl p-4 sm:p-5 bg-surface/70 border border-border/60 flex flex-col justify-center relative overflow-hidden group hover:bg-surface/90 transition-colors duration-200">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Icon name="messages" className="w-12 h-12 text-accent" /></div>
                    <p className="text-[11px] font-semibold text-secondary uppercase tracking-widest mb-1 relative z-10">Questions</p>
                    <p className="text-2xl font-bold text-primary mb-1 relative z-10">{report.technicalQuestions.length + report.behavioralQuestions.length}</p>
                    <p className="text-xs text-accent font-medium relative z-10">Technical & Behavioral</p>
                </div>
                <div className="rounded-2xl p-4 sm:p-5 bg-surface/70 border border-border/60 flex flex-col justify-center relative overflow-hidden group hover:bg-surface/90 transition-colors duration-200">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Icon name="map-2" className="w-12 h-12 text-accent" /></div>
                    <p className="text-[11px] font-semibold text-secondary uppercase tracking-widest mb-1 relative z-10">Roadmap</p>
                    <p className="text-2xl font-bold text-primary mb-1 relative z-10">{report.preparationPlan.length} Days</p>
                    <p className="text-xs text-accent font-medium relative z-10">Structured plan</p>
                </div>
            </div>
        </div>
    )
})

/* ── Question accordion card (Memoized) ── */
const QuestionCard = React.memo(({ item, index, accentClass, bodyBg }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className={`rounded-xl overflow-hidden border transition-colors duration-200 ${open ? 'border-border/80 shadow-md shadow-black/10 bg-surface/90' : 'border-border/60 bg-surface/60 hover:border-border/70'}`}>
            <button
                className="w-full flex items-start gap-3 p-3 sm:p-4 text-left focus:outline-none"
                onClick={() => setOpen(o => !o)}
            >
                <div className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shadow-inner ${accentClass}`}>
                    {index + 1}
                </div>
                <div className="flex-1 pt-0.5">
                    <p className={`text-sm font-medium leading-relaxed transition-colors duration-200 ${open ? 'text-primary' : 'text-primary/90'}`}>
                        {item.question}
                    </p>
                </div>
                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-surface/50 border border-border/50 text-secondary transition-transform duration-300 ${open ? 'rotate-180 bg-surface text-primary' : ''}`}>
                    <Icon name="chevron-down" className="w-3 h-3" />
                </div>
            </button>

            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-3 pb-3 sm:px-4 sm:pb-4 space-y-3 pt-1">
                        <div className="flex gap-3">
                            <div className="w-6 shrink-0 flex justify-center"><div className="w-px h-full bg-surface" /></div>
                            <div className="flex-1">
                                <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Icon name="target" className="w-2.5 h-2.5" /> Intention
                                </p>
                                <p className="text-xs text-secondary leading-relaxed bg-background/60 rounded-lg p-2.5 border border-border/50">
                                    {item.intention}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-6 shrink-0 flex justify-center"><div className="w-px h-full bg-surface" /></div>
                            <div className="flex-1">
                                <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mb-1 flex items-center gap-1">
                                    <Icon name="sparkle" className="w-2.5 h-2.5 text-accent" /> Model Answer
                                </p>
                                <div className={`text-sm text-primary/90 leading-relaxed rounded-lg p-3 shadow-inner ${bodyBg}`}>
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

/* ── Skill Gap Card (Memoized) ── */
const SkillGapCard = React.memo(({ gap }) => {
    const resources = gap.skillRef?.resources ?? []
    const severityKey = gap.severity?.toLowerCase()

    return (
        <div className="rounded-xl p-3 sm:p-4 border border-border/70 bg-surface/60 hover:bg-surface/80 transition-colors duration-200 mb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                    <div className={`w-1 h-5 rounded-full ${severityKey === 'high' ? 'bg-red-500' : severityKey === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <h3 className="text-base font-semibold text-primary tracking-tight">{gap.skill}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase self-start sm:self-auto ${SEVERITY_STYLES[severityKey] ?? SEVERITY_STYLES.low}`}>
                    {gap.severity ?? 'low'} Priority
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
                            className="group flex items-center gap-2.5 p-2 rounded-lg border border-border/60 bg-surface/80 hover:bg-surface hover:border-border/80 transition-colors duration-200"
                        >
                            <div className="shrink-0 w-8 h-8 rounded-md flex items-center justify-center bg-background border border-border/80 shadow-inner group-hover:scale-105 transition-transform duration-200">
                                {resource.type === 'VIDEO' ? <YouTubeLogo /> : <DocsLogo />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-primary/90 group-hover:text-primary transition-colors duration-200 truncate">
                                    {resource.title || (resource.type === 'VIDEO' ? 'Watch Tutorial' : 'Read Documentation')}
                                </p>
                                <p className="text-[9px] text-secondary uppercase tracking-wider mt-0.5">
                                    {resource.type === 'VIDEO' ? 'YouTube' : 'Documentation'}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="flex items-center gap-1.5 p-2.5 mt-2 rounded-lg bg-surface/40 border border-border/50 text-xs text-secondary">
                    <Icon name="help-circle" className="w-3.5 h-3.5" />
                    <span>No curated resources available yet.</span>
                </div>
            )}
        </div>
    )
})

/* ── Roadmap Day Timeline (Memoized) ── */
const RoadmapDay = React.memo(({ day, index, total }) => (
    <div className="relative flex gap-3 sm:gap-4 pb-6 group">
        {/* Timeline vertical line */}
        {index < total - 1 && (
            <div className="absolute left-[18px] sm:left-5 top-9 bottom-0 w-[2px] bg-gradient-to-b from-rose-500/30 to-violet-500/10 transition-colors duration-300" />
        )}
        
        {/* Node */}
        <div className="relative z-10 shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex flex-col items-center justify-center bg-surface border border-border/80 shadow-[0_0_10px_rgba(255,102,98,0.1)] group-hover:border-accent/50 transition-colors duration-300">
            <span className="text-[7px] sm:text-[8px] font-bold text-secondary uppercase tracking-widest leading-none mb-0.5 sm:mb-1">Day</span>
            <span className="text-xs sm:text-sm font-bold text-accent leading-none">{day.day}</span>
        </div>

        {/* Content Box */}
        <div className="flex-1 bg-surface/60 border border-border/60 rounded-xl p-3 sm:p-4 hover:bg-surface/80 hover:border-border/60 transition-colors duration-200 mt-0">
            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1.5">
                <Icon name="target" className="text-accent w-3.5 h-3.5" />
                {day.focus}
            </h3>
            <ul className="space-y-1.5">
                {day.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-primary/90 leading-relaxed">
                        <span className="mt-1 w-1 h-1 rounded-full bg-accent shrink-0 shadow-[0_0_4px_rgba(255,102,98,0.5)]" />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    </div>
))

/* ── Main Component ── */
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

    const handleExportPdf = React.useCallback(async () => {
        if (!report || isExporting) return;
        setIsExporting(true);
        try {
            await exportReportPdf(report);
        } catch (err) {
            console.error("Failed exporting report PDF:", err);
        } finally {
            setIsExporting(false);
        }
    }, [report, isExporting]);

    if (loading || !report) {
        return (
            <div className="animate-pulse w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <Skeleton width="180px" height="1.5rem" />
                        <Skeleton width="320px" height="2.5rem" />
                    </div>
                    <Skeleton width="160px" height="2.5rem" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Skeleton height="7rem" />
                    <Skeleton height="7rem" />
                    <Skeleton height="7rem" />
                    <Skeleton height="7rem" />
                </div>
                <Skeleton height="22rem" />
            </div>
        )
    }

    const skillGaps = report.skillGaps ?? []

    return (
        <div className="animate-fade-in w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-12">
            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-bold uppercase tracking-wider mb-2 shadow-[0_0_8px_rgba(255,102,98,0.1)]">
                        <Icon name="sparkle" className="w-3 h-3" /> AI Analysis Complete
                    </div>
                    <h1 className="text-2xl font-bold text-primary tracking-tight mb-1">Interview Strategy</h1>
                    <p className="text-secondary text-sm">
                        <span className="text-primary font-medium">{report.title || 'Target Role Plan'}</span>
                    </p>
                </div>
                <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    className="group flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-primary transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(255,102,98,0.2)] hover:shadow-[0_0_20px_rgba(255,102,98,0.4)] shrink-0 bg-accent disabled:opacity-60 cursor-pointer"
                >
                    {isExporting ? (
                        <>
                            <span className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <Icon name="download" className="w-4 h-4 group-hover:-translate-y-px transition-transform duration-200" />
                            Download Report PDF
                        </>
                    )}
                </button>
            </div>

            {/* ── Hero Stats ── */}
            <HeroStats report={report} />

            {/* ── Layout: Vertical Sidebar + Main Content ── */}
            <div className="flex flex-col lg:flex-row gap-5 sm:gap-6">
                
                {/* Navigation Sidebar */}
                <div className="w-full lg:w-56 shrink-0">
                    <div className="lg:sticky lg:top-20 bg-surface/80 border border-border/80 rounded-2xl p-2 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible no-scrollbar shadow-sm">
                        {NAV_ITEMS.map(item => {
                            const isActive = activeNav === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveNav(item.id)}
                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                                        isActive 
                                        ? 'bg-accent/15 text-primary shadow-inner border border-border/40' 
                                        : 'text-secondary hover:bg-surface/80 hover:text-primary border border-transparent'
                                    }`}
                                >
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200 ${isActive ? 'bg-surface text-accent shadow-sm' : 'bg-surface/50 text-secondary'}`}>
                                        <Icon name={item.icon} className="w-4 h-4" />
                                    </div>
                                    {item.label}
                                    {item.id === 'skills' && skillGaps.length > 0 && (
                                        <span className={`ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-bold ${isActive ? 'bg-accent text-background' : 'bg-surface text-primary/90'}`}>
                                            {skillGaps.length}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 pb-8">
                    <div className="mb-5 sm:mb-6">
                        <h2 className="text-lg font-semibold text-primary mb-1">
                            {activeNav === 'technical' && 'Technical Questions'}
                            {activeNav === 'behavioral' && 'Behavioral Questions'}
                            {activeNav === 'skills' && 'Skill Gaps & Resources'}
                            {activeNav === 'roadmap' && '10-Day Preparation Plan'}
                        </h2>
                        <p className="text-secondary text-xs">
                            {activeNav === 'technical' && 'Tailored technical questions based on your resume and the job description.'}
                            {activeNav === 'behavioral' && 'Situational questions to validate your soft skills and experience.'}
                            {activeNav === 'skills' && 'Identified areas for improvement with curated video and documentation resources.'}
                            {activeNav === 'roadmap' && 'A structured day-by-day guide to ace your interview.'}
                        </p>
                    </div>

                    {/* Technical */}
                    {activeNav === 'technical' && (
                        <div className="space-y-3">
                            {report.technicalQuestions.map((q, i) => (
                                <QuestionCard
                                    key={i}
                                    item={q}
                                    index={i}
                                    accentClass="bg-accent/10 text-accent"
                                    bodyBg="bg-accent/5 border border-accent/10"
                                />
                            ))}
                        </div>
                    )}

                    {/* Behavioral */}
                    {activeNav === 'behavioral' && (
                        <div className="space-y-3">
                            {report.behavioralQuestions.map((q, i) => (
                                <QuestionCard
                                    key={i}
                                    item={q}
                                    index={i}
                                    accentClass="bg-accent/10 text-accent"
                                    bodyBg="bg-accent/5 border border-accent/10"
                                />
                            ))}
                        </div>
                    )}

                    {/* Skill Gaps */}
                    {activeNav === 'skills' && (
                        <div className="space-y-3">
                            {skillGaps.length > 0 ? (
                                skillGaps.map((gap, i) => (
                                    <SkillGapCard key={i} gap={gap} />
                                ))
                            ) : (
                                <div className="rounded-2xl p-6 sm:p-8 border border-border/60 bg-surface/70 text-center shadow-inner">
                                    <div className="w-12 h-12 mx-auto rounded-xl bg-background/50 flex items-center justify-center mb-3">
                                        <Icon name="target" className="w-6 h-6 text-secondary" />
                                    </div>
                                    <p className="text-sm font-semibold text-primary mb-1">No Skill Gaps Identified</p>
                                    <p className="text-xs text-secondary max-w-xs mx-auto">Your resume perfectly matches the job description requirements. You're fully aligned!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Roadmap */}
                    {activeNav === 'roadmap' && (
                        <div className="pt-1 pl-1">
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
            </div>
        </div>
    )
}

export default InterviewReport
