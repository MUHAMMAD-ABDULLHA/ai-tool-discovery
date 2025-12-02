import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ collapsed, onToggle }) => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: '📊', label: 'Analytics', exact: true },
        { path: '/admin/tools', icon: '🔧', label: 'Tool Moderation' },
        { path: '/admin/users', icon: '👥', label: 'User Management' },
        { path: '/admin/categories', icon: '📁', label: 'Categories' },
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
        <aside className={`fixed left-0 top-0 h-screen bg-card border-r border-border shadow-2xl flex flex-col transition-all duration-300 z-50 ${collapsed ? 'w-20' : 'w-72'}`}>
            <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className={`text-card-foreground font-bold text-xl transition-all ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    Admin Dashboard
                </h2>
                <button
                    onClick={onToggle}
                    className="bg-secondary hover:bg-secondary/80 text-secondary-foreground w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer"
                >
                    {collapsed ? '→' : '←'}
                </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 p-3 rounded-lg transition-colors group ${isActive(item) ? 'bg-accent-faded text-primary font-medium' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'} ${collapsed ? 'justify-center' : ''}`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className={`whitespace-nowrap transition-all ${collapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                            {item.label}
                        </span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;
