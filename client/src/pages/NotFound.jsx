import React from 'react'
import { Link, useNavigate } from 'react-router'
import './not-found.scss'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="not-found-page">
            <div className="not-found__code">404</div>
            <h1 className="not-found__title">Page Not Found</h1>
            <p className="not-found__subtitle">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="not-found__actions">
                <Link to="/" className="btn-home">
                    🏠 Go Home
                </Link>
                <button onClick={() => navigate(-1)} className="btn-back">
                    ← Go Back
                </button>
            </div>
        </div>
    )
}

export default NotFound
