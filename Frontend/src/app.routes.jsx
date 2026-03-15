import { createBrowserRouter } from 'react-router';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Protected from './features/auth/components/Protected';
import Home from './features/interview/pages/Home';
import Landing from './features/interview/pages/Landing';
import Interview from './features/interview/pages/Interview';
import Dashboard from './features/interview/pages/Dashboard';
import Layout from './features/interview/components/Layout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/',
    element: (
      <Protected>
        <Layout />
      </Protected>
    ),
    children: [
      {
        path: '/',
        element: <Landing />
      },
      {
        path: '/generate',
        element: <Home />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/interview/:interviewId',
        element: <Interview />
      }
    ]
  }
])