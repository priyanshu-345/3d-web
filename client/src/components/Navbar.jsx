import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const [user, setUser] = useState(null);

  // Handle scroll effect & Auth Check
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const checkAuth = () => {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
      else setUser(null);
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    checkAuth();

    // Listen for storage events (login/logout sync)
    window.addEventListener('storage', checkAuth);

    // Periodically check (simple way to update UI after login redirect)
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/interior-studio', label: 'Studio 3D' },
    { path: '/advanced-editor', label: 'Pro Editor' },
    { path: '/ai-consultant', label: 'AI Consultant' },
    { path: '/features', label: 'Features' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || location.pathname !== '/'
        ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
              <span className="text-white font-bold text-lg">3D</span>
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${scrolled || location.pathname !== '/' ? 'text-gray-900' : 'text-white'
              }`}>
              Interior<span className="font-light">Design</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-indigo-500 ${isActive(link.path)
                  ? 'text-indigo-600'
                  : (scrolled || location.pathname !== '/' ? 'text-gray-600' : 'text-white/90 hover:text-white')
                  }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full transform scale-x-100 transition-transform" />
                )}
              </Link>
            ))}

            {user ? (
              <Link
                to="/profile"
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-md ${scrolled || location.pathname !== '/'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-white text-indigo-900 hover:bg-gray-100'
                  }`}
              >
                <span>👤</span>
                <span>{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium transition-colors hover:text-indigo-500 ${scrolled || location.pathname !== '/' ? 'text-gray-600' : 'text-white/90 hover:text-white'
                    }`}
                >
                  Log In
                </Link>

                <Link
                  to="/signup"
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all transform hover:scale-105 shadow-md ${scrolled || location.pathname !== '/'
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled || location.pathname !== '/' ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${isActive(link.path)
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-6 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Start Project
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



