import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiStar, FiSend } from 'react-icons/fi';
import reviewService from '../../services/reviewService';

// ─── STAR RATING INPUT ───
const StarInput = ({ label, value, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[color:var(--text-2)]">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <FiStar
              className={`w-6 h-6 transition-colors ${
                star <= (hover || value)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-[color:var(--text-muted)]'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── REVIEW FORM ───
const ReviewForm = ({ orderId, onReviewSubmitted }) => {
  const [ratings, setRatings] = useState({
    overall: 0,
    communication: 0,
    serviceAsDescribed: 0,
    recommendation: 0,
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (field, value) => {
    setRatings((prev) => {
      const updated = { ...prev, [field]: value };
      // If setting overall and others are 0, auto-fill them
      if (field === 'overall') {
        if (prev.communication === 0) updated.communication = value;
        if (prev.serviceAsDescribed === 0) updated.serviceAsDescribed = value;
        if (prev.recommendation === 0) updated.recommendation = value;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ratings.overall === 0) {
      toast.error('Please select an overall rating');
      return;
    }
    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await reviewService.createReview({
        orderId,
        rating: ratings,
        comment: comment.trim(),
      });
      toast.success('Review submitted! ⭐');
      if (onReviewSubmitted) onReviewSubmitted(response.data.review);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingLabels = {
    overall: 'Overall Rating',
    communication: 'Communication',
    serviceAsDescribed: 'Service as Described',
    recommendation: 'Would Recommend',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[color:var(--surface-card)] rounded-2xl border border-[color:var(--line)] p-6 shadow-sm"
    >
      <h3 className="font-bold text-[color:var(--text-1)] mb-1 flex items-center gap-2">
        <FiStar className="w-5 h-5 text-amber-500" />
        Leave a Review
      </h3>
      <p className="text-sm text-[color:var(--text-2)] mb-5">
        Share your experience to help other buyers.
      </p>

      <form onSubmit={handleSubmit}>
        {/* Star ratings */}
        <div className="space-y-3 mb-5 bg-[color:var(--surface-soft)] rounded-xl p-4 border border-[color:var(--line)]">
          {Object.entries(ratingLabels).map(([field, label]) => (
            <StarInput
              key={field}
              label={label}
              value={ratings[field]}
              onChange={(val) => handleRatingChange(field, val)}
            />
          ))}
        </div>

        {/* Comment */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience with this seller... (min 10 characters)"
          rows={4}
          maxLength={1000}
          className="w-full px-4 py-3 border border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--text-1)] rounded-xl text-sm outline-none focus:border-[color:var(--accent)] resize-none mb-1"
        />
        <p className="text-xs text-[color:var(--text-muted)] text-right mb-4">
          {comment.length}/1000
        </p>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || ratings.overall === 0}
          className="w-full py-3 brand-gradient text-white font-bold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <FiSend className="w-4 h-4" />
              Submit Review
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;