import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChangePasswordForm from './ChangePasswordForm';
import apiClient from '../api';

const PastTrips = ({ token, logout, user }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrips = async () => {
            if (!token) return;
            setLoading(true);
            try {
                const response = await apiClient.get('/itineraries/');
                setTrips(response.data);
            } catch (err) {
                setError('Failed to fetch past trips.');
            }
            setLoading(false);
        };

        fetchTrips();
    }, [token]);

    const handleDownload = async (itineraryId, filename) => {
        try {
            const response = await apiClient.get(`/itineraries/${itineraryId}/download`, {
                responseType: 'blob', // Important
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to download PDF.');
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar
              user={user}
              onShowChangePassword={() => setShowChangePassword(true)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Past Trips</h1>
                    </div>
                </header>
                <main className="flex-1 p-6">
                    <div className="bg-white p-8 rounded-lg shadow">
                        {showChangePassword ? (
                          <ChangePasswordForm onSuccess={() => setShowChangePassword(false)} />
                        ) : loading ? (
                            <p>Loading trips...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            trips.length === 0 ? (
                                <div className="flex flex-col items-center">
                                  <p>You haven't planned any trips yet.</p>
                                  <button
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => navigate('/planner')}
                                  >
                                    Plan a New Trip
                                  </button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {trips.map((trip) => (
                                        <li key={trip.id} className="py-4 flex justify-between items-center">
                                            <div>
                                                <p className="text-lg font-semibold text-gray-900">{trip.destination}</p>
                                                <p className="text-sm text-gray-500">{trip.start_date} to {trip.end_date}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleDownload(trip.id, trip.pdf_path)}
                                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Download PDF
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PastTrips; 