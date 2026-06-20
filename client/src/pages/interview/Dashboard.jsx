import React, { useEffect, useState } from 'react';
import { useInterview } from '../../hooks/useInterview.js';
import { useNavigate } from 'react-router';
import Skeleton from '../../components/common/Skeleton.jsx';

const ScoreBadge = ({ score }) => {
    if (!score) return <span className="text-xs text-slate-600">No score</span>;
    const styles = score >= 80
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : score >= 60
        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        : 'bg-red-500/10 text-red-400 border-red-500/20';
    const label = score >= 80 ? 'Strong match' : score >= 60 ? 'Average match' : 'Low match';
    return (
        <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${styles}`}>
                {score}%
            </span>
            <span className="text-xs text-slate-500">{label}</span>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="rounded-xl p-5 space-y-4 bg-slate-900/50 border border-slate-800/60">
        <div className="flex justify-between items-start gap-2">
            <Skeleton width="65%" height="1rem" />
            <Skeleton width="28px" height="28px" borderRadius="8px" />
        </div>
        <Skeleton width="35%" height="0.75rem" />
        <div className="flex items-center justify-between pt-1">
            <Skeleton width="80px" height="1.5rem" borderRadius="6px" />
            <Skeleton width="16px" height="16px" borderRadius="4px" />
        </div>
    </div>
);

const EmptyState = ({ onNavigate }) => (
    <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-slate-900/60 border border-slate-800/60">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
        </div>
        <h3 className="text-base font-semibold text-white mb-1.5">No plans yet</h3>
        <p className="text-sm text-slate-500 mb-7 max-w-xs leading-relaxed">
            Generate your first interview plan by uploading a resume and job description.
        </p>
        <button
            onClick={onNavigate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 active:scale-95 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)', boxShadow: '0 8px 20px rgba(168,85,247,0.2)' }}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956Z"/>
            </svg>
            Create new plan
        </button>
    </div>
);

const Dashboard = () => {
    const { reports, getReports, deleteReport } = useInterview();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            setIsFetching(true);
            await getReports();
            setIsFetching(false);
        };
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        setDeletingId(id);
        await deleteReport(id);
        setDeletingId(null);
    };

    const isLoading = isFetching && reports.length === 0;

    return (
        <div className="animate-fade-in py-4">

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Interview plans</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {isLoading ? 'Loading...' : `${reports.length} saved ${reports.length === 1 ? 'plan' : 'plans'}`}
                    </p>
                </div>
                {!isLoading && reports.length > 0 && (
                    <button
                        onClick={() => navigate('/generate')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 active:scale-95 hover:opacity-90 shrink-0"
                        style={{ background: 'linear-gradient(135deg,#06b6d4,#a855f7)', boxShadow: '0 6px 16px rgba(168,85,247,0.2)' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        New plan
                    </button>
                )}
            </div>

            {/* ── Skeleton loading ── */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* ── Empty state ── */}
            {!isLoading && reports.length === 0 && (
                <EmptyState onNavigate={() => navigate('/generate')} />
            )}

            {/* ── Report grid ── */}
            {!isLoading && reports.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reports.map((report, idx) => (
                        <div
                            key={report.id}
                            onClick={() => navigate(`/interview/${report.id}`)}
                            className="group relative rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700/70 animate-fade-in-up bg-slate-900/50 border border-slate-800/60"
                            style={{ animationDelay: `${idx * 0.04}s` }}
                        >
                            {/* Top row: title + delete */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 flex-1">
                                    {report.title
                                        || (report.jobDescription?.slice(0, 60).trim() + (report.jobDescription?.length > 60 ? '…' : ''))
                                        || 'Interview plan'}
                                </h3>
                                <button
                                    onClick={(e) => handleDelete(e, report.id)}
                                    disabled={deletingId === report.id}
                                    title="Delete plan"
                                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-700 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 disabled:opacity-40"
                                >
                                    {deletingId === report.id ? (
                                        <span className="w-3 h-3 border border-red-400/50 border-t-red-400 rounded-full animate-spin" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Date */}
                            <p className="text-xs text-slate-600 mb-4">
                                {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>

                            {/* Divider */}
                            <div className="border-t border-slate-800/60 pt-3 flex items-center justify-between">
                                <ScoreBadge score={report.matchScore} />
                                <svg
                                    className="w-4 h-4 text-slate-700 group-hover:text-cyan-400 transition-colors duration-150"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;