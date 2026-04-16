import React from 'react';
import { createContext, useState } from 'react';
 
export const AuthContext = createContext()
 
export const AuthProvider = ({ children }) => {
  const [token,           setToken]   = useState(localStorage.getItem('token'))
  const [role,            setRole]    = useState(localStorage.getItem('role'))
  const [name,            setName]    = useState(localStorage.getItem('name'))
  const [contributorType, setContrib] = useState(localStorage.getItem('contributorType'))
  const [userId,          setUserId]  = useState(localStorage.getItem('userId'))
 
  const login = (res) => {
    const { token, role, contributorType, name, userId } = res
    localStorage.setItem('token',           token)
    localStorage.setItem('role',            role)
    localStorage.setItem('name',            name)
    localStorage.setItem('contributorType', contributorType || '')
    localStorage.setItem('userId',          userId || '')
 
    setToken(token)
    setRole(role)
    setName(name)
    setContrib(contributorType || '')
    setUserId(userId || '')
  }
 
  const logout = () => {
    localStorage.clear()
    window.location.href = '/'
  }
 
  return (
    <AuthContext.Provider value={{ token, role, name, contributorType, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
 