import React, { useEffect, useState } from 'react';
import { useInterview } from '../../hooks/useInterview.js';
import { useNavigate } from 'react-router';
import Skeleton from '../../components/common/Skeleton.jsx';

const ScoreBadge = ({ score }) => {
    if (!score) return <span className="text-[11px] font-semibold text-slate-500 bg-slate-800/50 px-2 py-1 rounded">Pending</span>;
    const styles = score >= 80
        ? 'bg-emerald-500/10 text-emerald-400'
        : score >= 60
        ? 'bg-amber-500/10 text-amber-400'
        : 'bg-red-500/10 text-red-400';
    
    return (
        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${styles}`}>
            {score}% Match
        </span>
    );
};

const SkeletonRow = () => (
    <div className="flex items-center justify-between p-4 border-b border-slate-800/60 bg-slate-900/20">
        <div className="flex-1 space-y-2">
            <Skeleton width="40%" height="1rem" />
            <Skeleton width="15%" height="0.75rem" />
        </div>
        <div className="flex items-center gap-4">
            <Skeleton width="80px" height="1.5rem" borderRadius="99px" />
            <Skeleton width="24px" height="24px" borderRadius="6px" />
        </div>
    </div>
);

const EmptyState = ({ onNavigate }) => (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-slate-900/30 rounded-2xl border border-slate-800/50 mt-6">
        <h3 className="text-lg font-medium text-white mb-2">No plans found</h3>
        <p className="text-sm text-slate-400 mb-6">You haven't generated any interview preparation plans yet.</p>
        <button
            onClick={onNavigate}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 transition-colors duration-200"
        >
            Create your first plan
        </button>
    </div>
);

const Dashboard = () => {
    const { reports, totalReports, getReports, deleteReport } = useInterview();
    const navigate = useNavigate();
    const [deletingId, setDeletingId] = useState(null);
    const [isFetching, setIsFetching] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 6;

    useEffect(() => {
        const fetchReports = async () => {
            setIsFetching(true);
            await getReports(1, limit);
            setIsFetching(false);
        };
        fetchReports();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        setIsFetching(true);
        await getReports(nextPage, limit);
        setIsFetching(false);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        setDeletingId(id);
        await deleteReport(id);
        setDeletingId(null);
    };

    const isInitialLoading = isFetching && page === 1 && reports.length === 0;
    const hasMore = reports.length < totalReports;

    return (
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Interview Plans</h1>
                    <p className="text-slate-400 text-sm">
                        {isInitialLoading ? 'Loading...' : `${totalReports} total ${totalReports === 1 ? 'plan' : 'plans'}`}
                    </p>
                </div>
                {!isInitialLoading && reports.length > 0 && (
                    <button
                        onClick={() => navigate('/generate')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-500 transition-colors duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        New Plan
                    </button>
                )}
            </div>

            {/* ── Skeleton loading ── */}
            {isInitialLoading && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40">
                    {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
                </div>
            )}

            {/* ── Empty state ── */}
            {!isInitialLoading && reports.length === 0 && (
                <EmptyState onNavigate={() => navigate('/generate')} />
            )}

            {/* ── Report List ── */}
            {!isInitialLoading && reports.length > 0 && (
                <div className="space-y-4">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            onClick={() => navigate(`/interview/${report.id}`)}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-900/40 border border-slate-800 rounded-xl hover:bg-slate-800/60 hover:border-slate-700 cursor-pointer transition-all duration-200"
                        >
                            <div className="flex-1 min-w-0 pr-4 mb-4 sm:mb-0">
                                <h3 className="font-semibold text-slate-100 text-lg truncate mb-1">
                                    {report.title || report.jobDescription || 'Custom Interview Plan'}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Created on {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-56">
                                <ScoreBadge score={report.matchScore} />
                                <button
                                    onClick={(e) => handleDelete(e, report.id)}
                                    disabled={deletingId === report.id}
                                    title="Delete plan"
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors duration-150 disabled:opacity-50"
                                >
                                    {deletingId === report.id ? (
                                        <span className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Load More Footer */}
                    {hasMore && (
                        <div className="pt-6 pb-2 flex justify-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={isFetching}
                                className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors duration-150 flex items-center gap-2 shadow-sm"
                            >
                                {isFetching && (
                                    <span className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" />
                                )}
                                {isFetching ? 'Loading...' : 'Load More Plans'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;