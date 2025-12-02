import React, { useState, useEffect } from 'react';
import { getFeaturedTools, setFeaturedTool, removeFeaturedTool, getSponsoredTools, setSponsoredTool } from '../../api/adminApi';

const MonetizationControl = () => {
    const [featuredTools, setFeaturedTools] = useState([]);
    const [sponsoredTools, setSponsoredTools] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [featured, sponsored] = await Promise.all([getFeaturedTools(), getSponsoredTools()]);
            setFeaturedTools(featured.featuredTools || []);
            setSponsoredTools(sponsored.sponsoredTools || []);
        } catch (error) {
            console.error('Error loading monetization data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetFeatured = async () => {
        const toolId = prompt('Enter Tool ID to feature:');
        const date = prompt('Feature until (YYYY-MM-DD) or leave empty:');
        if (toolId) {
            try {
                await setFeaturedTool(toolId, date || null);
                loadData();
                alert('Tool featured');
            } catch (error) {
                alert('Error featuring tool');
            }
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
                <h1 className="text-black text-3xl font-bold mb-2">💰 Monetization Control</h1>
                <p className="text-black/80">Manage featured placements and sponsored content</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-neutral-900">Featured Tools</h2>
                    <button onClick={handleSetFeatured} className="px-4 py-2 bg-primary hover:bg-primary-dark text-black rounded-lg">+ Add Featured Tool</button>
                </div>
                {loading ? <p className="text-center py-8">Loading...</p> : featuredTools.length === 0 ? <p className="text-center py-8 text-neutral-500">No featured tools</p> : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-neutral-200">
                                <th className="text-left p-3 font-semibold">Tool</th>
                                <th className="text-left p-3 font-semibold">Category</th>
                                <th className="text-left p-3 font-semibold">Featured Until</th>
                                <th className="text-left p-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {featuredTools.map((tool) => (
                                <tr key={tool._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {tool.logo && <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-lg" />}
                                            <span className="font-semibold">{tool.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3">{tool.category || 'N/A'}</td>
                                    <td className="p-3">{tool.featuredUntil ? new Date(tool.featuredUntil).toLocaleDateString() : 'Indefinite'}</td>
                                    <td className="p-3">
                                        <button onClick={async () => { await removeFeaturedTool(tool._id); loadData(); }} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-black rounded">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-neutral-900">Sponsored Tools</h2>
                    <button onClick={async () => {
                        const toolId = prompt('Enter Tool ID:');
                        const sponsor = prompt('Sponsor name:');
                        if (toolId && sponsor) { await setSponsoredTool(toolId, sponsor); loadData(); }
                    }} className="px-4 py-2 bg-primary hover:bg-primary-dark text-black rounded-lg">+ Add Sponsored Tool</button>
                </div>
                {loading ? <p className="text-center py-8">Loading...</p> : sponsoredTools.length === 0 ? <p className="text-center py-8 text-neutral-500">No sponsored tools</p> : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-neutral-200">
                                <th className="text-left p-3 font-semibold">Tool</th>
                                <th className="text-left p-3 font-semibold">Category</th>
                                <th className="text-left p-3 font-semibold">Sponsored By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sponsoredTools.map((tool) => (
                                <tr key={tool._id} className="border-b border-neutral-100">
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            {tool.logo && <img src={tool.logo} alt={tool.name} className="w-10 h-10 rounded-lg" />}
                                            <span className="font-semibold">{tool.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3">{tool.category || 'N/A'}</td>
                                    <td className="p-3">{tool.sponsoredBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MonetizationControl;
