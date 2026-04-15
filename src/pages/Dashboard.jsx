import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../config/api';

export default function Dashboard() {
  const { user, idToken, signOut, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [backendConnected, setBackendConnected] = useState(false);
  const [profileData, setProfileData] = useState(null);

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
    try {
      const result = await api.getProfile(idToken);
      setProfileData(result.profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="space-x-3">
              <Link
                to="/profile"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Backend Status */}
          {/* <div className={`mb-6 p-3 rounded ${
            backendConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <p className="font-semibold">
              Backend Status: {backendConnected ? '✓ Connected to Python API' : '✗ Not connected to Python backend'}
            </p>
            {!backendConnected && (
              <p className="text-sm mt-1">
                Make sure your Python Flask server is running on port 5000
              </p>
            )}
          </div> */}

          {/* Email Verification Warning */}
          {user && !user.emailVerified && (
            <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
              <p className="font-bold">Email not verified!</p>
              <p>Please check your inbox and verify your email address.</p>
              <button
                onClick={handleResendVerification}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                Resend verification email
              </button>
            </div>
          )}

          {/* User Information */}
          <div className="space-y-4">
            <div className="border-b pb-3">
              <h2 className="text-lg font-semibold">User Information</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <span className="font-medium">Email:</span> {user?.email}
              </div>
              <div>
                <span className="font-medium">Email Verified:</span>{' '}
                {user?.emailVerified ? '✓ Yes' : '✗ No'}
              </div>
              <div>
                <span className="font-medium">User ID:</span> {user?.uid}
              </div>
              {profileData && (
                <>
                  <div>
                    <span className="font-medium">Display Name:</span> {profileData.display_name || 'Not set'}
                  </div>
                  <div>
                    <span className="font-medium">Bio:</span> {profileData.bio || 'Not set'}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}