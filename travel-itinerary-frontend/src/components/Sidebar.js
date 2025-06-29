import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ onShowChangePassword, user, logout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
      <div className="px-8 py-6">
        <Link to="/dashboard" className="text-2xl font-semibold hover:underline cursor-pointer">PlanMyTrip</Link>
      </div>
      <nav className="flex-1 px-4 py-2">
        <Link to="/planner" className="block px-4 py-2 mt-2 text-sm text-gray-300 rounded hover:bg-gray-700">
          Plan a New Trip
        </Link>
        <Link to="/past-trips" className="block px-4 py-2 mt-2 text-sm text-gray-300 rounded hover:bg-gray-700">
          View Past Trips
        </Link>
        <div className="mt-4">
          <button
            className="flex items-center w-full px-4 py-2 text-sm text-gray-300 rounded hover:bg-gray-700 focus:outline-none"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <span>Profile</span>
            <svg className={`ml-2 w-4 h-4 transition-transform ${profileOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          {profileOpen && (
            <div className="ml-4 mt-2 text-gray-200 text-sm">
              <div className="mb-2">
                <div><span className="font-semibold">Name:</span> {user?.name || user?.username || 'N/A'}</div>
                {user?.email && <div><span className="font-semibold">Email:</span> {user.email}</div>}
                {user?.mobile_number && <div><span className="font-semibold">Mobile:</span> {user.mobile_number}</div>}
                {user?.address && <div><span className="font-semibold">Address:</span> {user.address}</div>}
              </div>
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-2 rounded text-xs"
                onClick={onShowChangePassword}
              >
                Change Password
              </button>
            </div>
          )}
        </div>
      </nav>
      <div className="px-8 py-6 mt-auto">
        <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 