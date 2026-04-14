import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiHeart, FiClock } from 'react-icons/fi';

const GigCard = ({ gig }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const seller = gig.seller || {};
  const sellerName = seller.name || 'Unknown';
  const sellerAvatar = seller.avatar?.url || '';
  const sellerLevel = seller.freelancerProfile?.level || 'new';
  const sellerRating = seller.freelancerProfile?.averageRating || 0;

  const images = gig.images || [];
  const currentImage = images[imageIndex]?.url || '';

  const startingPrice = gig.packages?.basic?.price || 0;
  const deliveryDays = gig.packages?.basic?.deliveryDays || 0;

  return (
    <div className="group bg-[color:var(--surface-card)] rounded-2xl border border-[color:var(--line)] overflow-hidden hover:shadow-[0_20px_35px_rgba(15,23,42,0.16)] hover:border-[color:var(--accent)] hover:-translate-y-1 transition-all duration-500">
      <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--surface-soft)]">
        {currentImage ? (
          <img
            src={currentImage}
            alt={gig.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-[linear-gradient(135deg,rgba(88,101,242,0.14),rgba(151,113,255,0.12))] flex items-center justify-center">
            <span className="text-4xl">🎨</span>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  setImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === imageIndex
                    ? 'brand-gradient w-5'
                    : 'bg-[color:var(--surface-card)]/70 hover:bg-[color:var(--surface-card)]'
                }`}
              />
            ))}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-9 h-9 bg-[color:var(--surface-card)]/90 backdrop-blur-sm border border-[color:var(--line)] rounded-full flex items-center justify-center hover:bg-[color:var(--surface-soft)] transition-all duration-300 shadow-sm"
        >
          <FiHeart
            className={`w-4 h-4 transition-colors duration-300 ${
              isLiked ? 'fill-rose-500 text-rose-500' : 'text-[color:var(--text-2)]'
            }`}
          />
        </button>
      </div>

      <Link to={`/gigs/${gig._id}`} className="block p-5">
        <div className="flex items-center gap-2.5 mb-3">
          {sellerAvatar ? (
            <img
              src={sellerAvatar}
              alt={sellerName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
              {sellerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[color:var(--text-1)] truncate">{sellerName}</p>
            <p className="text-xs text-[color:var(--text-muted)] capitalize">
              {sellerLevel.replace('-', ' ')} Seller
            </p>
          </div>
        </div>

        <h3 className="text-[15px] font-medium text-[color:var(--text-1)] leading-snug mb-3 line-clamp-2 group-hover:text-[color:var(--accent)] transition-colors duration-300">
          {gig.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-4">
          <FiStar className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold text-amber-500">
            {gig.ratings?.average?.toFixed(1) || 'New'}
          </span>
          <span className="text-xs text-[color:var(--text-muted)]">
            ({gig.ratings?.count || 0})
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[color:var(--line)]">
          <div className="flex items-center gap-1.5 text-xs text-[color:var(--text-muted)]">
            <FiClock className="w-3.5 h-3.5 text-[color:var(--accent)]" />
            {deliveryDays} day{deliveryDays !== 1 ? 's' : ''} delivery
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[color:var(--text-muted)] uppercase tracking-[0.12em] font-semibold">Starting at</p>
            <p className="text-lg font-extrabold text-[color:var(--text-1)]">${startingPrice}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GigCard;