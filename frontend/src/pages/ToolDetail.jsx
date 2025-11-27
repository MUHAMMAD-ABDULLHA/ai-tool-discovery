// src/pages/ToolDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import useAuthStore from '../store/AuthStore';
import {Link} from 'react-router-dom';

const ToolDetail = () => {
  const { toolId } = useParams();
  const [tool, setTool] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();
  
  // State for new review form
  const [newReview, setNewReview] = useState({ title: '', comment: '', rating: 5 });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [toolRes, reviewsRes] = await Promise.all([
          axios.get(`/tools/${toolId}`), // You'd need to add this API route
          axios.get(`/reviews/tools/${toolId}`)
        ]);
        setTool(toolRes.data);
        setReviews(reviewsRes.data);
        console.log(reviewsRes.data);
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
          setReviews([...reviews, res.data]);
          setNewReview({ title: '', comment: '', rating: 5 });
      } catch (err) {
          console.error('Failed to submit review.', err);
      }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!tool) return <div className="text-center p-8">Tool not found.</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center mb-4">
          <img src={tool.logo} alt={`${tool.name} logo`} className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
            <p className="text-md text-gray-500">{tool.category.replace('_', ' ')}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{tool.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tool.useCases.map((useCase, index) => (
            <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {useCase}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500"><strong>Pricing:</strong> {tool.pricing}</p>
        <div className="mt-6">
          <a href={tool.link} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            Visit Tool
          </a>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {user ? (
          <form onSubmit={handleReviewSubmit} className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" value={newReview.title} onChange={(e) => setNewReview({ ...newReview, title: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Comment</label>
              <textarea value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <select value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm" required>
                {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Submit Review</button>
          </form>
        ) : (
          <p className="text-center text-gray-600">Please <Link to="/login" className="text-indigo-600 hover:underline">log in</Link> to leave a review.</p>
        )}
        
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">{review.title}</h4>
                  <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-1">Reviewed by: {review.user?.name || 'Anonymous'}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ToolDetail;