import React, { useEffect, useState } from 'react';
import { useInterview } from '../../hooks/useInterview.js';
import { useNavigate } from 'react-router';
import Skeleton from '../../components/common/Skeleton.jsx';

const ScoreBadge = ({ score }) => {
    const color = score >= 80
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        : score >= 60
        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        : 'bg-red-500/10 text-red-400 border-red-500/20';
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
            {score ? `${score}% Match` : 'N/A'}
        </span>
    );
};

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

    return (
        <div className="animate-fade-in py-4">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-1 h-8 rounded-full" style={{background:'linear-gradient(180deg,#06b6d4,#a855f7)'}} />
                    <h1 className="text-3xl font-bold text-white">Your Interview Plans</h1>
                </div>
                <p className="text-slate-400 ml-4 pl-3">Review your saved analyses and continue preparing for interviews.</p>
            </div>

            {isFetching && reports.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="rounded-2xl p-6 space-y-4" style={{background:'rgba(15,23,42,0.6)', border:'1px solid rgba(255,255,255,0.06)'}}>
                            <Skeleton width="70%" height="1.4rem" />
                            <Skeleton width="40%" height="0.8rem" />
                            <Skeleton width="100px" height="1.8rem" borderRadius="2rem" />
                        </div>
                    ))}
                </div>
            ) : reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6" style={{background:'rgba(6,182,212,0.08)', border:'1px solid rgba(6,182,212,0.15)'}}>
                        📋
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No plans yet</h3>
                    <p className="text-slate-500 mb-8 max-w-xs">You haven't generated any interview plans yet. Create your first one!</p>
                    <button
                        onClick={() => navigate('/generate')}
                        className="px-6 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300 active:scale-95"
                        style={{background:'linear-gradient(135deg,#06b6d4,#a855f7)', boxShadow:'0 8px 24px rgba(168,85,247,0.2)'}}>
                        ✨ Create New Plan
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {reports.map((report, idx) => (
                        <div
                            key={report._id}
                            onClick={() => navigate(`/interview/${report._id}`)}
                            className="group relative rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                            style={{
                                background:'rgba(15,23,42,0.6)',
                                border:'1px solid rgba(255,255,255,0.06)',
                                backdropFilter:'blur(12px)',
                                animationDelay:`${idx * 0.05}s`
                            }}
                        >
                            {/* Hover glow */}
                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                style={{background:'linear-gradient(135deg,rgba(6,182,212,0.04),rgba(168,85,247,0.04))', border:'1px solid rgba(6,182,212,0.15)'}} />

                            <div className="flex justify-between items-start gap-2 mb-3">
                                <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2 flex-1">
                                    {report.title || (report.jobDescription?.slice(0, 50).trim() + (report.jobDescription?.length > 50 ? '…' : '')) || 'Interview Plan'}
                                </h3>
                                <button
                                    onClick={(e) => handleDelete(e, report._id)}
                                    disabled={deletingId === report._id}
                                    title="Delete"
                                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
                                >
                                    {deletingId === report._id ? (
                                        <span className="w-3.5 h-3.5 border border-red-400/50 border-t-red-400 rounded-full animate-spin" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                    )}
                                </button>
                            </div>

                            <p className="text-xs text-slate-500 mb-4">
                                {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>

                            <div className="flex items-center justify-between">
                                <ScoreBadge score={report.matchScore} />
                                <svg className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
