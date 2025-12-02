import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import { Bookmark, Flag } from 'lucide-react';
import SaveToolModal from '../components/SaveToolModal';
import useBookmarks from '../hooks/Bookmarks';
import ToolRecommendations from '../components/ToolRecommendations';

const ToolDetail = () => {
  const { toolId } = useParams();
  const [tool, setTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [newReview, setNewReview] = useState({ title: '', comment: '', rating: 5 });

  // Bookmark logic
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const { bookmarks } = useBookmarks();
  const isSaved = bookmarks.some(collection =>
    collection.tools?.some(t => t.tool === toolId || t.tool._id === toolId)
  );

  // Report logic
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState({ reason: 'broken_link', description: '' });

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/tools/${toolId}/report`, reportData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsReportModalOpen(false);
      alert("Report submitted successfully. Thank you!");
      setReportData({ reason: 'broken_link', description: '' });
    } catch (error) {
      console.error("Report error:", error);
      alert("Failed to submit report. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [toolRes, reviewsRes] = await Promise.all([
          axios.get(`/tools/${toolId}`),
          axios.get(`/reviews/tools/${toolId}`)
        ]);
        setTool(toolRes.data);
        // Check if reviews response has data array
        setReviews(reviewsRes.data.data || reviewsRes.data || []);
      } catch (err) {
        setError('Failed to load tool or reviews.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toolId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/reviews/tools/${toolId}`, newReview);
      // Backend returns { success, message, data: reviewObject }
      if (res.data.success && res.data.data) {
        setReviews([...reviews, res.data.data]);
        setNewReview({ title: '', comment: '', rating: 5 });
        alert(res.data.message || 'Review submitted successfully!');
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit review';
      alert(errorMsg);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!tool) return <div className="text-center p-8">Tool not found.</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center mb-4">
            {tool.logo && <img src={tool.logo} alt={`${tool.name} logo`} className="w-16 h-16 rounded-full mr-4" />}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
              <p className="text-md text-gray-500">{tool.category?.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Save Button */}
          {user && (
            <button
              onClick={() => setIsSaveModalOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title={isSaved ? "Saved to collection" : "Save to collection"}
            >
              <Bookmark
                size={32}
                className={isSaved ? "fill-black text-black" : "text-gray-400"}
              />
            </button>
          )}
        </div>

        <p className="text-gray-700 mb-4">{tool.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.useCases?.map((useCase, index) => (
            <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {useCase}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500"><strong>Pricing:</strong> {tool.pricing}</p>

        {/* Integrations */}
        {tool.integrationOptions && tool.integrationOptions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Integrations:</h3>
            <div className="flex flex-wrap gap-2">
              {tool.integrationOptions.map((option, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-green-200">
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <a href={tool.link} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            Visit Tool
          </a>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="text-gray-400 hover:text-red-500 text-sm flex items-center gap-1"
          >
            <Flag size={16} /> Report Issue
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {user ? (
          <form onSubmit={handleReviewSubmit} className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="3"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
                maxLength={1000}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              >
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-600">
            Please <Link to="/login" className="text-indigo-600 hover:underline">log in</Link> to leave a review.
          </p>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{review.title}</h4>
                  <span className="text-yellow-500">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Reviewed by: {review.user?.name || 'Anonymous'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Recommendations */}
      <ToolRecommendations category={tool.category} currentToolId={tool._id} />

      {/* Save Modal */}
      <SaveToolModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        toolId={toolId}
      />

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Report Issue</h3>
            <form onSubmit={handleReportSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Reason</label>
                <select
                  className="w-full border rounded p-2"
                  value={reportData.reason}
                  onChange={e => setReportData({ ...reportData, reason: e.target.value })}
                >
                  <option value="broken_link">Broken Link</option>
                  <option value="inappropriate_content">Inappropriate Content</option>
                  <option value="incorrect_info">Incorrect Information</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="w-full border rounded p-2"
                  rows="3"
                  value={reportData.description}
                  onChange={e => setReportData({ ...reportData, description: e.target.value })}
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolDetail;