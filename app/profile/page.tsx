'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Shield,
  Calendar,
  Activity,
  LogOut,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  Database
} from 'lucide-react';
import { useEmails } from '@/components/EmailContext';

const UserProfile = () => {
  const { data: session } = useSession();
  const { emails } = useEmails();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Calculate user statistics
  const stats = {
    totalEmails: emails.length,
    safeEmails: emails.filter(e => !e.isPotentialPhishing).length,
    phishingDetected: emails.filter(e => e.isPotentialPhishing).length,
    todayEmails: emails.filter(e => new Date(e.date).toDateString() === new Date().toDateString()).length,
    joinDate: session?.user?.email ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString() : 'N/A',
    protectionRate: emails.length > 0 ? ((emails.filter(e => !e.isPotentialPhishing).length / emails.length) * 100).toFixed(1) : 0
  };

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-500">Manage your account and security preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 text-white">
                <div className="flex flex-col items-center">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center mb-4">
                      <User className="w-12 h-12 text-teal-600" />
                    </div>
                  )}
                  <h2 className="text-2xl font-bold text-center">
                    {session?.user?.name || 'Guest User'}
                  </h2>
                  <p className="text-teal-100 text-sm mt-1">
                    {session?.user?.email || 'No email provided'}
                  </p>
                </div>
              </div>

              {/* Profile Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-teal-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Provider</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session?.user?.email?.includes('@gmail') ? 'Google (Gmail)' : 'Microsoft Outlook'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-teal-600" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Member Since</p>
                    <p className="text-sm font-medium text-gray-900">{stats.joinDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-5 h-5 text-teal-600" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Protection Rate</p>
                    <p className="text-sm font-medium text-gray-900">{stats.protectionRate}%</p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full mt-6 px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <LogOut className="w-5 h-5" />
                  {loading ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Statistics Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-teal-50 rounded-xl">
                    <Database className="w-8 h-8 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Emails</p>
                    <p className="text-3xl font-black text-gray-900">{stats.totalEmails}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Safe Emails</p>
                    <p className="text-3xl font-black text-green-600">{stats.safeEmails}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 rounded-xl">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Threats Blocked</p>
                    <p className="text-3xl font-black text-red-600">{stats.phishingDetected}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Today</p>
                    <p className="text-3xl font-black text-blue-600">{stats.todayEmails}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-bold text-gray-900">Activity Summary</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Safe Email Rate</span>
                    <span className="text-sm font-bold text-green-600">{stats.protectionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stats.protectionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">Threat Detection Rate</span>
                    <span className="text-sm font-bold text-red-600">
                      {stats.totalEmails > 0 ? ((stats.phishingDetected / stats.totalEmails) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.totalEmails > 0 ? ((stats.phishingDetected / stats.totalEmails) * 100) : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Security Status</h3>
                  <p className="text-teal-100 text-sm">Your account is protected</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <CheckCircle className="w-6 h-6 mb-2" />
                  <p className="font-semibold">Email Scanning</p>
                  <p className="text-sm text-teal-100">Active</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <CheckCircle className="w-6 h-6 mb-2" />
                  <p className="font-semibold">ML Protection</p>
                  <p className="text-sm text-teal-100">Enabled</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <CheckCircle className="w-6 h-6 mb-2" />
                  <p className="font-semibold">Auto-Sync</p>
                  <p className="text-sm text-teal-100">Every 5 min</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <CheckCircle className="w-6 h-6 mb-2" />
                  <p className="font-semibold">Real-time</p>
                  <p className="text-sm text-teal-100">Monitoring</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-6 h-6 text-teal-600" />
                <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-3 p-4 bg-teal-50 rounded-lg border border-teal-100 hover:bg-teal-100 transition-colors"
                >
                  <Activity className="w-5 h-5 text-teal-600" />
                  <div className="text-left">
                    <p className="font-semibold text-teal-900">View Dashboard</p>
                    <p className="text-xs text-teal-700">See email analytics</p>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard?view=security')}
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-semibold text-blue-900">Security Settings</p>
                    <p className="text-xs text-blue-700">Manage protection</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null;
};

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {session ? <UserProfile /> : <Login />}
    </main>
  );
}

