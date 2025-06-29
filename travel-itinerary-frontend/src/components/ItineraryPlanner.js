import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChangePasswordForm from './ChangePasswordForm';
import apiClient from '../api';

const ItineraryPlanner = ({ logout, user }) => {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await apiClient.post('/itineraries/', {
                destination,
                start_date: startDate,
                end_date: endDate
            });
            setSuccess(`Successfully created itinerary for ${response.data.destination}!`);
            setTimeout(() => {
                navigate('/past-trips');
            }, 2000);
        } catch (err) {
            setError('Failed to create itinerary. Please try again.');
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
                        <h1 className="text-3xl font-bold text-gray-900">Plan a New Trip</h1>
                    </div>
                </header>
                <main className="flex-1 p-6">
                    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow">
                        {showChangePassword ? (
                          <ChangePasswordForm onSuccess={() => setShowChangePassword(false)} />
                        ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <p className="text-red-500 text-center">{error}</p>}
                            {success && <p className="text-green-500 text-center">{success}</p>}
                            <div>
                                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
                                <input
                                    id="destination"
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
                                <input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Generate Itinerary
                            </button>
                        </form>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ItineraryPlanner; 