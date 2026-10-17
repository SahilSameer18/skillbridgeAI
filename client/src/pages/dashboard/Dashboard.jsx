import React, { useEffect, useState } from 'react';
import { useInterview } from '../../hooks/useInterview.js';
import { useNavigate } from 'react-router';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { FiSearch, FiTrash2, FiDownload, FiX, FiArrowRight } from "react-icons/fi";
import { exportReportPdf } from '../../utils/exportReportPdf.js';

// ── Match Level Configuration ────────────────────────────────────────────────
const getMatchDetails = (score) => {
    if (!score) return { text: "text-white/40", border: "border-white/[0.08]", badgeBg: "bg-white/[0.03]", label: "Pending" };
    if (score >= 80) return { text: "text-emerald-400", border: "border-emerald-500/25", badgeBg: "bg-emerald-500/10", label: "Strong Match" };
    if (score >= 60) return { text: "text-amber", border: "border-amber/25", badgeBg: "bg-amber/10", label: "Good Match" };
    return { text: "text-accent", border: "border-accent/25", badgeBg: "bg-accent/10", label: "Needs Prep" };
};

// ── Linear Progress Bar Component (Memoized) ─────────────────────────────────
const HorizontalProgressBar = React.memo(({ score }) => {
    if (!score) return null;
    const { text } = getMatchDetails(score);

    return (
        <div className="w-full my-4 relative z-10">
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider">Alignment Score</span>
                <span className={`text-xs font-mono font-bold ${text}`}>{score}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div 
                    className="h-full rounded-full bg-gradient-to-r from-accent to-[#FE9A00] transition-all duration-700 ease-out"
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
});

// ── Memoized Individual Report Card Component ────────────────────────────────
const ReportCard = React.memo(({ report, onNavigate, onDownloadPdf, onDelete, isDownloading, isDeleting }) => {
    const { label, text, border, badgeBg } = getMatchDetails(report.matchScore);

    return (
        <div
            onClick={() => onNavigate(`/interview/${report.id}`)}
            className="studio-card rounded-2xl p-5 flex flex-col justify-between min-h-56 hover:border-white/[0.2] transition-all duration-200 cursor-pointer group"
        >
            {/* Card Header (Title & Status Tag) */}
            <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white text-base leading-snug group-hover:text-accent transition-colors duration-200 truncate" title={report.title || 'Custom Interview Plan'}>
                        {report.title || 'Custom Interview Plan'}
                    </h3>
                    <p className="text-[11px] text-white/40 mt-1 font-mono">
                        {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
                {report.matchScore && (
                    <span className={`shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${text} ${border} ${badgeBg}`}>
                        {label}
                    </span>
                )}
            </div>

            {/* Progress Bar Widget */}
            <HorizontalProgressBar score={report.matchScore} />

            {/* Description Snippet */}
            <p className="text-xs text-secondary/70 leading-relaxed flex-grow mt-1 line-clamp-2 font-normal" style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {report.jobDescription || "Custom target interview analysis details."}
            </p>

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06] relative z-10" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={() => onNavigate(`/interview/${report.id}`)}
                    className="text-xs font-semibold text-white/90 flex items-center gap-1 group/btn hover:text-accent transition-colors cursor-pointer"
                >
                    <span>View Dossier</span>
                    <FiArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                </button>

                <div className="flex gap-2">
                    {/* PDF export */}
                    <button
                        onClick={(e) => onDownloadPdf(e, report)}
                        disabled={isDownloading}
                        title="Download PDF"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#08080A] hover:bg-white/[0.06] border border-white/[0.08] text-white/50 hover:text-white transition-all duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        {isDownloading ? (
                            <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
                        ) : (
                            <FiDownload className="w-4 h-4" />
                        )}
                    </button>

                    {/* Delete report */}
                    <button
                        onClick={(e) => onDelete(e, report.id)}
                        disabled={isDeleting}
                        title="Delete plan"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#08080A] hover:bg-red-500/15 border border-white/[0.08] text-white/50 hover:text-red-400 hover:border-red-500/25 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        {isDeleting ? (
                            <span className="w-3.5 h-3.5 border-2 border-red-500/30 border-t-red-400 rounded-full animate-spin" />
                        ) : (
                            <FiTrash2 className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
});

