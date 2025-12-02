import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/Auth';

const Registeration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();
  // Assuming useAuth, loading, error, and register function remain the same
  const { loading, error, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register({ name, email, password, role });
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    // Outer container uses custom background color
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      {/* Card uses custom bg-card, rounded-lg, and enhanced shadow/border */}
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-xl border border-border">

        {/* Title uses foreground text color and strong typography */}
        <h2 className="text-3xl font-extrabold text-foreground text-center">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Name Input Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              // Custom input styling: border-input, focus:ring-ring
              className="w-full px-4 py-2 mt-1 border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition duration-150 ease-in-out"
            />
          </div>

          {/* Email Input Field */}
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
              // Custom input styling: border-input, focus:ring-ring
              className="w-full px-4 py-2 mt-1 border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition duration-150 ease-in-out"
            />
          </div>

          {/* Password Input Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              // Custom input styling: border-input, focus:ring-ring
              className="w-full px-4 py-2 mt-1 border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition duration-150 ease-in-out"
            />
          </div>

          {/* Role Select Field */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-muted-foreground">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              // Custom select styling: border-input, focus:ring-ring
              className="w-full px-4 py-2 mt-1 border border-input rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition duration-150 ease-in-out bg-card appearance-none pr-10" // added appearance-none for better custom styling control
            >
              <option value="user">User</option>
              <option value="startup">Startup</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-destructive text-center font-medium">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            // Primary button styling
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-primary-foreground bg-primary hover:bg-orange-700/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary hover:text-orange-700/90 transition duration-150 ease-in-out"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Registeration;