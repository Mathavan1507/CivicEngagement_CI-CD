import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
 
export default function RoleRoute({ children, role }) {
  const { token, role: userRole } = useContext(AuthContext)
  if (!token) return <Navigate to="/" />
  if (userRole !== role) {
    if (userRole === 'ADMIN')       return <Navigate to="/admin/dashboard" />
    if (userRole === 'CONTRIBUTOR') return <Navigate to="/contributor/dashboard" />
    return <Navigate to="/dashboard" />
  }
  return children
}