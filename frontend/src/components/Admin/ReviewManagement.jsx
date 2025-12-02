import React, { useState, useEffect } from 'react';
import { getAllReviews, getReportedReviews, updateReviewStatus, bulkDeleteReviews } from '../../api/adminApi';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        loadReviews();
    }, [filter]);

    const loadReviews = async () => {
        setLoading(true);
        try {
            const data = filter === 'reported'
                ? await getReportedReviews()
                : await getAllReviews({ status: filter === 'all' ? undefined : filter });
            setReviews(data.data || []);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (reviewId, status) => {
        try {
            await updateReviewStatus(reviewId, status);
            loadReviews();
            alert(`Review ${status}`);
        } catch (error) {
            alert('Error updating review');
        }
    };

    const handleBulkDelete = async () => {
        if (selected.length === 0) return alert('No reviews selected');
        if (confirm(`Delete ${selected.length} selected reviews?`)) {
            try {
                await bulkDeleteReviews(selected);
                setSelected([]);
                loadReviews();
                alert('Reviews deleted');
            } catch (error) {
                alert('Error deleting reviews');
            }
        }
    };

    return (
        <div className="w-full">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
                <h1 className="text-white text-3xl font-bold mb-2">⭐ Review Management</h1>
                <p className="text-white/80">Moderate reviews and handle reports</p>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div className="flex gap-2">
                    {['pending', 'approved', 'reported', 'all'].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg capitalize ${filter === f ? 'bg-gradient-to-r from-primary to-primary-dark text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>{f}</button>
                    ))}
                </div>
                {selected.length > 0 && (
                    <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">Delete Selected ({selected.length})</button>
                )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl overflow-x-auto">
                {loading ? <p className="text-center py-8">Loading...</p> : reviews.length === 0 ? <p className="text-center py-8 text-neutral-500">No reviews found</p> : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-neutral-200">
                                <th className="p-3"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? reviews.map(r => r._id) : [])} /></th>
                                <th className="text-left p-3 font-semibold">Tool</th>
                                <th className="text-left p-3 font-semibold">User</th>
                                <th className="text-left p-3 font-semibold">Rating</th>
                                <th className="text-left p-3 font-semibold">Comment</th>
                                <th className="text-left p-3 font-semibold">Status</th>
                                <th className="text-left p-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr key={review._id} className="border-b border-neutral-100 hover:bg-neutral-50">
                                    <td className="p-3"><input type="checkbox" checked={selected.includes(review._id)} onChange={() => setSelected(prev => prev.includes(review._id) ? prev.filter(x => x !== review._id) : [...prev, review._id])} /></td>
                                    <td className="p-3 font-medium">{review.tool?.name || 'Unknown'}</td>
                                    <td className="p-3 text-sm">{review.user?.name || 'Unknown'}</td>
                                    <td className="p-3">{'⭐'.repeat(review.rating)}</td>
                                    <td className="p-3 max-w-xs truncate text-sm">{review.comment?.substring(0, 50)}...</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs ${review.status === 'approved' ? 'bg-green-100 text-green-800' : review.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{review.status}</span>
                                        {review.reported && <span className="ml-1 px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Reported</span>}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex gap-2">
                                            {review.status !== 'approved' && <button onClick={() => handleStatusChange(review._id, 'approved')} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm">✓</button>}
                                            {review.status !== 'rejected' && <button onClick={() => handleStatusChange(review._id, 'rejected')} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm">✗</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
