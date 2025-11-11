import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../providers/ThemeProvider';
import Button from '../shared/components/ui/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`
        relative px-3 py-2 text-sm font-medium transition-all duration-200
        ${isActivePath(to)
          ? 'text-primary-600 dark:text-primary-400'
          : 'text-foreground hover:text-primary-600 dark:hover:text-primary-400'
        }
      `}
    >
      {children}
      {isActivePath(to) && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
          initial={false}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="ml-2 text-xl font-bold gradient-text">BlogHub</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated() && (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/posts/new">New Post</NavLink>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>

            {isAuthenticated() ? (
              <div className="hidden md:flex items-center space-x-3 border-l border-border pl-3 ml-3">
                <div className="flex items-center space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-9 h-9 bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-md"
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user?.name}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {isAuthenticated() ? (
                  <>
                    <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                      Home
                    </MobileNavLink>
                    <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      Dashboard
                    </MobileNavLink>
                    <MobileNavLink to="/posts/new" onClick={() => setMobileMenuOpen(false)}>
                      New Post
                    </MobileNavLink>
                    <div className="px-3 py-4 border-t border-border mt-2">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user?.name}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                      <Button variant="danger" size="sm" className="w-full" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="px-3 py-4 space-y-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>
                      Login
                    </Button>
                    <Button size="sm" className="w-full" onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const MobileNavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        block px-3 py-2 rounded-lg text-sm font-medium transition-colors
        ${isActive
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
          : 'text-foreground hover:bg-muted'
        }
      `}
    >
      {children}
    </Link>
  );
};

export default Navbar;
