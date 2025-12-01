import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  console.log('📊 Dashboard - User from Redux:', user);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Card */}
        <div className="bg-card rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>
          {user ? (
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Welcome back, {user.name}! 👋
                </h2>
                <p className="text-muted-foreground mt-1">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Role:</strong>{" "}
                  <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Loading user information...</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/tools"
              className="flex flex-col items-center justify-center p-6 bg-primary/5 hover:bg-primary/10 rounded-lg transition border border-primary/20"
            >
              <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="font-semibold text-foreground">Browse Tools</span>
              <span className="text-sm text-muted-foreground">Discover AI tools</span>
            </Link>

            <Link
              to="/bookmarks"
              className="flex flex-col items-center justify-center p-6 bg-primary/5 hover:bg-primary/10 rounded-lg transition border border-primary/20"
            >
              <svg className="w-12 h-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="font-semibold text-foreground">My Bookmarks</span>
              <span className="text-sm text-muted-foreground">Saved collections</span>
            </Link>

            {user?.role === "startup" && (
              <Link
                to="/tools/new"
                className="flex flex-col items-center justify-center p-6 bg-green-50 hover:bg-green-100 rounded-lg transition border border-green-200"
              >
                <svg className="w-12 h-12 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-semibold text-green-700">Add New Tool</span>
                <span className="text-sm text-green-600">Submit your tool</span>
              </Link>
            )}
          </div>
        </div>

        {/* Stats (placeholder for future) */}
        <div className="bg-card rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Your Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-blue-700">Tools Reviewed</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-purple-700">Bookmarks</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-orange-700">Tools Submitted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
