'use client'; // This component now uses client-side hooks for session management

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// 1. Define the type for the UserProfile component's props
interface UserProfileProps {
  name: string | null | undefined;
  email: string | null | undefined;
  imageUrl: string | null | undefined;
}

// 2. Define the UserProfile component
const UserProfile: React.FC<UserProfileProps> = ({ name, email, imageUrl }) => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-lg p-6 text-center transform hover:scale-105 transition-transform duration-300">
      <div className="mb-4">
        {imageUrl && name && (
            <img
              src={imageUrl}
              alt={`${name}'s profile picture`}
              width={128}
              height={128}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-teal-600 shadow-md"
            />

        )}
      </div>
      <h1 className="text-2xl font-bold text-gray-900">
        {name || 'Guest'}
      </h1>
      <p className="text-md text-gray-500 mt-1">
        {email || 'No email provided'}
      </p>
      <div className="my-6 border-t border-gray-200"></div>
      <button
        onClick={() => signOut()}
        className="w-full px-4 py-2 text-white font-semibold bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all duration-300"
      >
        Logout
      </button>
    </div>
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

