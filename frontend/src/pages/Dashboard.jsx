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

import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/AuthStore';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name}! 👋
          </h1>
          {/* 🔗 Navigation to Tools */}
          <Link
            to="/tools"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition-colors"
          >
            Browse Tools
          </Link>
        </div>
        <p className="text-lg text-gray-600 mb-4">
          You are logged in as <strong>{user?.role}</strong>.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-2xl font-semibold mb-3">Your Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
