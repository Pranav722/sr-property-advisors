import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const BottomNav = () => {
    const location = useLocation();
    
    // Hide bottom nav on specific routes (e.g. login or admin panels)
    if (
        location.pathname === '/login' ||
        location.pathname === '/signup' ||
        location.pathname.includes('/projects-admin') ||
        location.pathname.includes('/file-manager') ||
        location.pathname.includes('/inventory') ||
        location.pathname.includes('/locations') ||
        location.pathname.includes('/leads') ||
        location.pathname === '/dashboard'
    ) {
        return null;
    }

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 md:hidden flex justify-between items-center px-6 py-3 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                <i className="ri-home-5-line text-2xl"></i>
                <span className="text-[10px] font-medium">Home</span>
            </NavLink>
            
            <NavLink to="/projects" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                <i className="ri-building-2-line text-2xl"></i>
                <span className="text-[10px] font-medium">Projects</span>
            </NavLink>
            
            <NavLink to="/services" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                <i className="ri-briefcase-4-line text-2xl"></i>
                <span className="text-[10px] font-medium">Services</span>
            </NavLink>

            <NavLink to="/contact" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                <i className="ri-chat-3-line text-2xl"></i>
                <span className="text-[10px] font-medium">Contact</span>
            </NavLink>
            
            <NavLink to="/login" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                <i className="ri-user-3-line text-2xl"></i>
                <span className="text-[10px] font-medium">Account</span>
            </NavLink>
        </nav>
    );
};

export default BottomNav;
