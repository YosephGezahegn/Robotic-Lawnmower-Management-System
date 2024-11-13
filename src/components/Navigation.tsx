import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { RootState } from '../store';
import { Home, Settings, User, LogOut, Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side - Logo or Home link */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center text-gray-700 hover:text-blue-500"
            >
              <Home className="w-5 h-5 mr-2" />
              <span className="font-semibold">Dashboard</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-500 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/device-settings"
              className="flex items-center text-gray-700 hover:text-blue-500"
            >
              <Settings className="w-5 h-5 mr-2" />
              Device Settings
            </Link>

            <Link
              to="/user-settings"
              className="flex items-center text-gray-700 hover:text-blue-500"
            >
              <User className="w-5 h-5 mr-2" />
              {user?.username || 'Profile'}
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-red-500"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <Link
              to="/device-settings"
              className="block px-4 py-2 text-gray-700 hover:text-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Device Settings
              </div>
            </Link>
            <Link
              to="/user-settings"
              className="block px-4 py-2 text-gray-700 hover:text-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                {user?.username || 'Profile'}
              </div>
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left block px-4 py-2 text-gray-700 hover:text-red-500"
            >
              <div className="flex items-center">
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </div>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;