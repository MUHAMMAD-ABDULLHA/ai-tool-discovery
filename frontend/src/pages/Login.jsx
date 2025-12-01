// // src/pages/LoginPage.jsx

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import useAuth from '../hooks/Auth';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();
//   const { loading, error, login } = useAuth();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const success = await login({ email, password });
//     if (success) {
//       navigate('/dashboard');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-900">Sign in to your account</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email address</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>
//           {error && <p className="text-sm text-red-600 text-center">{error}</p>}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
//           >
//             {loading ? 'Logging in...' : 'Sign in'}
//           </button>
//         </form>
//         <p className="text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/Auth';
// Import an icon library like 'lucide-react' for the Eye icon
// For example, if using lucide-react:
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // 1. New state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { loading, error, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate('/dashboard');
    }
  };

  // New function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-xl border border-border">
        <h2 className="text-3xl font-extrabold text-foreground text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input Field (Unchanged) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition duration-150 ease-in-out"
            />
          </div>

          {/* Password Input Field with Toggle */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
              Password
            </label>
            {/* Added relative positioning for the icon */}
            <div className="relative mt-1">
              <input
                id="password"
                // 2. Conditionally set the input type
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                // Added pr-10 to make space for the icon
                className="w-full px-4 py-2 border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition duration-150 ease-in-out pr-10"
              />
              {/* 3. Toggle Button/Icon */}
              <button
                type="button" // Important: use type="button" to prevent form submission
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition duration-150 ease-in-out"
              >
                {/* Conditionally render Eye or EyeOff icon */}
                {showPassword ? (
                  // Assuming EyeOff from lucide-react
                  <EyeOff className="h-5 w-5" />
                ) : (
                  // Assuming Eye from lucide-react
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-destructive text-center font-medium">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-primary-foreground bg-primary hover:bg-orange-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-primary hover:text-orange-700/90 transition duration-150 ease-in-out"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;