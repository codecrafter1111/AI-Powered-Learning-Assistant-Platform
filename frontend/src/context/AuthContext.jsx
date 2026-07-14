import React, { useState, useEffect } from "react";
import { AuthContext } from "./useAuth";

/**
 * Authentication Provider component that manages user authentication state
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} AuthContext provider with authentication state and methods
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        checkAuthStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Checks the current authentication status by verifying stored token and user data
     * Updates authentication state based on localStorage data
     * @async
     * @returns {Promise<void>}
     */
    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem("token")
            const userStr = localStorage.getItem("user")

            if (token && userStr) {
                const userData = JSON.parse(userStr)
                setUser(userData)
                setIsAuthenticated(true)
            }
        } catch (error) {
            console.error("Auth check failed", error)
            logout()
        } finally {
            setLoading(false)
        }
    }

    /**
     * Logs in a user by storing their data and token, and updating authentication state
     * @param {object} userData - User information object
     * @param {string} token - Authentication token
     * @returns {void}
     */
    const login = (userData, token) => {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))

        setUser(userData)
        setIsAuthenticated(true)
    }

    /**
     * Logs out the user by clearing authentication data and redirecting to home page
     * @returns {void}
     */
    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")

        setUser(null)
        setIsAuthenticated(false)
        window.location.href = "/"
    }

    /**
     * Updates the current user's data in state and localStorage
     * @param {object} updateUserData - Object containing updated user data fields
     * @returns {void}
     */
    const updateUser = (updateUserData) => {
        const newUserData = { ...user, ...updateUserData }
        localStorage.setItem("user", JSON.stringify(newUserData))
        setUser(newUserData)
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        checkAuthStatus
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}