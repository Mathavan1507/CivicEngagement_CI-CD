import { useEffect, useState } from 'react'
import API from '../api/axios'
 
export default function ContributionReview() {
  const [list,    setList]    = useState([])
  const [filter,  setFilter]  = useState('PENDING')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
 
  const load = () => {
    setLoading(true)
    API.get('/admin/summaries').then(r => setList(r.data)).finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])
 
  const update = async (id, action) => {
    try {
      await API.put(`/admin/summaries/${id}/${action === 'APPROVED' ? 'approve' : 'reject'}`)
      setMessage(` Summary ${action.toLowerCase()} successfully.`)
      load()
    } catch { setMessage(' Action failed.') }
  }
 
  const filtered = list.filter(s => s.status === filter)
  const counts = {
    PENDING:  list.filter(s => s.status === 'PENDING').length,
    APPROVED: list.filter(s => s.status === 'APPROVED').length,
    REJECTED: list.filter(s => s.status === 'REJECTED').length,
  }
 
  if (loading) return <p className="text-muted">Loading contributions...</p>
 
  return (
    <div>
      <h3 className="fw-bold mb-1"> Contribution Review</h3>
      <p className="text-muted mb-4">Review and approve or reject contributor summaries.</p>
 
      {message && <div className="alert alert-info py-2 mb-3">{message}</div>}
 
      <div className="d-flex gap-2 mb-4">
        {['PENDING','APPROVED','REJECTED'].map(status => (
          <button key={status}
            className={`btn ${filter === status ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => { setFilter(status); setMessage('') }}>
            {status} ({counts[status]})
          </button>
        ))}
      </div>
 
      {filtered.length === 0 &&
        <div className="card p-4 text-center text-muted">No {filter.toLowerCase()} submissions.</div>}
 
      {filtered.map(s => (
        <div key={s.id} className="card p-4 mb-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h6 className="fw-bold mb-0">Policy: {s.policy?.title || '—'}</h6>
              <small className="text-muted">
                By: <strong>{s.user?.name || '—'}</strong> &nbsp;|&nbsp;
                {s.submittedAt ? s.submittedAt.substring(0, 10) : ''}
              </small>
            </div>
            <span className={`badge fs-6 ${
              s.status === 'PENDING'  ? 'bg-warning text-dark' :
              s.status === 'APPROVED' ? 'bg-success' : 'bg-danger'}`}>
              {s.status}
            </span>
          </div>
 
          <p className="mb-3" style={{ lineHeight: 1.75 }}>{s.content}</p>
 
          {s.status === 'PENDING' && (
            <div className="d-flex gap-2">
              <button className="btn btn-success btn-sm" onClick={() => update(s.id, 'APPROVED')}>
                 Approve
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => update(s.id, 'REJECTED')}>
                 Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
 