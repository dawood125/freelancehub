import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiSearch, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import messageService from '../../services/messageService';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const isHomePage = location.pathname === '/';
  const useSolidSurface = !isHomePage || isScrolled;

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
    { name: 'Create Gig', path: '/create-gig' },
    { name: 'Orders', path: '/orders' },
    { name: 'Messages', path: '/messages' },
    { name: 'Profile', path: '/profile' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUnreadMessages(0);
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await messageService.getConversations();
        const conversations = response.data?.conversations || [];

        const count = conversations.reduce((sum, entry) => {
          return sum + (entry.unreadCount || 0);
        }, 0);

        setUnreadMessages(count);
      } catch {
        // Silent on nav polling. Main messages page handles detailed errors.
      }
    };

    fetchUnreadCount();
    const intervalId = setInterval(fetchUnreadCount, 20000);

    return () => clearInterval(intervalId);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          useSolidSurface
            ? 'bg-[color:var(--surface-nav)] border-b border-[color:var(--line)] shadow-[0_12px_34px_rgba(15,23,42,0.12)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="relative ring-1 ring-[color:var(--line)] rounded-xl p-1 bg-[color:var(--surface-card)] transition-transform duration-500 group-hover:rotate-6">
                <div className="w-9 h-9 brand-gradient rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg tracking-tight">F</span>
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight transition-colors duration-300 text-[color:var(--text-1)]">
                Freelance<span className="text-[color:var(--accent)]">Hub</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1 bg-[color:var(--surface-soft)] border border-[color:var(--line)] rounded-xl p-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-300 text-[color:var(--text-2)] hover:text-[color:var(--text-1)] hover:bg-[color:var(--surface-card)] ${
                    location.pathname === link.path ? 'bg-[color:var(--surface-card)] text-[color:var(--accent)]' : ''
                  }`}
                >
                  {link.name}
                  {link.path === '/messages' && unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-[rgb(var(--accent-rgb))] text-white text-[10px] font-bold inline-flex items-center justify-center">
                      {unreadMessages > 99 ? '99+' : unreadMessages}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <button className="p-2.5 rounded-xl transition-all duration-300 text-[color:var(--text-2)] hover:text-[color:var(--text-1)] hover:bg-[color:var(--surface-card)] border border-[color:var(--line)]">
                <FiSearch className="w-[18px] h-[18px]" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl transition-all duration-300 text-[color:var(--text-2)] hover:text-[color:var(--text-1)] hover:bg-[color:var(--surface-card)] border border-[color:var(--line)]"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {theme === 'dark' ? <FiSun className="w-[18px] h-[18px]" /> : <FiMoon className="w-[18px] h-[18px]" />}
              </button>

              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 text-[color:var(--text-2)] hover:text-[color:var(--text-1)] hover:bg-[color:var(--surface-card)]"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 text-sm font-semibold brand-gradient text-white rounded-xl hover:shadow-[0_14px_30px_rgba(88,101,242,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Join Free
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl transition-all duration-300 text-[color:var(--text-1)] border border-[color:var(--line)] bg-[color:var(--surface-card)]"
            >
              {isMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className={`md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="mx-4 mb-4 bg-[color:var(--surface-card)] rounded-2xl shadow-xl border border-[color:var(--line)] p-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-[color:var(--text-2)] font-medium rounded-xl hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--accent)] transition-all duration-300"
              >
                {link.name}
                {link.path === '/messages' && unreadMessages > 0 && (
                  <span className="ml-2 inline-flex min-w-5 h-5 px-1.5 rounded-full bg-[rgb(var(--accent-rgb))] text-white text-[10px] font-bold items-center justify-center align-middle">
                    {unreadMessages > 99 ? '99+' : unreadMessages}
                  </span>
                )}
              </Link>
            ))}
            <hr className="my-3 border-[color:var(--line)]" />
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-[color:var(--text-2)] font-medium rounded-xl hover:bg-[color:var(--surface-soft)] hover:text-[color:var(--accent)] transition-all duration-300"
            >
              Sign In
            </Link>
            <button
              onClick={toggleTheme}
              className="w-full mt-2 px-4 py-3 text-[color:var(--text-2)] font-medium rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] flex items-center justify-center gap-2"
            >
              {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
            <Link
              to="/register"
              onClick={() => setIsMenuOpen(false)}
              className="block mt-2 text-center px-6 py-3 brand-gradient text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
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