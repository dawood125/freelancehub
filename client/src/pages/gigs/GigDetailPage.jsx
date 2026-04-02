import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiStar,
  FiClock,
  FiRefreshCw,
  FiCheck,
  FiMapPin,
  FiCalendar,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";
import gigService from "../../services/gigService";
import orderService from "../../services/orderService";
import ReviewList from '../../components/reviews/ReviewList';

const GigDetailPage = () => {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState("basic");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      const response = await gigService.getGig(id);
      setGig(response.data.gig);
    } catch (error) {
      toast.error("Failed to load gig");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrderClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (currentUser.id === gig.seller?._id) {
      toast.error("You cannot order your own gig");
      return;
    }

    // Navigate to checkout page (instead of creating order directly)
    navigate(`/checkout?gig=${gig._id}&package=${selectedPackage}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">😕</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Gig not found
          </h2>
          <Link
            to="/gigs"
            className="text-green-600 font-medium hover:text-green-700"
          >
            ← Browse all services
          </Link>
        </div>
      </div>
    );
  }

  const seller = gig.seller || {};
  const images = gig.images || [];
  const packages = gig.packages || {};
  const currentPkg = packages[selectedPackage] || packages.basic;

  const packageTabs = [
    { key: "basic", label: "Basic" },
    ...(packages.standard?.isActive
      ? [{ key: "standard", label: "Standard" }]
      : []),
    ...(packages.premium?.isActive
      ? [{ key: "premium", label: "Premium" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ===== LEFT COLUMN - Main Content ===== */}
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-sm text-gray-500"
            >
              <Link
                to="/gigs"
                className="hover:text-green-600 transition-colors"
              >
                Services
              </Link>
              <span>/</span>
              {gig.category && <span>{gig.category.name}</span>}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight"
            >
              {gig.title}
            </motion.h1>

            {/* Seller Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <Link
                to={`/users/${seller.username}`}
                className="flex items-center gap-3 group"
              >
                {seller.avatar?.url ? (
                  <img
                    src={seller.avatar.url}
                    alt={seller.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                    {seller.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  {seller.name}
                </span>
              </Link>

              <div className="flex items-center gap-1.5">
                <FiStar className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-amber-500">
                  {gig.ratings?.average?.toFixed(1) || "New"}
                </span>
                <span className="text-gray-400 text-sm">
                  ({gig.ratings?.count || 0} reviews)
                </span>
              </div>
            </motion.div>

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-video"
            >
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]?.url}
                    alt={gig.title}
                    className="w-full h-full object-cover"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1,
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                      >
                        <FiChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                      >
                        <FiChevronRight className="w-5 h-5" />
                      </button>

                      {/* Thumbnails */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                              idx === currentImageIndex
                                ? "border-white shadow-lg scale-105"
                                : "border-transparent opacity-70 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={img.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <span className="text-6xl">🎨</span>
                </div>
              )}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Service
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {gig.description}
              </p>

              {/* Tags */}
              {gig.tags && gig.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-100">
                  {gig.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/gigs?search=${tag}`}
                      className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg border border-gray-200 hover:border-green-300 hover:text-green-600 hover:bg-green-50 transition-all duration-300"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>

            {/* FAQs */}
            {gig.faqs && gig.faqs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-5">FAQ</h2>
                <div className="space-y-4">
                  {gig.faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    >
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Compare All Packages Table */}
            {packageTabs.length > 1 && (
              <motion.div
                id="compare-packages"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 overflow-x-auto"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-5">
                  Compare Packages
                </h2>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 pr-4 text-gray-500 font-medium">
                        Package
                      </th>
                      {packageTabs.map((tab) => (
                        <th
                          key={tab.key}
                          className="text-center py-3 px-3 font-bold text-gray-900"
                        >
                          {tab.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="py-3 pr-4 text-gray-500">Price</td>
                      {packageTabs.map((tab) => (
                        <td
                          key={tab.key}
                          className="text-center py-3 px-3 font-extrabold text-gray-900"
                        >
                          ${packages[tab.key]?.price}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-3 pr-4 text-gray-500">Delivery</td>
                      {packageTabs.map((tab) => (
                        <td
                          key={tab.key}
                          className="text-center py-3 px-3 text-gray-700"
                        >
                          {packages[tab.key]?.deliveryDays} days
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-3 pr-4 text-gray-500">Revisions</td>
                      {packageTabs.map((tab) => (
                        <td
                          key={tab.key}
                          className="text-center py-3 px-3 text-gray-700"
                        >
                          {packages[tab.key]?.revisions === -1
                            ? "Unlimited"
                            : packages[tab.key]?.revisions}
                        </td>
                      ))}
                    </tr>
                    {/* Feature rows - collect all unique features */}
                    {(() => {
                      const allFeatures = new Set();
                      packageTabs.forEach((tab) => {
                        (packages[tab.key]?.features || []).forEach((f) =>
                          allFeatures.add(f),
                        );
                      });
                      return [...allFeatures].map((feature) => (
                        <tr key={feature} className="border-b border-gray-50">
                          <td className="py-3 pr-4 text-gray-500">{feature}</td>
                          {packageTabs.map((tab) => (
                            <td key={tab.key} className="text-center py-3 px-3">
                              {(packages[tab.key]?.features || []).includes(
                                feature,
                              ) ? (
                                <FiCheck className="w-5 h-5 text-green-500 mx-auto" />
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ));
                    })()}
                    {/* Select buttons */}
                    <tr>
                      <td className="py-4"></td>
                      {packageTabs.map((tab) => (
                        <td key={tab.key} className="text-center py-4 px-3">
                          <button
                            onClick={() => {
                              setSelectedPackage(tab.key);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                              selectedPackage === tab.key
                                ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                                : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600"
                            }`}
                          >
                            Select
                          </button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* Reviews Section */}
            <ReviewList
              gigId={gig._id}
              averageRating={gig.ratings?.average || 0}
              totalReviews={gig.ratings?.count || 0}
            />
          </div>

          {/* ===== RIGHT COLUMN - Pricing + Seller Card ===== */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden lg:sticky lg:top-24"
            >
              {/* Package Tabs */}
              <div className="flex border-b border-gray-100">
                {packageTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedPackage(tab.key)}
                    className={`flex-1 py-3.5 text-sm font-bold text-center transition-all duration-300 relative ${
                      selectedPackage === tab.key
                        ? "text-green-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    {selectedPackage === tab.key && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Package Details */}
              <div className="p-5">
                {/* Price */}
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="text-2xl font-extrabold text-gray-900">
                    ${currentPkg.price}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-3">
                  {currentPkg.description}
                </p>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1.5">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    {currentPkg.deliveryDays}d delivery
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiRefreshCw className="w-4 h-4 text-gray-400" />
                    {currentPkg.revisions === -1
                      ? "∞"
                      : currentPkg.revisions}{" "}
                    revision{currentPkg.revisions !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Features - Scrollable if too many */}
                {currentPkg.features && currentPkg.features.length > 0 && (
                  <div className="space-y-2 mb-5 max-h-40 overflow-y-auto pr-1">
                    {currentPkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Order Button */}
                <button
                  onClick={handleOrderClick}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  Continue (${currentPkg.price})
                  <FiArrowRight className="w-4 h-4" />
                </button>

                {/* Contact Button */}
                <button className="w-full mt-2.5 py-2.5 text-gray-700 font-semibold border-2 border-gray-200 rounded-xl hover:border-green-500 hover:text-green-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                  <FiMessageSquare className="w-5 h-5" />
                  Contact Seller
                </button>

                {/* Contact Button */}
                <button className="w-full mt-2.5 py-2.5 text-gray-700 font-semibold border-2 border-gray-200 rounded-xl hover:border-green-500 hover:text-green-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                  <FiMessageSquare className="w-4 h-4" />
                  Contact Seller
                </button>
              </div>

              {/* Compare Packages Link */}
              {packageTabs.length > 1 && (
                <div className="px-5 pb-4">
                  <button
                    onClick={() => {
                      const el = document.getElementById("compare-packages");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full text-center text-xs text-gray-400 hover:text-green-600 transition-colors"
                  >
                    Compare all packages ↓
                  </button>
                </div>
              )}
            </motion.div>

            {/* Seller Card - NOT sticky, scrolls normally */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                About the Seller
              </h3>

              <Link
                to={`/users/${seller.username}`}
                className="flex items-center gap-4 mb-4 group"
              >
                {seller.avatar?.url ? (
                  <img
                    src={seller.avatar.url}
                    alt={seller.name}
                    className="w-14 h-14 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xl font-bold">
                    {seller.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    {seller.name}
                  </h4>
                  {seller.title && (
                    <p className="text-sm text-gray-500">{seller.title}</p>
                  )}
                </div>
              </Link>

              {/* Seller Stats */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                {[
                  {
                    label: "Rating",
                    value: `${seller.freelancerProfile?.averageRating?.toFixed(1) || "0.0"} ⭐`,
                  },
                  {
                    label: "Reviews",
                    value: seller.freelancerProfile?.totalReviews || 0,
                  },
                  {
                    label: "Orders",
                    value: seller.freelancerProfile?.completedOrders || 0,
                  },
                  {
                    label: "Level",
                    value: (seller.freelancerProfile?.level || "new").replace(
                      "-",
                      " ",
                    ),
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gray-50 rounded-xl p-2.5 text-center"
                  >
                    <p className="text-[10px] text-gray-400 font-medium mb-0.5">
                      {stat.label}
                    </p>
                    <p className="text-sm font-bold text-gray-900 capitalize">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Seller Details */}
              <div className="space-y-2 text-sm">
                {seller.location?.country && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <FiMapPin className="w-4 h-4" />
                    {seller.location.city && `${seller.location.city}, `}
                    {seller.location.country}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-500">
                  <FiCalendar className="w-4 h-4" />
                  Member since{" "}
                  {new Date(seller.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              {seller.bio && (
                <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100 leading-relaxed line-clamp-4">
                  {seller.bio}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetailPage;
