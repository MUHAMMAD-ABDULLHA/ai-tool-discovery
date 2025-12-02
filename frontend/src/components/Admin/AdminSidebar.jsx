import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ collapsed, onToggle }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Analytics', exact: true },
        { path: '/admin/tools', icon: '🔧', label: 'Tool Moderation' },
        { path: '/admin/users', icon: '👥', label: 'User Management' },
        { path: '/admin/reviews', icon: '⭐', label: 'Reviews' },
        { path: '/admin/monetization', icon: '💰', label: 'Monetization' }
    ];

    const isActive = (item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    return (
        <aside className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 shadow-2xl flex flex-col transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-72'}`}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className={`text-white font-bold text-xl transition-all ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    Admin Dashboard
                </h2>
                <button
                    onClick={onToggle}
                    className="bg-white/10 hover:bg-white/20 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                >
                    {collapsed ? '→' : '←'}
                </button>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-5 py-3 rounded-xl mb-2 transition-all ${isActive(item)
                                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <span className="text-2xl">{item.icon}</span>
                        {!collapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <Link to="/dashboard" className="flex items-center gap-4 px-5 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all">
                    <span className="text-2xl">🏠</span>
                    {!collapsed && <span className="font-medium">Main Dashboard</span>}
                </Link>
            </div>
        </aside>
    );
};

export default AdminSidebar;
