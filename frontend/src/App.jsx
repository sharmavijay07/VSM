import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import api from './api';
import Login from './components/Login';
import Register from './components/Register';
import SuperAdminPage from './components/SuperAdmin';
import SubAdminPage from './components/SubAdmin';
import CustomerPage from './components/CustomerPage';

const App = () => {
    const [role, setRole] = useState(localStorage.getItem('role') || 'customer');
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, [token]);

    const login = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setToken(token);
        setRole(role);
    };

    return (
        <Router>
            <div>
                <nav>
                    <Link to="/">Home</Link>
                    {role === 'superadmin' && <Link to="/superadmin">Super Admin</Link>}
                    {role === 'subadmin' && <Link to="/subadmin">Sub Admin</Link>}
                    {role === 'customer' && <Link to="/customer">Customer</Link>}
                </nav>

                <Routes>
                    <Route path="/" element={<Login login={login} />} />
                    <Route path="/register" element={<Register login={login} />} />
                    <Route path="/superadmin" element={role === 'superadmin' ? <SuperAdminPage /> : <Navigate to="/" />} />
                    <Route path="/subadmin" element={role === 'subadmin' ? <SubAdminPage /> : <Navigate to="/" />} />
                    <Route path="/customer" element={role === 'customer' ? <CustomerPage /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
