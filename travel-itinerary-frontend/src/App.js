import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ItineraryPlanner from './components/ItineraryPlanner';
import PastTrips from './components/PastTrips';
import apiClient from './api';

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                try {
                    const response = await apiClient.get('/profile');
                    setUser(response.data);
                } catch (err) {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        };
        fetchProfile();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const PrivateRoute = ({ children }) => {
        const childrenWithProps = React.cloneElement(children, { logout: handleLogout, token: token, user: user });
        return token ? childrenWithProps : <Navigate to="/login" />;
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/login" element={<Login setToken={setToken} />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <Dashboard user={user} />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/planner"
                        element={
                            <PrivateRoute>
                                <ItineraryPlanner user={user} />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/past-trips"
                        element={
                            <PrivateRoute>
                                <PastTrips user={user} />
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;