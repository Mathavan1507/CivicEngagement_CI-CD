import { useEffect, useState } from 'react'
import API from '../api/axios'
 
const TYPE_LABEL = {
  EDUCATOR:           ' Educator',
  CIVIC_ORGANIZATION: ' Civic Organization',
  CIVIC_MANAGEMENT:   ' Civic Management',
}
 
export default function ManageContributors() {
  const [contributors, setContributors] = useState([])
  const [message,      setMessage]      = useState('')
  const [loading,      setLoading]      = useState(true)
 
  const load = () => {
    setLoading(true)
    setMessage('')
    API.get('/admin/contributors').then(r => setContributors(r.data)).finally(() => setLoading(false))
  }
 
  useEffect(() => { load() }, [])
 
  const toggle = async (c) => {
    try {
      await API.put(`/admin/contributors/${c.id}`, { active: !c.active })
      setMessage(` ${c.name} has been ${c.active ? 'deactivated' : 'activated'}.`)
      load()
    } catch (err) {
      setMessage(' ' + (err.response?.data || 'Failed to update contributor.'))
    }
  }
 
  if (loading) return <p className="text-muted">Loading contributors...</p>
 
  return (
    <div>
      <h3 className="fw-bold mb-1"> Manage Contributors</h3>
      <p className="text-muted mb-4">
        Activate or deactivate Educator, Civic Organization, and Civic Management accounts.
      </p>
 
      {message && <div className="alert alert-info py-2 mb-3">{message}</div>}
      {contributors.length === 0 &&
        <div className="card p-4 text-center text-muted">No contributors found.</div>}
 
      {contributors.map(c => (
        <div key={c.id} className="card p-3 mb-3 d-flex flex-row justify-content-between align-items-center">
          <div>
            <h6 className="fw-bold mb-0">{c.name}</h6>
            <small className="text-muted d-block">{c.email}</small>
            <span className="badge mt-1" style={{ background: '#97247e' }}>
              {TYPE_LABEL[c.contributorType] || c.contributorType}
            </span>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className={`badge fs-6 ${c.active ? 'bg-success' : 'bg-secondary'}`}>
              {c.active ? 'Active' : 'Inactive'}
            </span>
            <button
              className={`btn btn-sm ${c.active ? 'btn-outline-danger' : 'btn-outline-success'}`}
              onClick={() => toggle(c)}>
              {c.active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}