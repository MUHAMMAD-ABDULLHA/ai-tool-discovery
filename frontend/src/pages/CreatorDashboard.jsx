import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { Edit, Trash2, BarChart2, TrendingUp, Plus } from 'lucide-react';
import PremiumListingModal from '../components/PremiumListingModal';
import ToolEditModal from '../components/ToolEditModal';

const CreatorDashboard = () => {
    const { token, user } = useSelector((state) => state.auth);
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTool, setSelectedTool] = useState(null);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchMyTools();
    }, []);

    const fetchMyTools = async () => {
        try {
            const response = await axios.get('/tools/user/my-tools', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTools(response.data.tools);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching tools:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (toolId) => {
        if (window.confirm("Are you sure you want to delete this tool? This action cannot be undone.")) {
            try {
                await axios.delete(`/tools/${toolId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTools(tools.filter(t => t._id !== toolId));
            } catch (error) {
                console.error("Error deleting tool:", error);
                alert("Failed to delete tool");
            }
        }
    };

    const handlePromote = (tool) => {
        setSelectedTool(tool);
        setShowPremiumModal(true);
    };

    const handleEdit = (tool) => {
        setSelectedTool(tool);
        setShowEditModal(true);
    };

    const getStatusBadge = (status) => {
        const styles = {
            approved: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            rejected: "bg-red-100 text-red-800"
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage your AI tools and track performance</p>
                    </div>
                    <Link
                        to="/tools/new"
                        className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition"
                    >
                        <Plus size={20} />
                        Submit New Tool
                    </Link>
                </div>

                {tools.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tools submitted yet</h3>
                        <p className="text-gray-500 mb-6">Start by submitting your first AI tool to the platform.</p>
                        <Link
                            to="/tools/new"
                            className="text-primary font-medium hover:underline"
                        >
                            Submit a tool now
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monetization</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tools.map((tool) => (
                                        <tr key={tool._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img
                                                        src={tool.logo || "https://via.placeholder.com/40"}
                                                        alt={tool.name}
                                                        className="h-10 w-10 rounded-lg object-cover mr-3"
                                                    />
                                                    <div>
                                                        <div className="font-medium text-gray-900">{tool.name}</div>
                                                        <div className="text-sm text-gray-500">{tool.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(tool.status)}
                                                {tool.rejectionReason && (
                                                    <p className="text-xs text-red-500 mt-1 max-w-[150px] truncate" title={tool.rejectionReason}>
                                                        {tool.rejectionReason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <span className="font-medium">{tool.averageRating?.toFixed(1) || "0.0"}</span>
                                                        <span className="text-yellow-400">★</span>
                                                        <span className="text-gray-400">({tool.ratingCount || 0})</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {tool.featured ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Featured until {new Date(tool.featuredUntil).toLocaleDateString()}
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePromote(tool)}
                                                        disabled={tool.status !== 'approved'}
                                                        className={`text-sm font-medium ${tool.status === 'approved'
                                                                ? 'text-purple-600 hover:text-purple-700'
                                                                : 'text-gray-400 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        Promote Tool
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-3">
                                                <Link
                                                    to={`/tools/${tool._id}/analytics`}
                                                    className="text-gray-400 hover:text-blue-600 inline-block"
                                                    title="Analytics"
                                                >
                                                    <BarChart2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleEdit(tool)}
                                                    className="text-gray-400 hover:text-gray-600"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tool._id)}
                                                    className="text-gray-400 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {showPremiumModal && selectedTool && (
                <PremiumListingModal
                    tool={selectedTool}
                    onClose={() => setShowPremiumModal(false)}
                />
            )}

            {showEditModal && selectedTool && (
                <ToolEditModal
                    tool={selectedTool}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={() => {
                        fetchMyTools();
                        setShowEditModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default CreatorDashboard;
