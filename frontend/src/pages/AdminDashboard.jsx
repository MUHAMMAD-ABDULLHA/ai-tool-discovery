import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import ToolModeration from '../components/Admin/ToolModeration';
import UserManagement from '../components/Admin/UserManagement';
import ReviewManagement from '../components/Admin/ReviewManagement';
import AnalyticsDashboard from '../components/Admin/AnalyticsDashboard';
import MonetizationControl from '../components/Admin/MonetizationControl';
import ReportManagement from '../components/Admin/ReportManagement';

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Check if user is admin
    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
            <AdminSidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <main className={`flex-1 transition-all duration-300 p-8 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
                <Routes>
                    <Route index element={<AnalyticsDashboard />} />
                    <Route path="tools" element={<ToolModeration />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="reviews" element={<ReviewManagement />} />
                    <Route path="analytics" element={<AnalyticsDashboard />} />
                    <Route path="monetization" element={<MonetizationControl />} />
                    <Route path="reports" element={<ReportManagement />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminDashboard;
