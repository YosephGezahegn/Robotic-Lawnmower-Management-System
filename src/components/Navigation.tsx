import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { RootState } from '../store';
import { Home, Settings, User, LogOut } from 'lucide-react';

const Navigation: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/signin');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              to="/dashboard"
              className="flex items-center px-4 text-gray-700 hover:text-blue-500"
            >
              <Home className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/device-settings"
              className="flex items-center px-4 text-gray-700 hover:text-blue-500"
            >
              <Settings className="w-5 h-5 mr-2" />
              Device Settings
            </Link>

            <Link
              to="/user-settings"
              className="flex items-center px-4 text-gray-700 hover:text-blue-500"
            >
              <User className="w-5 h-5 mr-2" />
              {user?.username || 'Profile'}
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center px-4 text-gray-700 hover:text-red-500"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;