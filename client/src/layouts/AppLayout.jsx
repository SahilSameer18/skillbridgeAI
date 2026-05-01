import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Outlet } from 'react-router';

const AppLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950">
            <Navbar />
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children ? children : <Outlet />}
            </main>
            <Footer />
        </div>
    );
};

export default AppLayout;
