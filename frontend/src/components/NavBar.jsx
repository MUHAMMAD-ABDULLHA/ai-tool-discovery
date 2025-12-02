// // src/components/NavBar.jsx

// import React from 'react';
// import { Link } from 'react-router-dom';
// import Auth from '../hooks/Auth';
// import AuthStore from '../store/AuthStore';

// const NavBar = () => {
//   const { user, logout } = AuthStore();

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <Link to="/tools" className="text-2xl font-bold text-gray-800">
//           AI Tools
//         </Link>
//         <div className="flex items-center space-x-4">
//           <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium">
//             Dashboard
//           </Link>
//           {user?.role === 'admin' && (
//             <Link to="/admin" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium">
//               Admin
//             </Link>
//           )}
//           <button
//             onClick={logout}
//             className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors duration-200"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../slices/authSlice";

const NavBar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-black shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Brand / Logo */}
        <Link to="/tools" className="text-2xl font-bold tracking-wide">
          AI.Discover
        </Link>

        {/* Role-based Links */}
        <div className="flex items-center space-x-6">
          {/* Common for all roles */}
          <Link
            to="/tools"
            className="hover:text-primary-light transition-colors duration-200 font-medium"
          >
            Tools
          </Link>
          <Link
            to="/bookmarks"
            className="hover:text-primary-light transition-colors duration-200 font-medium"
          >
            Bookmarks
          </Link>
          <Link
            to={
              user?.role === "startup"
                ? "/creator/dashboard"
                : user?.role === "admin"
                  ? "/admin"
                  : "/dashboard"
            }
            className="hover:text-primary-light transition-colors duration-200 font-medium"
          >
            Dashboard
          </Link>

          {/* Startup-only */}
          {user?.role === "startup" && (
            <Link
              to="/tools/new"
              className="hover:text-primary-light transition-colors duration-200 font-medium"
            >
              Create Tool
            </Link>
          )}

          {/* Admin-only */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="hover:text-primary-light transition-colors duration-200 font-medium"
            >
              Admin
            </Link>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-white text-primary px-4 py-1 rounded-lg font-medium hover:bg-neutral-light transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
