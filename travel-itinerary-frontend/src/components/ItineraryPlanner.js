import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChangePasswordForm from './ChangePasswordForm';
import apiClient from '../api';

const ItineraryPlanner = ({ logout, user }) => {
    const [destination, setDestination] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const [tripTheme, setTripTheme] = useState([]);
    const [budget, setBudget] = useState('');
    const [pace, setPace] = useState('');
    const [travelMode, setTravelMode] = useState('');
    const [groupType, setGroupType] = useState('');
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const navigate = useNavigate();

    const themeOptions = [
        'Adventure', 'Religious', 'Cultural', 'Foodie', 
        'Relaxation', 'Romantic', 'Family-friendly'
    ];

    const budgetOptions = ['low', 'medium', 'high'];
    const paceOptions = ['relaxed', 'packed'];
    const travelModeOptions = ['walking', 'cab', 'public_transport', 'self_drive'];
    const groupTypeOptions = ['solo', 'couple', 'family', 'friends', 'senior_friendly'];

    const handleThemeChange = (theme) => {
        setTripTheme(prev => 
            prev.includes(theme) 
                ? prev.filter(t => t !== theme)
                : [...prev, theme]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await apiClient.post('/itineraries/', {
                destination,
                start_date: startDate,
                end_date: endDate,
                trip_theme: tripTheme,
                budget: budget || null,
                pace: pace || null,
                travel_mode: travelMode || null,
                group_type: groupType || null
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
            <Sidebar
              user={user}
              onShowChangePassword={() => setShowChangePassword(true)}
              logout={logout}
            />

            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold text-gray-900">Plan a New Trip</h1>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                        {showChangePassword ? (
                          <ChangePasswordForm onSuccess={() => setShowChangePassword(false)} />
                        ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && <p className="text-red-500 text-center">{error}</p>}
                            {success && <p className="text-green-500 text-center">{success}</p>}
                            
                            <div className="border-b border-gray-200 pb-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4">Trip Details</h2>
                                <div className="grid grid-cols-1 gap-4">
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
                                    <div className="grid grid-cols-2 gap-4">
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
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-lg font-medium text-gray-900">Trip Preferences</h2>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Trip Themes (Select all that apply)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {themeOptions.map((theme) => (
                                            <label key={theme} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={tripTheme.includes(theme)}
                                                    onChange={() => handleThemeChange(theme)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">{theme}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Level</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {budgetOptions.map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="budget"
                                                    value={option}
                                                    checked={budget === option}
                                                    onChange={(e) => setBudget(e.target.value)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pace Preference</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {paceOptions.map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="pace"
                                                    value={option}
                                                    checked={pace === option}
                                                    onChange={(e) => setPace(e.target.value)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 capitalize">{option}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Travel Mode</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {travelModeOptions.map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="travelMode"
                                                    value={option}
                                                    checked={travelMode === option}
                                                    onChange={(e) => setTravelMode(e.target.value)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 capitalize">{option.replace('_', ' ')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Group Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {groupTypeOptions.map((option) => (
                                            <label key={option} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="groupType"
                                                    value={option}
                                                    checked={groupType === option}
                                                    onChange={(e) => setGroupType(e.target.value)}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 capitalize">{option.replace('_', ' ')}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Generate Personalized Itinerary
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