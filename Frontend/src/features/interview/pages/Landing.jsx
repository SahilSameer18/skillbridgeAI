import React from 'react'
import { Link } from 'react-router'
import '../style/landing.scss'
import { useAuth } from '../../auth/hooks/useAuth'

const Landing = () => {
    const { user } = useAuth()

    return (
        <div className="landing-page">

            {/* ── Hero ── */}
            <header className="hero">
                <div className="hero-content">
                    <div className="hero-badge">🤖 Powered by AI</div>
                    <h1>
                        Master Your Next{' '}
                        <span className="highlight">Technical Interview</span>
                    </h1>
                    <p className="subtitle">
                        Upload your resume, paste the job description — our AI analyzes your
                        profile, generates tailored questions, maps your skill gaps, and builds
                        a personalized preparation roadmap. Land your dream job at any company.
                    </p>
                    <div className="cta-container">
                        {user ? (
                            <Link to="/generate" className="btn-primary">
                                ✨ Generate My Plan
                            </Link>
                        ) : (
                            <Link to="/register" className="btn-primary">
                                ✨ Get Started Free
                            </Link>
                        )}
                        <Link to={user ? "/dashboard" : "/login"} className="btn-secondary">
                            {user ? "View My Reports" : "Sign In"}
                        </Link>
                    </div>
                    <p className="hero-note">No credit card required &bull; Ready in 30 seconds</p>
                </div>
            </header>

            {/* ── Stats Bar ── */}
            <div className="stats-bar">
                <div className="stats-bar__inner">
                    <div className="stat">
                        <span className="stat__number">10K+</span>
                        <span className="stat__label">Plans Generated</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                        <span className="stat__number">95%</span>
                        <span className="stat__label">Match Accuracy</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                        <span className="stat__number">50+</span>
                        <span className="stat__label">Questions Generated</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                        <span className="stat__number">7-Day</span>
                        <span className="stat__label">Prep Roadmap</span>
                    </div>
                </div>
            </div>

            {/* ── Features ── */}
            <section className="features-section">
                <div className="section-header">
                    <span className="section-tag">Core Features</span>
                    <h2>Everything You Need to <span className="highlight">Ace the Interview</span></h2>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Deep Resume Profiling</h3>
                        <p>Our AI intelligently extracts skills, experience, and achievements from your PDF resume and maps them directly against the target job requirements.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>AI-Generated Questions</h3>
                        <p>Get 10+ tailored technical and behavioral questions with model answers and interview intentions — specific to the exact role and your background.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📈</div>
                        <h3>Skill Gap Analysis</h3>
                        <p>Instantly see which skills you're missing for the role with severity ratings (Low, Medium, High) so you know exactly what to study.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🗺️</div>
                        <h3>7-Day Prep Roadmap</h3>
                        <p>A day-by-day preparation plan with focused tasks, curated to close your specific skill gaps before the interview day.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📄</div>
                        <h3>AI Resume Generator</h3>
                        <p>Generate a polished, ATS-friendly PDF resume tailored to the target job — ready to download and send in under a minute.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💾</div>
                        <h3>Saved Report History</h3>
                        <p>All your generated plans are saved to your personal dashboard so you can track multiple job applications and revisit any report anytime.</p>
                    </div>
                </div>
            </section>

            {/* ── How It Works ── */}
            <section className="how-section">
                <div className="section-header">
                    <span className="section-tag">How It Works</span>
                    <h2>From Zero to <span className="highlight">Interview Ready</span> in 3 Steps</h2>
                </div>
                <div className="steps-list">
                    <div className="step">
                        <div className="step__number">01</div>
                        <div className="step__content">
                            <h3>Upload & Describe</h3>
                            <p>Paste the target job description and upload your PDF resume (or write a quick self-description if you don't have one handy).</p>
                        </div>
                    </div>
                    <div className="step-connector" />
                    <div className="step">
                        <div className="step__number">02</div>
                        <div className="step__content">
                            <h3>AI Analyzes Your Profile</h3>
                            <p>Our Gemini AI engine parses your resume, compares it to the JD, calculates a match score, and identifies gaps — all in about 30 seconds.</p>
                        </div>
                    </div>
                    <div className="step-connector" />
                    <div className="step">
                        <div className="step__number">03</div>
                        <div className="step__content">
                            <h3>Study Your Custom Plan</h3>
                            <p>Review your tailored questions with model answers, check the skill gap tags, follow the day-by-day roadmap, and download your optimized resume.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Use Cases ── */}
            <section className="usecases-section">
                <div className="section-header">
                    <span className="section-tag">Who Is This For?</span>
                    <h2>Built for Every <span className="highlight">Stage of Your Journey</span></h2>
                </div>
                <div className="usecases-grid">
                    <div className="usecase-card">
                        <span className="usecase-card__emoji">🎓</span>
                        <h4>Fresh Graduates</h4>
                        <p>Crack your first tech role with targeted prep even if you don't have a polished resume yet.</p>
                    </div>
                    <div className="usecase-card">
                        <span className="usecase-card__emoji">🏢</span>
                        <h4>Career Switchers</h4>
                        <p>Transition into a new tech domain with a clear map of the gaps you need to close.</p>
                    </div>
                    <div className="usecase-card">
                        <span className="usecase-card__emoji">⚡</span>
                        <h4>Senior Engineers</h4>
                        <p>Prepare for MAANG-level system design and behavioral rounds with senior-specific questions.</p>
                    </div>
                    <div className="usecase-card">
                        <span className="usecase-card__emoji">🌍</span>
                        <h4>International Applicants</h4>
                        <p>Align your profile with local market expectations and language used in the JD.</p>
                    </div>
                </div>
            </section>

            {/* ── Bottom CTA ── */}
            <section className="cta-section">
                <div className="cta-section__inner">
                    <h2>Ready to Get the Job?</h2>
                    <p>Join thousands of candidates who used SkillBridge AI to walk into interviews with full confidence.</p>
                    <Link to={user ? "/generate" : "/register"} className="btn-primary btn-primary--large">
                        {user ? "✨ Generate New Plan" : "🚀 Start For Free"}
                    </Link>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <div className="landing-footer__inner">
                    <div className="landing-footer__brand">
                        <span>🚀 SkillBridge AI</span>
                        <p>AI-powered interview preparation for the modern job seeker.</p>
                    </div>
                    <div className="landing-footer__links">
                        <Link to="/">Home</Link>
                        <Link to="/generate">New Plan</Link>
                        <Link to="/dashboard">Dashboard</Link>
                        {!user && <Link to="/register">Register</Link>}
                        {!user && <Link to="/login">Login</Link>}
                    </div>
                </div>
                <div className="landing-footer__bottom">
                    <p>© 2026 SkillBridge AI.</p>
                </div>
            </footer>
        </div>
    )
}

export default Landing


