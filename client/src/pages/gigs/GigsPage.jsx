import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import GigCard from '../../components/gigs/GigCard';
import gigService from '../../services/gigService';
import categoryService from '../../services/categoryService';

const GigsPage = () => {
  // ===== STATE =====
  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGigs, setTotalGigs] = useState(0);

  // URL search params for filters
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract current filters from URL
  const currentFilters = {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    deliveryTime: searchParams.get('deliveryTime') || '',
    rating: searchParams.get('rating') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
  };

  const [searchInput, setSearchInput] = useState(currentFilters.search);

  // ===== FETCH DATA =====
  useEffect(() => {
    fetchGigs();
  }, [searchParams]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  };

  const fetchGigs = async () => {
    setIsLoading(true);
    try {
      // Build params from URL search params
      const params = {};
      searchParams.forEach((value, key) => {
        if (value) params[key] = value;
      });
      params.limit = 12;

      const response = await gigService.getAllGigs(params);
      setGigs(response.data.gigs);
      setTotalPages(response.pages);
      setTotalGigs(response.total);
    } catch (error) {
      toast.error('Failed to load gigs');
    } finally {
      setIsLoading(false);
    }
  };

  // ===== FILTER HANDLERS =====
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset page when filters change
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = currentFilters.search || currentFilters.category ||
    currentFilters.minPrice || currentFilters.maxPrice ||
    currentFilters.deliveryTime || currentFilters.rating;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {currentFilters.search
              ? `Results for "${currentFilters.search}"`
              : 'Browse All Services'
            }
          </h1>
          <p className="text-gray-500">
            {totalGigs} service{totalGigs !== 1 ? 's' : ''} available
          </p>
        </motion.div>

        {/* ===== SEARCH BAR ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-6"
        >
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for services..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:border-green-500 transition-colors duration-300"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3.5 border-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
                showFilters
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <FiFilter className="w-5 h-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </form>
        </motion.div>

        {/* ===== FILTERS PANEL ===== */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showFilters ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <FiX className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <div className="relative">
                  <select
                    value={currentFilters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-green-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Budget</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={currentFilters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-green-500 transition-colors"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={currentFilters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Delivery Time</label>
                <div className="relative">
                  <select
                    value={currentFilters.deliveryTime}
                    onChange={(e) => updateFilter('deliveryTime', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-green-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Any</option>
                    <option value="1">Up to 24 hours</option>
                    <option value="3">Up to 3 days</option>
                    <option value="7">Up to 7 days</option>
                    <option value="14">Up to 14 days</option>
                    <option value="30">Up to 30 days</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Min Rating</label>
                <div className="relative">
                  <select
                    value={currentFilters.rating}
                    onChange={(e) => updateFilter('rating', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 outline-none focus:border-green-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ ⭐</option>
                    <option value="4">4.0+ ⭐</option>
                    <option value="3.5">3.5+ ⭐</option>
                    <option value="3">3.0+ ⭐</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SORT BAR ===== */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Active filter tags */}
            {currentFilters.search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                Search: {currentFilters.search}
                <button onClick={() => { updateFilter('search', ''); setSearchInput(''); }}>
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
            <div className="relative">
              <select
                value={currentFilters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-green-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Best Rating</option>
                <option value="price_low">Price: Low → High</option>
                <option value="price_high">Price: High → Low</option>
              </select>
              <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ===== GIGS GRID ===== */}
        {isLoading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                    <div className="h-4 bg-gray-200 rounded-full w-24" />
                  </div>
                  <div className="h-4 bg-gray-200 rounded-full w-full" />
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <div className="h-4 bg-gray-200 rounded-full w-20" />
                    <div className="h-6 bg-gray-200 rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : gigs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {gigs.map((gig, index) => (
                <motion.div
                  key={gig._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <GigCard gig={gig} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {/* Previous */}
                <button
                  onClick={() => updateFilter('page', String(currentFilters.page - 1))}
                  disabled={currentFilters.page <= 1}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => updateFilter('page', String(pageNum))}
                      className={`w-10 h-10 text-sm font-semibold rounded-lg transition-all ${
                        currentFilters.page === pageNum
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/25'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next */}
                <button
                  onClick={() => updateFilter('page', String(currentFilters.page + 1))}
                  disabled={currentFilters.page >= totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          // Empty state
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GigsPage;