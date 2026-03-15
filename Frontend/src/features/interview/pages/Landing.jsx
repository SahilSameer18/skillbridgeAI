import React from 'react'
import { Link } from 'react-router'
import '../style/landing.scss'

const Landing = () => {
    return (
        <div className="landing-page">
            <header className="hero">
                <div className="hero-content">
                    <h1>Master Your Next <span className="highlight">Technical Interview</span></h1>
                    <p className="subtitle">
                        Upload your resume and the target job description. Our AI analyzes your 
                        profile to generate tailored technical questions, identify skill gaps, and 
                        build a custom multi-day preparation plan.
                    </p>
                    <div className="cta-container">
                        <Link to="/generate" className="btn-primary">
                            Generate My Plan Now
                        </Link>
                        <Link to="/dashboard" className="btn-secondary">
                            View Saved Reports
                        </Link>
                    </div>
                </div>
            </header>

            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🔍</div>
                        <h3>Deep Profiling</h3>
                        <p>We intelligently parse your uploaded PDF resume and extract vital skills to match against your target JD.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>AI-Generated Questions</h3>
                        <p>Get a comprehensive list of high-probability technical and behavioral questions tailored to the position.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">📈</div>
                        <h3>Targeted Feedback</h3>
                        <p>Identify critical skill gaps and receive a multi-day structured preparation roadmap to close them.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Landing

