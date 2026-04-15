import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../config/api';

export default function Dashboard() {
  const { user, idToken, signOut, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [backendConnected, setBackendConnected] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkBackendConnection();
    if (idToken) {
      loadProfile();
    }
  }, [idToken]);

  const checkBackendConnection = async () => {
    const connected = await api.testConnection();
    setBackendConnected(connected);
  };

  const loadProfile = async () => {
    setLoading(true);
    try {
      const result = await api.getProfile(idToken);
      setProfileData(result.profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleResendVerification = async () => {
    const result = await resendVerificationEmail();
    alert(result.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar - Responsive */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
              </div>
              <div className="hidden md:block ml-3">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Auth Dashboard
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/profile"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
              >
                Sign Out
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {user?.email?.split('@')[0] || 'User'}
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Manage your account and profile information
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Backend Status Card */}
          {/* <div className={`rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl ${
            backendConnected ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
          }`}>
            <div className="flex items-center justify-between">
              
              <div className="h-12 w-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                {backendConnected ? (
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </div>
          </div> */}

          {/* Email Status Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-opacity-90 text-sm font-medium">Email Status</p>
                <p className="text-white text-xl sm:text-2xl font-bold mt-1">
                  {user?.emailVerified ? 'Verified' : 'Unverified'}
                </p>
              </div>
              <div className="h-12 w-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Account Age Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-opacity-90 text-sm font-medium">Member Since</p>
                <p className="text-white text-lg sm:text-xl font-bold mt-1">
                  {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="h-12 w-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Email Verification Warning - Responsive */}
        {user && !user.emailVerified && (
          <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg p-4 sm:p-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start sm:items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-800">Email not verified!</p>
                  <p className="text-xs text-yellow-700 mt-1">Please check your inbox and verify your email address.</p>
                </div>
              </div>
              <button
                onClick={handleResendVerification}
                className="mt-3 sm:mt-0 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
              >
                Resend Email
              </button>
            </div>
          </div>
        )}

        {/* User Information Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4 border-b">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">User Information</h2>
            <p className="text-sm text-gray-600 mt-1">Your account details and settings</p>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">Loading profile...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {/* Email */}
              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center">
                <div className="sm:w-1/3">
                  <span className="text-sm font-medium text-gray-500">Email Address</span>
                </div>
                <div className="sm:w-2/3 mt-1 sm:mt-0">
                  <span className="text-sm text-gray-900 break-all">{user?.email}</span>
                  {user?.emailVerified && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* User ID */}
              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center">
                <div className="sm:w-1/3">
                  <span className="text-sm font-medium text-gray-500">User ID</span>
                </div>
                <div className="sm:w-2/3 mt-1 sm:mt-0">
                  <span className="text-sm text-gray-900 break-all font-mono">{user?.uid}</span>
                </div>
              </div>

              {/* Display Name */}
              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center">
                <div className="sm:w-1/3">
                  <span className="text-sm font-medium text-gray-500">Display Name</span>
                </div>
                <div className="sm:w-2/3 mt-1 sm:mt-0">
                  <span className="text-sm text-gray-900">
                    {profileData?.display_name || 'Not set'}
                  </span>
                  {!profileData?.display_name && (
                    <Link to="/profile" className="ml-2 text-xs text-blue-600 hover:text-blue-700">
                      Add now →
                    </Link>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-start">
                <div className="sm:w-1/3">
                  <span className="text-sm font-medium text-gray-500">Bio</span>
                </div>
                <div className="sm:w-2/3 mt-1 sm:mt-0">
                  <p className="text-sm text-gray-900">
                    {profileData?.bio || 'No bio added yet'}
                  </p>
                  {!profileData?.bio && (
                    <Link to="/profile" className="inline-block mt-1 text-xs text-blue-600 hover:text-blue-700">
                      Add bio →
                    </Link>
                  )}
                </div>
              </div>

              {/* Last Login (if available) */}
              {user?.metadata?.lastSignInTime && (
                <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center bg-gray-50">
                  <div className="sm:w-1/3">
                    <span className="text-sm font-medium text-gray-500">Last Login</span>
                  </div>
                  <div className="sm:w-2/3 mt-1 sm:mt-0">
                    <span className="text-sm text-gray-900">
                      {new Date(user.metadata.lastSignInTime).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Link
              to="/profile"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-center"
            >
              Edit Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2026 Auth Dashboard. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}