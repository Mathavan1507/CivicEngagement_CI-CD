import { Link, Outlet, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
 
export default function UserLayout() {
  const { name, logout } = useContext(AuthContext)
  const loc = useLocation()
  const a = (path) => loc.pathname === path ? 'active' : ''
 
  return (
    <div className="d-flex">
      <div className="sidebar d-flex flex-column">
        <h5 className="fw-bold mb-1">CivicEngage</h5>
        <small className="mb-4 text-white-50">Welcome, {name}</small>
 
        <Link to="/dashboard" className={`mb-1 ${a('/dashboard')}`}>Dashboard</Link>
        <Link to="/policies"  className={`mb-1 ${a('/policies')}`}>All Policies</Link>
        <Link to="/compare"   className={`mb-1 ${a('/compare')}`}>Compare Policies</Link>
 
        <div className="mt-auto pt-3">
          <button className="btn btn-danger w-100" onClick={logout}>🚪 Logout</button>
        </div>
      </div>
 
      <div className="flex-grow-1" style={{ background: '#f4f6f9', minHeight: '100vh' }}>
        <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm">
          <h6 className="mb-0">Welcome, <strong>{name}</strong></h6>
          <span className="badge px-3 py-2" style={{ background: '#27235c' }}>USER</span>
        </div>
        <div className="p-4"><Outlet /></div>
      </div>
    </div>
  )
}
 