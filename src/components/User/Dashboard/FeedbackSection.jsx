/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import OverviewSection from './OverviewSection';
import { toast } from 'react-toastify';

const FeedbackSection = ({ events = [], setActiveTab, overview = false }) => {
  // User token from Redux store
  const token = useSelector(state => state.auth?.token);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [comment, setComment] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [userReviews, setUserReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's existing reviews on component mount
  useEffect(() => {
    if (!overview && token) {
      fetchUserReviews();
    }
  }, [overview, token]);

  const fetchUserReviews = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reviews/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (response.data?.success) {
        setUserReviews(response.data.reviews || []);
      } else {
        setUserReviews([]);
      }
    } catch (error) {
      toast.error('Failed to fetch your reviews. Please try again later.',error);
      setUserReviews([]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleEventChange = (e) => {
    setSelectedEventId(e.target.value);

    // Clear previous review data if user already reviewed this event
    const existingReview = userReviews.find(review => review.eventId === e.target.value);
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(0);
      setComment('');
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedEventId || !rating) {
      setSubmitStatus('error');
      setErrorMessage('Please select an event and provide a rating');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      console.log(`Submitting review to: ${import.meta.env.VITE_API_URL}/api/v1/reviews`);
      console.log('Review data:', { eventId: selectedEventId, rating, comment });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/reviews`,
        {
          eventId: selectedEventId,
          rating,
          comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Submit review response:', response.data);

      if (response.data?.success) {
        setSubmitStatus('success');

        // Refresh reviews after submission
        fetchUserReviews();

        // Reset form after a delay
        setTimeout(() => {
          setRating(0);
          setComment('');
          setSelectedEventId('');
          setSubmitStatus(null);
        }, 3000);
      } else {
        throw new Error(response.data?.message || 'Failed to submit review');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error.response?.data?.message || error.message || 'An error occurred while submitting your review');
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => (
    <div className="flex gap-2 mb-4 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.div
          key={star}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => handleStarClick(star)}
        >
          <Star
            size={24}
            className={`${(hoverRating || rating) >= star ? 'fill-cyan-500 text-cyan-500' : 'text-gray-500'} cursor-pointer`}
          />
        </motion.div>
      ))}
    </div>
  );

  // For the overview mode (simplified version)
  if (overview) {
    return (
      <OverviewSection title="Feedback & Reviews" icon="message">
        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg">
          <p className="font-medium text-white mb-3">Share your experience</p>
          {renderStars()}
          <motion.button
            className="w-full px-6 py-3 rounded-xl bg-cyan-400 text-black font-medium transition-colors cursor-pointer hover:bg-black hover:text-cyan-400 hover:border hover:border-cyan-400"
            onClick={() => setActiveTab('feedback')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Write a Review
          </motion.button>
        </div>
      </OverviewSection>
    );
  }

  // For detailed mode
  return (
    <motion.div
      className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-800/50"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Feedback & Reviews</h2>

      {/* Review Form */}
      <div className="p-6 bg-black/30 backdrop-blur-sm rounded-lg mb-6">
        <p className="font-medium text-white mb-4">Share your experience</p>
        <div className="space-y-6">
          <div className="relative">
            <select
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              value={selectedEventId}
              onChange={handleEventChange}
              disabled={isSubmitting}
            >
              <option value="">Select an event to review</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            {userReviews.some(review => review.eventId === selectedEventId) && (
              <span className="absolute right-3 top-3 text-xs text-cyan-500">
                You've already reviewed this event
              </span>
            )}
          </div>

          {renderStars()}

          <textarea
            className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            rows="4"
            placeholder="Share your thoughts about this event..."
            value={comment}
            onChange={handleCommentChange}
            disabled={isSubmitting}
          ></textarea>

          <AnimatePresence>
            {submitStatus === 'error' && (
              <motion.div
                className="bg-red-900/30 border border-red-500 rounded-lg p-3 flex items-start gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{errorMessage}</p>
              </motion.div>
            )}

            {submitStatus === 'success' && (
              <motion.div
                className="bg-green-900/30 border border-green-500 rounded-lg p-3 flex items-start gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-200">Your review has been submitted successfully!</p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-black px-4 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-cyan-700 transition-colors flex items-center justify-center gap-2"
            onClick={handleSubmit}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader size={18} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Review</span>
            )}
          </motion.button>
        </div>
      </div>

      {/* User's Previous Reviews */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4 text-white">Your Reviews</h3>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader size={24} className="animate-spin text-cyan-500" />
          </div>
        ) : userReviews.length > 0 ? (
          <div className="space-y-4">
            {userReviews.map((review, index) => (
              <motion.div
                key={review._id || index}
                className="p-4 bg-black/30 rounded-lg border border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-cyan-400">{review.eventName || events.find(e => e.id === review.eventId)?.title || 'Unknown Event'}</h4>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= review.rating ? "fill-cyan-500 text-cyan-500" : "text-gray-700"}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && <p className="mt-2 text-sm text-gray-400">{review.comment}</p>}
                <div className="mt-2 text-xs text-gray-500">
                  Submitted on {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-black/30 rounded-lg p-6 text-center border border-gray-800">
            <p className="text-gray-400">You haven't submitted any reviews yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FeedbackSection;
