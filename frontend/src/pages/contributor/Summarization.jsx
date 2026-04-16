import { useEffect, useState } from 'react'
import API from '../../api/axios'
 
export default function Summarization() {
  const [policies,  setPolicies]  = useState([])
  const [search,    setSearch]    = useState('')
  const [summaries, setSummaries] = useState({})   
  const [submitted, setSubmitted] = useState({})   // { policyId: bool }
  const [messages,  setMessages]  = useState({})   // { policyId: string }
  const [expanded,  setExpanded]  = useState({})   // { policyId: bool }
 
  useEffect(() => {
    API.get('/policies').then(r => setPolicies(r.data)).catch(() => {})
  }, [])
 
  const handleSubmit = async (policy) => {
    const content = summaries[policy.id]?.trim()
    if (!content) {
      setMessages(prev => ({ ...prev, [policy.id]: '⚠ Please write a summary before submitting.' }))
      return
    }
    try {
      await API.post('/summaries', { policyId: policy.id, content })
      setSubmitted(prev => ({ ...prev, [policy.id]: true }))
      setMessages(prev => ({ ...prev, [policy.id]: ' Submitted! Awaiting admin approval.' }))
    } catch (err) {
      setMessages(prev => ({
        ...prev, [policy.id]: ' ' + (err.response?.data || 'Submission failed.')
      }))
    }
  }
 
  const filtered = policies.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )
 
  return (
    <div>
      <h3 className="fw-bold mb-1"> Summarization</h3>
      <p className="text-muted mb-4">
        Read each policy and write your own plain-language summary,
        then submit it for admin review.
      </p>
 
      <input className="form-control mb-4"
        placeholder="Search policies by title or category..."
        value={search} onChange={(e) => setSearch(e.target.value)} />
 
      {filtered.length === 0 && <p className="text-muted">No policies found.</p>}
 
      {filtered.map(p => (
        <div key={p.id} className="card p-4 mb-3">
 
          {/* Policy header */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span className="badge mb-1" style={{ background: '#27235c', width: 'fit-content' }}>
                {p.category}
              </span>
              <h6 className="fw-bold mb-0">{p.title}</h6>
              {p.tags && <small className="text-muted">🏷 {p.tags}</small>}
            </div>
            <button
              className="btn btn-outline-secondary btn-sm ms-3 flex-shrink-0"
              onClick={() => setExpanded(prev => ({ ...prev, [p.id]: !prev[p.id] }))}>
              {expanded[p.id] ? '▲ Hide Policy' : '▼ Read Policy'}
            </button>
          </div>
 
          {/* Full policy text — shown only when expanded */}
          {expanded[p.id] && (
            <div className="p-3 rounded mb-3"
              style={{ background: '#f8f9fa', border: '1px solid #dee2e6', lineHeight: 1.8 }}>
              <p className="mb-0 small">{p.description}</p>
            </div>
          )}
 
          {/* Always show a short preview if not expanded */}
          {!expanded[p.id] && (
            <p className="text-muted small mb-3">{p.description?.substring(0, 200)}...</p>
          )}
 
          {/* Manual summary textarea */}
          {!submitted[p.id] && (
            <>
              <label className="form-label fw-semibold">Your Summary</label>
              <textarea
                className="form-control mb-2"
                rows={4}
                placeholder="Write your plain-language summary of this policy..."
                value={summaries[p.id] || ''}
                onChange={(e) => {
                  setSummaries(prev => ({ ...prev, [p.id]: e.target.value }))
                  setMessages(prev => ({ ...prev, [p.id]: '' }))
                }}
              />
            </>
          )}
 
          {/* Message or submit button */}
          {messages[p.id] && (
            <div className={`alert py-2 mb-2 ${submitted[p.id] ? 'alert-success' : 'alert-warning'}`}>
              {messages[p.id]}
            </div>
          )}
 
          {!submitted[p.id] && (
            <button className="btn btn-success btn-sm" onClick={() => handleSubmit(p)}>
              📤 Submit for Review
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
 