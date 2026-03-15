import React, { useEffect, useState } from 'react';
import { useInterview } from '../hooks/useInterview.js';
import { useNavigate } from 'react-router';
import '../style/dashboard.scss';

const Dashboard = () => {
    const { reports, loading, getReports, deleteReport } = useInterview();
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
        <div className="dashboard-page">
            <header className="page-header">
                <h1>Your Saved <span className="highlight">Interview Plans</span></h1>
                <p>Review your past analysis reports and continue preparing.</p>
            </header>

            {isFetching && reports.length === 0 ? (
                <main className='loading-screen'>
                    <div className="spinner"></div>
                    <h2>Loading your dashboard...</h2>
                </main>
            ) : reports.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't generated any interview plans yet.</p>
                    <button onClick={() => navigate('/')} className="generate-btn">
                        Create New Plan
                    </button>
                </div>
            ) : (
                <section className="dashboard-reports">
                    <div className="reports-grid">
                        {reports.map(report => (
                            <div key={report._id} className="report-card" onClick={() => navigate(`/interview/${report._id}`)}>
                                <div className="report-card__header">
                                    <h3>{report.title || 'Untitled Position'}</h3>
                                    <button 
                                        className="delete-btn" 
                                        onClick={(e) => handleDelete(e, report._id)}
                                        disabled={deletingId === report._id}
                                        title="Delete Report"
                                    >
                                        {deletingId === report._id ? (
                                            <span className="spinner-small"></span>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                                        )}
                                    </button>
                                </div>
                                <div className="report-card__body">
                                    <p className="report-meta">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    <div className="score-container">
                                        <div className={`match-badge ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                            Match Score: {report.matchScore ? `${report.matchScore}%` : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Dashboard;
