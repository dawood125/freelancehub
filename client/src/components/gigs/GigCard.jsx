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
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 hover:border-transparent hover:-translate-y-1 transition-all duration-500">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {currentImage ? (
          <img
            src={currentImage}
            alt={gig.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
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
                    ? 'bg-white w-5'
                    : 'bg-white/60 hover:bg-white/80'
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
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-sm"
        >
          <FiHeart
            className={`w-4 h-4 transition-colors duration-300 ${
              isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
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
            <p className="text-sm font-semibold text-gray-900 truncate">{sellerName}</p>
            <p className="text-xs text-gray-400 capitalize">
              {sellerLevel.replace('-', ' ')} Seller
            </p>
          </div>
        </div>

  
        <h3 className="text-[15px] font-medium text-gray-800 leading-snug mb-3 line-clamp-2 group-hover:text-green-600 transition-colors duration-300">
          {gig.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-4">
          <FiStar className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold text-amber-500">
            {gig.ratings?.average?.toFixed(1) || 'New'}
          </span>
          <span className="text-xs text-gray-400">
            ({gig.ratings?.count || 0})
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <FiClock className="w-3.5 h-3.5" />
            {deliveryDays} day{deliveryDays !== 1 ? 's' : ''} delivery
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Starting at</p>
            <p className="text-lg font-extrabold text-gray-900">${startingPrice}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GigCard;