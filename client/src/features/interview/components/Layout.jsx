import React from 'react';
import Navbar from '../../auth/components/Navbar';
import { Outlet } from 'react-router';

const Layout = ({ children }) => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                {children ? children : <Outlet />}
            </main>
        </div>
    );
};

export default Layout;
