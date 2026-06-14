import React from 'react'
import { Navigate } from 'react-router-dom';
import AppLayout from '../layout/AppLayout';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const ProtectedRoute = () => {
    const {isAuthenticated,loading} = useAuth()
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-5xl text-blue-400">
                <h1>Loading...</h1>
            </div>
        )
    }

    return (
        isAuthenticated ? (
            <AppLayout>
                <Outlet />
            </AppLayout>) : (<Navigate to="/login" replace />)
    )
}

export default ProtectedRoute