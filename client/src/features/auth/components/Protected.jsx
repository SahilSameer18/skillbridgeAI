import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router';
import '../auth.form.scss';


const Protected = ({ children }) => {

  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="spinner"></div>
        <h2>Loading...</h2>
      </main>
    )
  }

  if (!user) {
    return <Navigate to={'/login'} />
  }

  return children
}

export default Protected