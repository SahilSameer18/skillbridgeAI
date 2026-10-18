import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Outlet, useLocation } from 'react-router';

const AppLayout = ({ children }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    const isLanding = pathname === '/';

    return (
        <div className="min-h-screen w-full max-w-full flex flex-col bg-background overflow-x-clip font-sans selection:bg-accent/30 selection:text-white">
            <Navbar />
            <main
                key={pathname}
                className={`page-enter flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
                    isLanding ? 'py-0' : 'py-6 sm:py-8'
                }`}
            >
                {children ? children : <Outlet />}
            </main>
            <Footer />
        </div>
    );
};

export default AppLayout;


