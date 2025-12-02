import React, { useState, useEffect } from 'react';
import { getPendingTools, getAllTools, approveTool, rejectTool, deleteTool } from '../../api/adminApi';

const ToolModeration = () => {
    const [tools, setTools] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadTools();
    }, [filter]);

    const loadTools = async () => {
        setLoading(true);
        try {
            const data = filter === 'pending'
                ? await getPendingTools()
                : await getAllTools({ status: filter !== 'all' ? filter : undefined });
            setTools(data.tools || []);
        } catch (error) {
            console.error('Error loading tools:', error);
            alert(error.response?.data?.message || 'Error loading tools');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (toolId) => {
        if (confirm('Approve this tool?')) {
            try {
                await approveTool(toolId);
                loadTools();
                alert('Tool approved successfully!');
            } catch (error) {
                alert('Error approving tool');
            }
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        try {
            await rejectTool(rejectModal, rejectReason);
            setRejectModal(null);
            setRejectReason('');
            loadTools();
            alert('Tool rejected');
        } catch (error) {
            alert('Error rejecting tool');
        }
    };

    const handleDelete = async (toolId) => {
        if (confirm('Are you sure you want to delete this tool? This cannot be undone.')) {
            try {
                await deleteTool(toolId);
                loadTools();
                alert('Tool deleted');
            } catch (error) {
                alert('Error deleting tool');
            }
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
                <h1 className="text-white text-3xl font-bold mb-2">🔧 Tool Moderation</h1>
                <p className="text-white/80">Approve, reject, or manage tool submissions</p>
            </div>

            <div className="flex gap-3 mb-8">
                {['pending', 'approved', 'rejected', 'all'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-6 py-2 rounded-lg capitalize transition-all ${filter === f
                                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
                {loading ? (
                    <p className="text-center py-8">Loading tools...</p>
                ) : tools.length === 0 ? (
                    <p className="text-center py-8 text-neutral-500">No tools found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-neutral-200">
                                    <th className="text-left p-3 font-semibold text-neutral-700">Tool</th>
                                    <th className="text-left p-3 font-semibold text-neutral-700">Category</th>
                                    <th className="text-left p-3 font-semibold text-neutral-700">Submitted By</th>
                                    <th className="text-left p-3 font-semibold text-neutral-700">Status</th>
                                    <th className="text-left p-3 font-semibold text-neutral-700">Date</th>
                                    <th className="text-left p-3 font-semibold text-neutral-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tools.map((tool) => (
                                    <tr key={tool._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                        <td className="p-3">
                                            <div className="flex items-center gap-3">
                                                {tool.logo && <img src={tool.logo} alt={tool.name} className="w-12 h-12 rounded-lg object-cover" />}
                                                <div>
                                                    <div className="font-semibold">{tool.name}</div>
                                                    <div className="text-sm text-neutral-600">{tool.description?.substring(0, 40)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-3">{tool.category || 'N/A'}</td>
                                        <td className="p-3">{tool.userId?.name || 'Unknown'}</td>
                                        <td className="p-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${tool.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    tool.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {tool.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm">{new Date(tool.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                {tool.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleApprove(tool._id)} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm">
                                                            ✓ Approve
                                                        </button>
                                                        <button onClick={() => setRejectModal(tool._id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm">
                                                            ✗ Reject
                                                        </button>
                                                    </>
                                                )}
                                                <button onClick={() => handleDelete(tool._id)} className="px-3 py-1 bg-red-400 hover:bg-red-500 text-white rounded-lg text-sm">
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setRejectModal(null)}>
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-2xl font-bold mb-4 text-neutral-900">Reject Tool</h2>
                        <textarea
                            placeholder="Reason for rejection..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            rows="4"
                            className="w-full p-3 border border-neutral-300 rounded-lg mb-4"
                        />
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => setRejectModal(null)} className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleReject} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                                Reject Tool
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolModeration;
