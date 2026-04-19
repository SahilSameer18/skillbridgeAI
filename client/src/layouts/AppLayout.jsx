import React from 'react';
import Navbar from '../components/common/Navbar';
import { Outlet } from 'react-router';

const AppLayout = ({ children }) => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                {children ? children : <Outlet />}
            </main>
        </div>
    );
};

export default AppLayout;
