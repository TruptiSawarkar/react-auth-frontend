import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../config/api';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, idToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    display_name: '',
    bio: ''
  });

  useEffect(() => {
    if (idToken) {
      loadProfileAndData();
    }
  }, [idToken]);

  const loadProfileAndData = async () => {
    try {
      setLoading(true);
      const profileResult = await api.getProfile(idToken);
      const dataResult = await api.getUserData(idToken);
      
      setProfile(profileResult.profile);
      setUserData(dataResult.data);
      setFormData({
        display_name: profileResult.profile.display_name || '',
        bio: profileResult.profile.bio || ''
      });
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    
    try {
      await api.updateProfile(idToken, formData);
      setMessage('Profile updated successfully!');
      await loadProfileAndData();
    } catch (error) {
      setMessage('Failed to update profile: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleCustomDataSave = async () => {
    setUpdating(true);
    setMessage('');
    
    try {
      const customData = {
        favoriteColor: document.getElementById('favoriteColor')?.value || '',
        notes: document.getElementById('notes')?.value || ''
      };
      
      await api.saveUserData(idToken, customData);
      setMessage('Custom data saved successfully!');
      await loadProfileAndData();
    } catch (error) {
      setMessage('Failed to save custom data: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-4">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700">
            ← Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">User Profile</h1>
          
          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Account Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Email Verified:</span> {user?.emailVerified ? '✓ Yes' : '✗ No'}</p>
              <p><span className="font-medium">User ID:</span> {user?.uid}</p>
            </div>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
          
          <div>
            <h2 className="text-lg font-semibold mb-3">Custom Data</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Favorite Color
                </label>
                <input
                  type="text"
                  id="favoriteColor"
                  defaultValue={userData?.favoriteColor || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Blue, Red, Green"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  defaultValue={userData?.notes || ''}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your private notes..."
                />
              </div>
              
              <button
                onClick={handleCustomDataSave}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save Custom Data'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}