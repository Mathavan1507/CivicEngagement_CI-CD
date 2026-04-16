import React, { useState } from 'react';
import API from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const CONTRIBUTOR_TYPES = [
  { value: 'EDUCATOR',           label: 'Educator' },
  { value: 'CIVIC_ORGANIZATION', label: 'Civic Organization' },
  { value: 'CIVIC_MANAGEMENT',   label: 'Civic Management' },
]
 
export default function Register() {
  const [data, setData] = useState({
    name: '', email: '', password: '', role: 'USER', contributorType: ''
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
 
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (data.role === 'CONTRIBUTOR' && !data.contributorType) {
      setError('Please select your contributor type.')
      return
    }
    setLoading(true)
    try {
      await API.post('/auth/register', data)
      nav('/')
    } catch (err) {
      setError(err.response?.data || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }
 
  return (
    <div className="row vh-100 m-0">
 
      {/* Left panel */}
      <div className="col-md-6 gradient d-flex flex-column justify-content-center align-items-center p-5 text-white">
        <h2 className="fw-bold mb-3">Join CivicEngage</h2>
        <p className="text-center opacity-75">
          Be part of a growing community making government
          information accessible to everyone.
        </p>
        <ul className="mt-4 list-unstyled">
          <li className="mb-2">Browse &amp; search government policies</li>
          <li className="mb-2">Compare policies side by side</li>
          <li className="mb-2">Submit plain-language summaries</li>
          <li className="mb-2">Read community-reviewed summaries</li>
        </ul>
      </div>
 
      {/* Right panel */}
      <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
        <form className="auth-box w-100 px-5" onSubmit={submit}>
          <h3 className="mb-1 fw-bold">Create Account</h3>
          <p className="text-muted mb-4">Fill in your details to get started</p>
 
          {error && <div className="alert alert-danger py-2">{error}</div>}
 
          <label className="form-label fw-semibold">Full Name</label>
          <input className="form-control mb-3" placeholder="Your full name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })} required />
 
          <label className="form-label fw-semibold">Email Address</label>
          <input type="email" className="form-control mb-3" placeholder="you@example.com"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })} required />
 
          <label className="form-label fw-semibold">Password</label>
          <input type="password" className="form-control mb-3" placeholder="Minimum 6 characters"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            minLength={6} required />
 
          <label className="form-label fw-semibold">Register As</label>
          <select className="form-select mb-3" value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value, contributorType: '' })}>
            <option value="USER">Regular User</option>
            <option value="CONTRIBUTOR">Contributor</option>
          </select>
 
          {data.role === 'CONTRIBUTOR' && (
            <>
              <label className="form-label fw-semibold">Contributor Type</label>
              <select className="form-select mb-3" value={data.contributorType}
                onChange={(e) => setData({ ...data, contributorType: e.target.value })} required>
                <option value="">-- Select your type --</option>
                {CONTRIBUTOR_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </>
          )}
 
          <button className="btn btn-success w-100 py-2" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
 
          <p className="mt-3 text-center text-muted">
            Already have an account?{' '}
            <Link to="/" className="fw-semibold">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}