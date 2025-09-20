import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <FileQuestion className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center w-full"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Homepage
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn-secondary inline-flex items-center justify-center w-full"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Create Account
            </Link>
            <Link
              to="/dashboard"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;