// ── Skeleton Loader Card ─────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="studio-card rounded-2xl p-5 flex flex-col justify-between h-56">
        <div className="flex items-start justify-between gap-3">
            <div className="flex-grow space-y-2">
                <Skeleton width="65%" height="1.1rem" />
                <Skeleton width="35%" height="0.7rem" />
            </div>
            <Skeleton width="70px" height="1.15rem" borderRadius="4px" />
        </div>
        <div className="w-full my-4">
            <Skeleton width="100%" height="0.5rem" borderRadius="999px" />
        </div>
        <div className="space-y-1.5 flex-grow">
            <Skeleton width="100%" height="0.4rem" />
            <Skeleton width="75%" height="0.4rem" />
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
            <Skeleton width="80px" height="1.5rem" borderRadius="6px" />
            <div className="flex gap-2">
                <Skeleton width="32px" height="32px" borderRadius="8px" />
                <Skeleton width="32px" height="32px" borderRadius="8px" />
            </div>
        </div>
    </div>
);

// ── Premium Empty State ──────────────────────────────────────────────────────
const EmptyState = ({ onNavigate }) => (
    <div className="studio-card rounded-3xl p-10 sm:p-16 text-center mt-6 flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl studio-well flex items-center justify-center text-accent mb-6 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="16" y2="17"/>
            </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Interview Plans Yet</h3>
        <p className="text-sm text-secondary/70 max-w-sm mx-auto mb-8 leading-relaxed font-normal">
            Upload your resume alongside a target job description to generate tailored questions, skill gap charts, and preparation schedules.
        </p>
        <button
            onClick={onNavigate}
            className="studio-btn-primary px-6 py-3 rounded-xl text-sm font-bold text-white cursor-pointer"
        >
            Create Your First Plan
        </button>
    </div>
);

