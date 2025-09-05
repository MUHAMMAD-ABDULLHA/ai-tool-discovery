// src/components/NavBar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../hooks/Auth';
import useAuthStore from '../store/AuthStore';

const NavBar = () => {
  const { user, logout } = useAuthStore();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/tools" className="text-2xl font-bold text-gray-800">
          AI Tools
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium">
            Dashboard
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium">
              Admin
            </Link>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;