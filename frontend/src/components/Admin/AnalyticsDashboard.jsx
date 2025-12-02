import React, { useState, useEffect } from 'react';
import { getPlatformStats, getToolPopularity, getSignupsOverTime, getBounceRate, getTopSearches, getReviewStats } from '../../api/adminApi';

const AnalyticsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [topTools, setTopTools] = useState([]);
    const [signups, setSignups] = useState([]);
    const [bounceRate, setBounceRate] = useState(null);
    const [topSearches, setTopSearches] = useState([]);
    const [reviewStats, setReviewStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [days, setDays] = useState(30);

    useEffect(() => {
        loadData();
    }, [days]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Loading analytics data...');

            const [statsData, toolsData, signupsData, bounceData, searchesData, reviewsData] = await Promise.all([
                getPlatformStats(),
                getToolPopularity({ days, limit: 10 }),
                getSignupsOverTime({ days }),
                getBounceRate({ days }),
                getTopSearches({ days, limit: 10 }),
                getReviewStats({ days })
            ]);

            console.log('✅ Analytics data loaded:', { statsData, toolsData });

            setStats(statsData);
            setTopTools(toolsData.popularTools || []);
            setSignups(signupsData.signups || []);
            setBounceRate(bounceData);
            setTopSearches(searchesData.topSearches || []);
            setReviewStats(reviewsData);
        } catch (error) {
            console.error('❌ Error loading analytics:', error);
            setError(error.response?.data?.message || 'Failed to load analytics data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-white text-xl">Loading analytics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/20 border border-red-500 text-white p-6 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Error Loading Analytics</h3>
                <p>{error}</p>
                <button onClick={loadData} className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
                <h1 className="text-white text-3xl font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-white/80">Monitor your platform's performance and metrics</p>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-3 mb-8">
                {[7, 30, 90].map(d => (
                    <button
                        key={d}
                        onClick={() => setDays(d)}
                        className={`px-6 py-2 rounded-lg transition-all ${days === d
                                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        Last {d} Days
                    </button>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">👥</div>
                        <div>
                            <h3 className="text-3xl font-bold text-neutral-900">{stats?.totalUsers || 0}</h3>
                            <p className="text-neutral-600 text-sm">Total Users</p>
                            <span className="text-green-600 text-xs font-semibold">+{stats?.newUsersLast30Days || 0} this month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">🔧</div>
                        <div>
                            <h3 className="text-3xl font-bold text-neutral-900">{stats?.approvedTools || 0}</h3>
                            <p className="text-neutral-600 text-sm">Approved Tools</p>
                            <span className="text-blue-600 text-xs font-semibold">+{stats?.newToolsLast30Days || 0} this month</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">⏳</div>
                        <div>
                            <h3 className="text-3xl font-bold text-orange-600">{stats?.pendingTools || 0}</h3>
                            <p className="text-neutral-600 text-sm">Pending Approval</p>
                            <span className="text-orange-600 text-xs font-semibold">Needs attention</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">⭐</div>
                        <div>
                            <h3 className="text-3xl font-bold text-neutral-900">{reviewStats?.totalReviews || 0}</h3>
                            <p className="text-neutral-600 text-sm">Total Reviews</p>
                            <span className="text-yellow-600 text-xs font-semibold">Avg: {reviewStats?.averageRating || 0} ⭐</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">✅</div>
                        <div>
                            <h3 className="text-3xl font-bold text-neutral-900">{stats?.activeUsers || 0}</h3>
                            <p className="text-neutral-600 text-sm">Active Users</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">📉</div>
                        <div>
                            <h3 className="text-3xl font-bold text-neutral-900">{bounceRate?.bounceRate || 0}%</h3>
                            <p className="text-neutral-600 text-sm">Bounce Rate</p>
                            <span className="text-neutral-600 text-xs">{bounceRate?.totalSessions || 0} sessions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Tools */}
            <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">🏆 Top Performing Tools</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-neutral-200">
                                <th className="text-left p-3 font-semibold text-neutral-700">Rank</th>
                                <th className="text-left p-3 font-semibold text-neutral-700">Tool</th>
                                <th className="text-left p-3 font-semibold text-neutral-700">Category</th>
                                <th className="text-left p-3 font-semibold text-neutral-700">Impressions</th>
                                <th className="text-left p-3 font-semibold text-neutral-700">Clicks</th>
                                <th className="text-left p-3 font-semibold text-neutral-700">Engagements</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topTools.length > 0 ? topTools.map((item, index) => (
                                <tr key={item._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="p-3">#{index + 1}</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {item.tool?.logo && <img src={item.tool.logo} alt={item.tool?.name} className="w-10 h-10 rounded-lg object-cover" />}
                                            <span className="font-medium">{item.tool?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-neutral-600">{item.tool?.category || 'N/A'}</td>
                                    <td className="p-3">{item.impressions}</td>
                                    <td className="p-3">{item.clicks}</td>
                                    <td className="p-3">{item.engagements}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center text-neutral-500">No tool data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Searches */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">🔍 Top Search Queries</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-neutral-200">
                                <th className="text-left p-3 font-semibold text-neutral-700">Rank</th>
                                <th className="text-left p-3 font-semibold text-neutral-700">Query</th>
                                <th className="text-left p-3 font-semibold text-neutral-700">Search Count</th>
                                <th className="text-left p-3 font-semibold text-neutral-700">Avg Results</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topSearches.length > 0 ? topSearches.map((search, index) => (
                                <tr key={index} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="p-3">#{index + 1}</td>
                                    <td className="p-3 font-semibold text-neutral-900">{search.query}</td>
                                    <td className="p-3">{search.count}</td>
                                    <td className="p-3">{search.avgResults}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-neutral-500">No search data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