const Dashboard = () => {
    const { reports, totalReports, getReports, deleteReport } = useInterview();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTier, setFilterTier] = useState("all");
    const [page, setPage] = useState(1);
    const limit = 6;

    useEffect(() => {
        const fetchReports = async () => {
            if (reports.length === 0) {
                setIsFetching(true);
                await getReports(1, limit);
                setIsFetching(false);
            }
        };
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMore = React.useCallback(async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        setIsFetching(true);
        await getReports(nextPage, limit);
        setIsFetching(false);
    }, [page, limit, getReports]);

    const handleDelete = React.useCallback(async (e, id) => {
        e.stopPropagation();
        setDeletingId(id);
        await deleteReport(id);
        setDeletingId(null);
    }, [deleteReport]);

    const handlePdfDownload = React.useCallback(async (e, report) => {
        e.stopPropagation();
        setDownloadingId(report.id);
        try {
            await exportReportPdf(report);
        } catch (err) {
            console.error("Failed downloading report PDF:", err);
        } finally {
            setDownloadingId(null);
        }
    }, []);

    const handleNavigate = React.useCallback((path) => {
        navigate(path);
    }, [navigate]);

    // Calculate Summary Stats from loaded reports
    const scoreValids = reports.filter(r => r.matchScore !== null);
    const avgScore = scoreValids.length > 0
        ? Math.round(scoreValids.reduce((acc, curr) => acc + curr.matchScore, 0) / scoreValids.length)
        : 0;
    const highMatches = scoreValids.filter(r => r.matchScore >= 80).length;

    // Client-side dynamic filtering
    const filteredReports = reports.filter((report) => {
        const titleMatch = report.title ? report.title.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const jdMatch = report.jobDescription ? report.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) : false;
        const matchesSearch = titleMatch || jdMatch;

        if (filterTier === "all") return matchesSearch;
        if (filterTier === "strong") return matchesSearch && report.matchScore >= 80;
        if (filterTier === "medium") return matchesSearch && report.matchScore >= 60 && report.matchScore < 80;
        if (filterTier === "low") return matchesSearch && report.matchScore < 60;
        return matchesSearch;
    });

    const isInitialLoading = isFetching && page === 1 && reports.length === 0;
    const hasMore = reports.length < totalReports;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 font-sans">

            {/* ── Page Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                        Preparation Workspace
                    </h1>
                    <p className="text-secondary/70 text-xs sm:text-sm font-normal">
                        {isInitialLoading ? 'Syncing reports...' : `Managing ${totalReports} saved preparation dossiers`}
                    </p>
                </div>
                {!isInitialLoading && (
                    <button
                        onClick={() => navigate('/generate')}
                        className="studio-btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white cursor-pointer self-start sm:self-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>New Analysis</span>
                    </button>
                )}
            </div>

            {/* ── Stats Summary Grid ── */}
            {!isInitialLoading && reports.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="studio-card p-5 rounded-2xl flex flex-col justify-between min-h-[105px]">
                        <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Total Saved Plans</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono leading-none">{totalReports}</span>
                            <span className="text-xs text-white/40 font-mono">plans</span>
                        </div>
                    </div>
                    <div className="studio-card p-5 rounded-2xl flex flex-col justify-between min-h-[105px]">
                        <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Avg Compatibility</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono leading-none" style={{ color: avgScore >= 80 ? '#34d399' : avgScore >= 60 ? '#FE9A00' : '#FF6662' }}>
                                {avgScore}%
                            </span>
                            <span className="text-xs text-white/40 font-mono">average</span>
                        </div>
                    </div>
                    <div className="studio-card p-5 rounded-2xl flex flex-col justify-between min-h-[105px]">
                        <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">High Matches (≥80%)</span>
                        <div className="flex items-baseline gap-2 mt-2">
                            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono leading-none">{highMatches}</span>
                            <span className="text-xs text-white/40 font-mono">roles</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Search & Filters Console Bar ── */}
            {!isInitialLoading && reports.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl studio-card mb-8">
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-white/30">
                            <FiSearch className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by role or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-9 py-2.5 bg-[#040405] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder-white/20 focus:outline-none focus:border-accent/60 transition-colors"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {[
                            { id: "all", label: "All Plans" },
                            { id: "strong", label: "Strong (80%+)" },
                            { id: "medium", label: "Moderate (60-79%)" },
                            { id: "low", label: "Needs Prep (<60%)" }
                        ].map((pill) => (
                            <button
                                key={pill.id}
                                onClick={() => setFilterTier(pill.id)}
                                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                                    filterTier === pill.id
                                        ? "bg-accent/15 border border-accent/40 text-white"
                                        : "studio-well text-white/60 hover:text-white border border-transparent"
                                }`}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Grid Skeletons ── */}
            {isInitialLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* ── Empty State ── */}
            {!isInitialLoading && reports.length === 0 && (
                <EmptyState onNavigate={() => navigate('/generate')} />
            )}

            {/* ── Report Card Grid ── */}
            {!isInitialLoading && reports.length > 0 && (
                <>
                    {filteredReports.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
                            {filteredReports.map((report) => (
                                <ReportCard
                                    key={report.id}
                                    report={report}
                                    onNavigate={handleNavigate}
                                    onDownloadPdf={handlePdfDownload}
                                    onDelete={handleDelete}
                                    isDownloading={downloadingId === report.id}
                                    isDeleting={deletingId === report.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center studio-card rounded-2xl mt-4">
                            <span className="text-white/40 text-sm font-mono">No plans match your search and filter criteria.</span>
                            <button
                                onClick={() => { setSearchTerm(""); setFilterTier("all"); }}
                                className="text-xs font-mono font-semibold text-accent mt-3 hover:underline cursor-pointer"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}

                    {/* Load More Footer */}
                    {hasMore && (
                        <div className="pt-8 pb-4 flex justify-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={isFetching}
                                className="studio-btn-secondary px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white transition-all duration-200 flex items-center gap-2 cursor-pointer"
                            >
                                {isFetching ? 'Loading...' : 'Load More Plans'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Dashboard;
