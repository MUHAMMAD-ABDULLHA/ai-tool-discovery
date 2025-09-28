// // src/pages/DashboardPage.jsx

// import React from 'react';
// import useAuth from '../hooks/Auth'; // Note: Corrected hook name

// const Dashboard = () => {
//  const { user, logout } = useAuth();

//  // No need for useState or useEffect for profile data.
//  // The 'user' object from the useAuth hook already contains this info.

//  return (
//   <div className="min-h-screen bg-gray-100 p-8">
//    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//     <div className="flex justify-between items-center mb-6">
//      <h1 className="text-3xl font-bold text-gray-800">
//       Welcome, {user?.name}! 👋
//      </h1>
//      <button
//       onClick={logout}
//       className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
//      >
//       Logout
//      </button>
//     </div>
//     <p className="text-lg text-gray-600 mb-4">
//      You are logged in as a **{user?.role}**.
//     </p>
//     <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//      <h2 className="text-2xl font-semibold mb-3">Your Profile</h2>
//      <p><strong>Name:</strong> {user.name}</p>
//      <p><strong>Email:</strong> {user.email}</p>
//      <p><strong>Role:</strong> {user.role}</p>
//     </div>
//    </div>
//   </div>
//  );
// };

// export default Dashboard;

// src/pages/DashboardPage.jsx

// import React from 'react';
// import useAuthStore from '../store/AuthStore';

// /*************  ✨ Windsurf Command ⭐  *************/
// /**
//  * Dashboard component
//  * 
//  * This component displays a welcome message with the user's name and 
//  * their role, and also displays a profile section with the user's name, 
//  * email, and role.
//  * 
//  * @returns {JSX.Element} Dashboard component
//  */
// /*******  5f87e4dd-079c-4142-a012-ec3016c5154d  *******/
// const Dashboard = () => {
//   const { user } = useAuthStore();

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Welcome, {user?.name}! 👋
//           </h1>
//         </div>
//         <p className="text-lg text-gray-600 mb-4">
//           You are logged in as a **{user?.role}**.
//         </p>
//         <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//           <h2 className="text-2xl font-semibold mb-3">Your Profile</h2>
//           <p><strong>Name:</strong> {user.name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Role:</strong> {user.role}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import React from 'react';
// import { Link } from 'react-router-dom';
// import useAuthStore from '../store/AuthStore';

// const Dashboard = () => {
//   const { user } = useAuthStore();

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Welcome, {user?.name}! 👋
//           </h1>
//           {/* 🔗 Navigation to Tools */}
//           <Link
//             to="/tools"
//             className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors"
//           >
//             Browse Tools
//           </Link>
//         </div>
//         <p className="text-lg text-gray-600 mb-4">
//           You are logged in as <strong>{user?.role}</strong>.
//         </p>
//         <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//           <h2 className="text-2xl font-semibold mb-3">Your Profile</h2>
//           <p><strong>Name:</strong> {user.name}</p>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Role:</strong> {user.role}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../store/AuthStore";

// const Dashboard = () => {
//   const { user, setUser, setToken } = useAuthStore();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setUser(null);
//     setToken(null);
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* 🔹 Navbar */}
//       <nav className="bg-indigo-600 text-white px-6 py-3 shadow-md">
//         <div className="max-w-6xl mx-auto flex justify-between items-center">
//           {/* Brand / Logo */}
//           <Link to="/dashboard" className="text-xl font-bold tracking-wide">
//             BrandPromo
//           </Link>

//           {/* Links */}
//           <div className="flex gap-6 items-center">
//             <Link
//               to="/tools"
//               className="hover:text-indigo-200 transition-colors"
//             >
//               Tools
//             </Link>
//             <Link
//               to="/bookmarks"
//               className="hover:text-indigo-200 transition-colors"
//             >
//               Bookmarks
//             </Link>
//             <Link
//               to="/dashboard"
//               className="hover:text-indigo-200 transition-colors"
//             >
//               Profile
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* 🔹 Page Content */}
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-6">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-800">
//             Welcome, {user?.name}! 👋
//           </h1>
//           <p className="text-lg text-gray-600">
//             You are logged in as <strong>{user?.role}</strong>.
//           </p>
//         </div>

//         <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//           <h2 className="text-2xl font-semibold mb-3">Your Profile</h2>
//           <p>
//             <strong>Name:</strong> {user.name}
//           </p>
//           <p>
//             <strong>Email:</strong> {user.email}
//           </p>
//           <p>
//             <strong>Role:</strong> {user.role}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../store/AuthStore";

// const Dashboard = () => {
//   const { user, setUser, setToken } = useAuthStore();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setUser(null);
//     setToken(null);
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* 🔹 Navbar */}
//       <nav className="bg-primary text-black px-6 py-3 shadow-md">
//         <div className="max-w-6xl mx-auto flex justify-between items-center">
//           {/* Brand / Logo */}
//           <Link
//             to="/dashboard"
//             className="text-xl font-bold tracking-wide hover:text-neutral-light"
//           >
//             BrandPromo
//           </Link>

//           {/* Links */}
//           <div className="flex gap-6 items-center">
//             <Link
//               to="/tools"
//               className="hover:text-primary-light transition-colors"
//             >
//               Tools
//             </Link>
//             <Link
//               to="/bookmarks"
//               className="hover:text-primary-light transition-colors"
//             >
//               Bookmarks
//             </Link>
//             <Link
//               to="/dashboard"
//               className="hover:text-primary-light transition-colors"
//             >
//               Profile
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="bg-white text-primary px-4 py-1 rounded-lg font-medium hover:bg-neutral-light transition"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* 🔹 Page Content */}
//       <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-neutral-dark">
//             Welcome, {user?.name}! 👋
//           </h1>
//           <p className="text-lg text-neutral">
//             You are logged in as <strong>{user?.role}</strong>.
//           </p>
//         </div>

//         <div className="bg-neutral-light p-6 rounded-lg border border-gray-200">
//           <h2 className="text-2xl font-semibold mb-3 text-neutral-dark">
//             Your Profile
//           </h2>
//           <p>
//             <strong>Name:</strong> {user.name}
//           </p>
//           <p>
//             <strong>Email:</strong> {user.email}
//           </p>
//           <p>
//             <strong>Role:</strong> {user.role}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React from "react";
import useAuthStore from "../store/AuthStore";

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">

      {/* 🔹 Page Content */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg mt-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-dark">
            Welcome, {user?.name}! 👋
          </h1>
          <p className="text-lg text-neutral">
            You are logged in as <strong>{user?.role}</strong>.
          </p>
        </div>

        <div className="bg-neutral-light p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-3 text-neutral-dark">
            Your Profile
          </h2>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
