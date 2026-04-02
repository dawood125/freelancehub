import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiChevronDown } from 'react-icons/fi';
import reviewService from '../../services/reviewService';

// ─── SINGLE REVIEW CARD ───
const ReviewCard = ({ review }) => {
  const reviewer = review.reviewer || {};
  const date = new Date(review.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {reviewer.avatar?.url ? (
            <img
              src={reviewer.avatar.url}
              alt={reviewer.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              {reviewer.name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {reviewer.name || 'Anonymous'}
            </p>
            {reviewer.location?.country && (
              <p className="text-xs text-gray-400">
                {reviewer.location.country}
              </p>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-400">{date}</span>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= review.rating.overall
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-200'
            }`}
          />
        ))}
        <span className="text-sm font-bold text-amber-500 ml-1">
          {review.rating.overall.toFixed(1)}
        </span>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>

      {/* Sub-ratings */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
        {[
          { label: 'Communication', val: review.rating.communication },
          { label: 'As Described', val: review.rating.serviceAsDescribed },
          { label: 'Recommend', val: review.rating.recommendation },
        ].map(
          (item) =>
            item.val && (
              <span key={item.label} className="text-xs text-gray-400">
                {item.label}:{' '}
                <span className="text-gray-600 font-medium">
                  {item.val.toFixed(1)}
                </span>
              </span>
            )
        )}
      </div>

      {/* Seller Response */}
      {review.response?.content && (
        <div className="mt-4 ml-6 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-1">
            Seller&apos;s Response
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {review.response.content}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── RATING BAR ───
const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-3 text-right text-gray-500 font-medium">{star}</span>
      <FiStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-xs text-gray-400">{count}</span>
    </div>
  );
};

// ═══════════════════════════════════════
// REVIEW LIST + SUMMARY
// ═══════════════════════════════════════
const ReviewList = ({ gigId, averageRating = 0, totalReviews = 0 }) => {
  const [reviews, setReviews] = useState([]);
  const [breakdown, setBreakdown] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchReviews();
  }, [gigId, page, sort]);

  const fetchReviews = async () => {
    try {
      const response = await reviewService.getGigReviews(gigId, {
        page,
        limit: 5,
        sort,
      });
      setReviews(response.data.reviews);
      setBreakdown(response.data.breakdown);
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (totalReviews === 0 && reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Reviews</h2>
        <div className="text-center py-8">
          <span className="text-4xl block mb-3">⭐</span>
          <p className="text-gray-500 text-sm">
            No reviews yet. Be the first to review!
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-5">Reviews</h2>

      {/* ─── Rating Summary ─── */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-gray-100">
        {/* Big number */}
        <div className="flex flex-col items-center justify-center sm:pr-8 sm:border-r sm:border-gray-100">
          <span className="text-5xl font-extrabold text-gray-900">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex gap-0.5 mt-2 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(averageRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">
            {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <RatingBar
              key={star}
              star={star}
              count={breakdown[star] || 0}
              total={totalReviews}
            />
          ))}
        </div>
      </div>

      {/* ─── Sort ─── */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          Showing {reviews.length} of {totalReviews}
        </span>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="appearance-none text-sm text-gray-600 font-medium bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 pr-8 outline-none focus:border-green-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
          <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* ─── Review Cards ─── */}
      <div>
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>

      {/* ─── Pagination ─── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ReviewList;