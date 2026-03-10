import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiSearch } from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const useDarkText = !isHomePage || isScrolled;


  const useWhiteBg = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Explore', path: '/gigs' },
    { name: 'How it Works', path: '/#how-it-works' },
    { name: 'Categories', path: '/categories' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          useWhiteBg
            ? 'bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-b border-gray-100/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-green-500/20">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div className="absolute inset-0 bg-green-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${
                useDarkText ? 'text-gray-900' : 'text-white'
              }`}>
                Freelance<span className="text-green-500">Hub</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 hover:bg-green-500/10 hover:text-green-600 ${
                    useDarkText ? 'text-gray-600' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <button className={`p-2.5 rounded-xl transition-all duration-300 hover:bg-gray-100 ${
                useDarkText ? 'text-gray-500' : 'text-white/80 hover:bg-white/10'
              }`}>
                <FiSearch className="w-[18px] h-[18px]" />
              </button>

              <Link
                to="/login"
                className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  useDarkText 
                    ? 'text-gray-700 hover:text-green-600 hover:bg-green-50' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-green-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Join Free
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-all duration-300 ${
                useDarkText ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="mx-4 mb-4 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-300"
              >
                {link.name}
              </Link>
            ))}
            <hr className="my-3 border-gray-100" />
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-green-50 hover:text-green-600 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="block mt-2 text-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Join Free
            </Link>
          </div>
        </div>
      </nav>

      {!isHomePage && <div className="h-[72px]" />}
    </>
  );
};

export default Navbar;