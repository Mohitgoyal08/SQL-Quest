import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';
import CMSChallenges from './admin/CMSChallenges';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiClient.get('/admin/analytics/summary');
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 font-bold">
        UNAUTHORIZED ACCESS
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">SQL Quest CMS</h1>
          <p className="text-gray-600">Admin Dashboard & Content Management</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.pathname = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Game
          </button>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      </header>

      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-4xl font-bold text-blue-600">{stats?.total_users || 0}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold text-gray-700">Completed Challenges</h3>
            <p className="text-4xl font-bold text-green-600">{stats?.total_completed_challenges || 0}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Attempts</h3>
            <p className="text-4xl font-bold text-purple-600">{stats?.total_challenge_attempts || 0}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow p-6">
        <CMSChallenges />
      </div>
    </div>
  );
}
