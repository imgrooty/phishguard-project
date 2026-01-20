'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  ShieldCheck,
  Settings,
  LogOut,
  ExternalLink,
  Calendar,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

interface UserProfileProps {
  name: string | null | undefined;
  email: string | null | undefined;
  imageUrl: string | null | undefined;
}

const UserProfile: React.FC<UserProfileProps> = ({ name, email, imageUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl"
    >
      {/* Profile Header Card */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-teal-500 to-blue-600"></div>
        <div className="px-8 pb-8 -mt-16">
          <div className="flex flex-col sm:flex-row items-end gap-6 mb-6">
            <div className="relative">
              <img
                src={imageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                alt={`${name}'s profile`}
                className="w-32 h-32 rounded-3xl object-cover border-8 border-white shadow-2xl bg-white"
              />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">{name || 'User'}</h1>
              <p className="text-gray-500 font-bold flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {email}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all mb-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-50 pt-8 mt-4">
            <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-50">
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Security Status</p>
              <div className="flex items-center gap-2 text-teal-700">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold">Active</span>
              </div>
            </div>
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-50">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Account Type</p>
              <div className="flex items-center gap-2 text-blue-700">
                <User className="w-5 h-5" />
                <span className="font-bold">Premium</span>
              </div>
            </div>
            <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-50">
              <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Member Since</p>
              <div className="flex items-center gap-2 text-purple-700">
                <Calendar className="w-5 h-5" />
                <span className="font-bold">Jan 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-teal-50 transition-colors">
              <Settings className="w-6 h-6 text-gray-400 group-hover:text-teal-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">Account Settings</h3>
          <p className="text-sm text-gray-500 font-medium">Manage your personal information and preferences.</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
              <ShieldAlert className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 tracking-tight">Security & Privacy</h3>
          <p className="text-sm text-gray-500 font-medium">Control your authentication methods and data.</p>
        </motion.div>
      </div>

      {/* Footer Link */}
      <div className="text-center mt-12">
        <a href="/dashboard" className="inline-flex items-center gap-2 text-teal-600 font-black text-xs uppercase tracking-[0.2em] hover:text-teal-700 transition-colors">
          Go to Dashboard
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
};

// 3. Define the Login component for unauthenticated users
const Login = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/login');
    }, [router]);

    return null; // nothing displayed
};

// 4. Main Home component that decides whether to show Login or Profile
export default function Home() {
  const { data: session, status } = useSession();

  // Loading state
  if (status === 'loading') {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-xl font-semibold text-gray-700">Loading...</div>
        </div>
    )
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      {session ? (
        <UserProfile
          name={session.user?.name}
          email={session.user?.email}
          imageUrl={session.user?.image}
        />
      ) : (
        <Login />
      )}
    </main>
  );
}

