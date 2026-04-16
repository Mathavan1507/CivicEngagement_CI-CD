import { Link, Outlet, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
 
const TYPE_LABEL = {
  EDUCATOR:           'Educator',
  CIVIC_ORGANIZATION: 'Civic Organization',
  CIVIC_MANAGEMENT:   'Civic Management',
}
 
export default function ContributorLayout() {
  const { name, contributorType, logout } = useContext(AuthContext)
  const loc = useLocation()
  const a = (path) => loc.pathname === path ? 'active' : ''
  const label = TYPE_LABEL[contributorType] || 'Contributor'
 
  return (
    <div className="d-flex">
      <div className="sidebar d-flex flex-column">
        <h5 className="fw-bold mb-1">CivicEngage</h5>
        <small className="mb-1 text-white-50">{name}</small>
        <small className="mb-4 text-white-50">{label}</small>
 
        <Link to="/contributor/dashboard"     className={`mb-1 ${a('/contributor/dashboard')}`}>Dashboard</Link>
        <Link to="/contributor/summarization" className={`mb-1 ${a('/contributor/summarization')}`}>Summarization</Link>
 
        <div className="mt-auto pt-3">
          <button className="btn btn-danger w-100" onClick={logout}>🚪 Logout</button>
        </div>
      </div>
 
      <div className="flex-grow-1" style={{ background: '#f4f6f9', minHeight: '100vh' }}>
        <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-white shadow-sm">
          <h6 className="mb-0">Welcome, <strong>{name}</strong></h6>
          <span className="badge px-3 py-2" style={{ background: '#97247e' }}>{label}</span>
        </div>
        <div className="p-4"><Outlet /></div>
      </div>
    </div>
  )
}