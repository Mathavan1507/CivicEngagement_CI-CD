import { Link, Outlet, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
 
export default function AdminLayout() {
  const { name, logout } = useContext(AuthContext)
  const loc = useLocation()
  const a = (path) => loc.pathname === path ? 'active' : ''
 
  return (
    <div className="d-flex">
      <div className="sidebar d-flex flex-column">
        <h5 className="fw-bold mb-1">CivicEngage</h5>
        <small className="mb-4 text-white-50">Admin Panel</small>
 
        <Link to="/admin/dashboard"    className={`mb-1 ${a('/admin/dashboard')}`}>Dashboard</Link>
        <Link to="/admin/policies"     className={`mb-1 ${a('/admin/policies')}`}>Manage Policies</Link>
        <Link to="/admin/users"        className={`mb-1 ${a('/admin/users')}`}>Manage Users</Link>
        <Link to="/admin/contributors" className={`mb-1 ${a('/admin/contributors')}`}>Manage Contributors</Link>
        <Link to="/admin/review"       className={`mb-1 ${a('/admin/review')}`}>Review Contributions</Link>
 
        <div className="mt-auto pt-3">
          <button className="btn btn-danger w-100" onClick={logout}>Logout</button>
        </div>
      </div>
 
      <div className="flex-grow-1" style={{ background: '#f4f6f9', minHeight: '100vh' }}>
        <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm">
          <h6 className="mb-0">Welcome back, <strong>{name}</strong></h6>
          <span className="badge bg-danger px-3 py-2">ADMIN</span>
        </div>
        <div className="p-4"><Outlet /></div>
      </div>
    </div>
  )
}