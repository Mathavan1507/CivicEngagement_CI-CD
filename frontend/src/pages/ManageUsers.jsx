import { useEffect, useState } from 'react'
import API from '../api/axios'
 
export default function ManageUsers() {
  const [users,   setUsers]   = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
 
  const load = () => {
    setLoading(true)
    setMessage('')
    API.get('/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false))
  }
 
  useEffect(() => { load() }, [])
 
  const toggle = async (u) => {
    try {
      await API.put(`/admin/users/${u.id}`, { active: !u.active })
      setMessage(` ${u.name} has been ${u.active ? 'deactivated' : 'activated'}.`)
      load()
    } catch (err) {
      setMessage(' ' + (err.response?.data || 'Failed to update user.'))
    }
  }
 
  if (loading) return <p className="text-muted">Loading users...</p>
 
  return (
    <div>
      <h3 className="fw-bold mb-1">👥 Manage Users</h3>
      <p className="text-muted mb-4">Activate or deactivate regular user accounts.</p>
 
      {message && <div className="alert alert-info py-2 mb-3">{message}</div>}
      {users.length === 0 &&
        <div className="card p-4 text-center text-muted">No users found.</div>}
 
      {users.map(u => (
        <div key={u.id} className="card p-3 mb-3 d-flex flex-row justify-content-between align-items-center">
          <div>
            <h6 className="fw-bold mb-0">{u.name}</h6>
            <small className="text-muted d-block">{u.email}</small>
            {u.createdAt &&
              <small className="text-muted">Joined: {u.createdAt.substring(0, 10)}</small>}
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className={`badge fs-6 ${u.active ? 'bg-success' : 'bg-secondary'}`}>
              {u.active ? 'Active' : 'Inactive'}
            </span>
            <button
              className={`btn btn-sm ${u.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
              onClick={() => toggle(u)}>
              {u.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}