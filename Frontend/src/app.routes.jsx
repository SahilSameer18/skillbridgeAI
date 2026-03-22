import { createBrowserRouter } from 'react-router';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Protected from './features/auth/components/Protected';
import Home from './features/interview/pages/Home';
import Landing from './features/interview/pages/Landing';
import Interview from './features/interview/pages/Interview';
import Dashboard from './features/interview/pages/Dashboard';
import Layout from './features/interview/components/Layout';
import NotFound from './features/interview/pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    // Layout wraps everything (Navbar + Outlet)
    path: '/',
    element: <Layout />,
    children: [
      {
        // Landing is PUBLIC — no Protected wrapper
        index: true,
        element: <Landing />,
      },
      {
        // All app routes below require login
        path: '/generate',
        element: (
          <Protected>
            <Home />
          </Protected>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: '/interview/:interviewId',
        element: (
          <Protected>
            <Interview />
          </Protected>
        ),
      },
      {
        // Catch-all 404 inside the layout (keeps Navbar visible)
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])