import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChangePasswordForm from './ChangePasswordForm';
import { Player } from '@lottiefiles/react-lottie-player';
import worldPlaneAnimation from '../assets/Animation - 1751119366601.json';
// You need to install lottie-react: npm install @lottiefiles/react-lottie-player

const Dashboard = ({ logout, user }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        user={user}
        onShowChangePassword={() => setShowChangePassword(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <main className="flex-1 flex flex-col items-center justify-center w-full p-6">
          <div className="bg-white p-8 rounded-lg shadow flex flex-col items-center w-full max-w-xl">
            {showChangePassword ? (
              <ChangePasswordForm onSuccess={() => setShowChangePassword(false)} />
            ) : (
              <>
                <Player
                  autoplay
                  loop
                  src={worldPlaneAnimation}
                  style={{ height: '220px', width: '220px' }}
                />
                <h2 className="text-2xl font-bold mb-4 mt-2">Welcome back{user && (user.name || user.username) ? `, ${user.name || user.username}` : ''}!</h2>
                <p className="text-gray-700">What would you like to do today? Use the links in the sidebar to get started.</p>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 