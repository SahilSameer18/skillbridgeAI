import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Navigate } from 'react-router';
import LoadingScreen from '../common/LoadingScreen';


const Protected = ({ children }) => {

  const { loading, user } = useAuth();

  if (loading) {
    return (
      <LoadingScreen
        message="Verifying your credentials..."
        subtitle="Establishing a secure connection to your professional workspace."
      />
    )
  }

  if (!user) {
    return <Navigate to={'/login'} />
  }

  return children
}

export default Protected
