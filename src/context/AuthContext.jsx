import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('farmassist_token'));

    // Check if user is authenticated on app start
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const storedToken = localStorage.getItem('farmassist_token');
        const storedUser = localStorage.getItem('farmassist_user');

        if (storedToken && storedUser) {
            try {
                // Verify token is still valid
                const response = await authAPI.getCurrentUser();
                setUser(response.data.data.user);
                setToken(storedToken);
            } catch (error) {
                // Token is invalid, clear storage
                logout();
            }
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            console.log('Full response: ', response);
             console.log('Login response:', response.data); // Debug
            const { user: userData, token: userToken } = response.data.data;

            // Store in localStorage
            localStorage.setItem('farmassist_token', userToken);
            localStorage.setItem('farmassist_user', JSON.stringify(userData));

            // Update state
            setUser(userData);
            setToken(userToken);

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { user: newUser, token: userToken } = response.data.data;

            // Store in localStorage
            localStorage.setItem('farmassist_token', userToken);
            localStorage.setItem('farmassist_user', JSON.stringify(newUser));

            // Update state
            setUser(newUser);
            setToken(userToken);

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('farmassist_token');
        localStorage.removeItem('farmassist_user');

        // Clear state
        setUser(null);
        setToken(null);

        // Call logout API (optional)
        if (token) {
            authAPI.logout().catch(console.error);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            const updatedUser = response.data.data.user;

            // Update localStorage and state
            localStorage.setItem('farmassist_user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Profile update failed'
            };
        }
    };

    const changePassword = async (passwordData) => {
        try {
            const response = await authAPI.changePassword(passwordData);
            return { success: true, data: response.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Password change failed'
            };
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isAuthenticated: !!user && !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};