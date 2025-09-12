// // src/App.jsx

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './s/Login';
// import Registration from './s/Registration';
// import Dashboard from './s/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import AuthStore from './store/AuthStore';
// import ToolDetail from './s/ToolDetail'; 
// import ToolList from './components/ToolList';


// const App = () => {
//   const { token } = AuthStore();
  
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Registration />} />
        
//         {/* Protected Routes */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Route>

//         {/* Admin-only route
//         <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
//           <Route path="/admin" element={<Admin />} />
//         </Route> */}

//         <Route path="/tools" element={<ToolList />} />
//         <Route path="/tools/:toolId" element={<ToolDetail />} />

//         {/* Redirect authenticated users from login/register */}
//         <Route path="/" element={token ? <Navigate to="/tools" /> : <Navigate to="/login" />} />
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './components/ProtectedLayout';
import useAuthStore from './store/AuthStore';
import ToolDetail from './pages/ToolDetail';
import ToolList from './components/ToolList';

const App = () => {
 const { token } = useAuthStore();

 return (
  <Router>
   <Routes>
    {/* Public Routes (no NavBar) */}
    <Route path="/login" element={<Login /> }/>
    {/* <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Registration />} /> */}
    <Route path="/register" element={<Registration />} />
    <Route path="/tools" element={<ToolList />} />
    <Route path="/tools/:toolId" element={<ToolDetail />} />

    {/* Protected Routes (wrapped with ProtectedLayout) */}
    <Route element={<ProtectedLayout />}>
     <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
     </Route>
     Admin-only route
     {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
      <Route path="/admin" element={<Admin />} />
     </Route> */}
    </Route>

    {/* Redirects */}
    <Route path="/" element={<Navigate to="/tools" />} />
    <Route path="*" element={<Navigate to="/tools" />} />
   </Routes>
  </Router>
 );
};

export default App;