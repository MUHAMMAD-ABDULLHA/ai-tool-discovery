import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { ArrowLeft, Eye, MousePointer, Star, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ToolAnalytics = () => {
    const { toolId } = useParams();
    const { token } = useSelector((state) => state.auth);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [toolId]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`/tools/${toolId}/analytics`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading analytics...</div>;
    if (!data) return <div className="p-8 text-center">Analytics not found</div>;

    const { tool, analytics, reviews } = data;

    // Process events for summary cards
    const impressions = analytics.events.find(e => e._id === 'impression')?.count || 0;
    const clicks = analytics.events.find(e => e._id === 'click')?.count || 0;
    const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : 0;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/creator/dashboard" className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Dashboard
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <img
                            src={tool.logo || "https://via.placeholder.com/48"}
                            alt={tool.name}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{tool.name} Analytics</h1>
                            <p className="text-gray-500">Performance overview for the last 30 days</p>
                        </div>
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
                            <Eye size={20} className="text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{impressions}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-500">Website Clicks</h3>
                            <MousePointer size={20} className="text-green-500" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{clicks}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-500">Click-Through Rate</h3>
                            <div className="text-purple-500 font-bold">%</div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{ctr}%</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-500">Avg Rating</h3>
                            <Star size={20} className="text-yellow-400" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                            {tool.averageRating?.toFixed(1) || "0.0"}
                            <span className="text-sm text-gray-400 font-normal ml-2">
                                ({reviews.length} reviews)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Views Over Time</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analytics.dailyViews}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="_id"
                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#4F46E5"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Reviews */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">Recent Reviews</h3>
                    </div>
                    {reviews.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No reviews yet</div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {reviews.map((review) => (
                                <div key={review._id} className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium text-gray-900">{review.user?.name || "Anonymous"}</div>
                                            <span className="text-gray-400">•</span>
                                            <div className="text-sm text-gray-500">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                                            <Star size={14} className="text-yellow-400 fill-current mr-1" />
                                            <span className="font-medium text-yellow-700">{review.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ToolAnalytics;
