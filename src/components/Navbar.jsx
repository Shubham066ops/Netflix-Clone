import React, { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';

const Navbar = ({
  onSearch,
  onLogoClick,
  categories = [],
  activeCategory,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const normalizedCategories = useMemo(() => {
    return (categories || []).map((c) => ({
      key: c.key,
      label: c.label,
    }));
  }, [categories]);

  const handleLogo = () => {
    if (onLogoClick) onLogoClick();
    if (isAuthenticated) navigate('/');
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
    setMobileOpen(false);
  };

  const getCategoryTo = (key) => {
    if (key === 'home') return '/';
    return `/category/${key}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-white/10 px-4 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div
          className="flex items-center space-x-4 cursor-pointer"
          onClick={handleLogo}
        >
          <div className="text-red-600 text-3xl font-bold">NETFLIX</div>
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="hidden lg:flex items-center space-x-5">
                {normalizedCategories.map((c) => (
                  <NavLink
                    key={c.key}
                    to={getCategoryTo(c.key)}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      (isActive
                        ? 'text-netflix-red'
                        : 'text-gray-200 hover:text-white') +
                      ' text-sm font-medium transition-colors'
                    }
                  >
                    {c.label}
                  </NavLink>
                ))}
              </div>

              <div className="hidden md:block">
                <SearchBar onSearch={onSearch} />
              </div>

              <div className="hidden md:flex items-center space-x-3">
                <div className="text-sm text-gray-200">{user?.name}</div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>

              <button
                type="button"
                className="md:hidden bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>

      {isAuthenticated && mobileOpen ? (
        <div className="md:hidden max-w-7xl mx-auto px-2 pt-3 pb-4">
          <div className="mb-3">
            <SearchBar onSearch={onSearch} />
          </div>

          <div className="flex flex-col space-y-2">
            {normalizedCategories.map((c) => (
              <NavLink
                key={c.key}
                to={getCategoryTo(c.key)}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  (isActive
                    ? 'bg-netflix-red/20 text-netflix-red'
                    : 'bg-white/5 text-gray-200') +
                  ' text-left px-4 py-3 rounded-lg hover:bg-white/10 transition-colors'
                }
              >
                {c.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-200">{user?.name}</div>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
