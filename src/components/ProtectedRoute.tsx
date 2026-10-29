import { authCreatedContext } from '@/context/AuthContext'
import React, { useContext } from 'react'
import { Navigate } from 'react-router'

type ReactChildren = {
    children: React.ReactNode
}

export default function ProtectedRoute({children}:ReactChildren) {
    
    const auth = useContext(authCreatedContext);
    if (!auth) return <Navigate to="/login" />;

    const { token } = auth;

    if (!token) {
        return <Navigate to="/login"/>
    } else {
        return <>
        {children}
        </>
    }
}
