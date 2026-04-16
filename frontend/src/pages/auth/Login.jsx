import React, { useState, useContext } from 'react';import { AuthContext } from '../../context/AuthContext'
import API from '../../api/axios'
import { useNavigate, Link } from 'react-router-dom'
export default function Login() {
  const [data,    setData]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const nav = useNavigate()
 
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/auth/login', data)
      login(res.data)
      const { role } = res.data
      if (role === 'ADMIN')            nav('/admin/dashboard')
      else if (role === 'CONTRIBUTOR') nav('/contributor/dashboard')
      else                             nav('/dashboard')
    } catch (err) {
      setError(err.response?.data || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <div className="row vh-100 m-0">
 
      {/* Left panel */}
      <div className="col-md-6 gradient d-flex flex-column justify-content-center align-items-center p-5 text-white">
        <h2 className="fw-bold mb-3">CivicEngage</h2>
        <h5 className="mb-3">Community-Driven Civic Engagement</h5>
        <p className="text-center opacity-75">
          Empowering citizens to understand government policies,
          make informed decisions, and participate in civic discourse.
        </p>
        <div className="mt-4 d-flex gap-4 text-center">
          <div><h4 className="fw-bold">12,450+</h4><small>Members</small></div>
          <div><h4 className="fw-bold">3,200+</h4><small>Policies</small></div>
          <div><h4 className="fw-bold">8,900+</h4><small>Summaries</small></div>
        </div>
      </div>
 
      {/* Right panel */}
      <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
        <form className="auth-box w-100 px-5" onSubmit={submit}>
          <h3 className="mb-1 fw-bold">Welcome Back</h3>
          <p className="text-muted mb-4">Sign in to your account</p>
 
          {error && <div className="alert alert-danger py-2">{error}</div>}
 
          <label className="form-label fw-semibold">Email Address</label>
          <input type="email" className="form-control mb-3"
            placeholder="you@example.com" value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })} required />
 
          <label className="form-label fw-semibold">Password</label>
          <input type="password" className="form-control mb-4"
            placeholder="Your password" value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })} required />
 
          <button className="btn btn-primary w-100 py-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
 
          <p className="mt-3 text-center text-muted">
            No account?{' '}
            <Link to="/register" className="fw-semibold">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  )
}