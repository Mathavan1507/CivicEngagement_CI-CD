import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../../api/axios'
 
const CATEGORIES = ['All','Environment','Health','Education','Economy','Security','Transport','Technology']
 
export default function AllPolicies() {
  const [searchParams] = useSearchParams()
  const [policies,  setPolicies]  = useState([])
  const [search,    setSearch]    = useState(searchParams.get('search') || '')
  const [category,  setCategory]  = useState('All')
  const [loading,   setLoading]   = useState(true)
  const [summaries, setSummaries] = useState({})   // { policyId: Summary[] }
  const [expanded,  setExpanded]  = useState({})   // { policyId: bool }
 
  useEffect(() => {
    API.get('/policies')
      .then(r => setPolicies(r.data))
      .finally(() => setLoading(false))
  }, [])
 
  // Fetch approved summaries for a policy when the card is expanded
  const toggleSummaries = async (policyId) => {
    const nowOpen = !expanded[policyId]
    setExpanded(prev => ({ ...prev, [policyId]: nowOpen }))
 
    if (nowOpen && !summaries[policyId]) {
      try {
        const r = await API.get(`/summaries/${policyId}`)
        setSummaries(prev => ({ ...prev, [policyId]: r.data }))
      } catch {
        setSummaries(prev => ({ ...prev, [policyId]: [] }))
      }
    }
  }
 
  const filtered = policies
    .filter(p => category === 'All' || p.category === category)
    .filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    )
 
  if (loading) return <p className="text-muted">Loading policies...</p>
 
  return (
    <div>
      <h3 className="fw-bold mb-1">All Policies</h3>
      <p className="text-muted mb-4">Browse all available government policies.</p>
 
      <input
        className="form-control mb-3"
        placeholder="Search policies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
 
      <div className="d-flex gap-2 flex-wrap mb-4">
        {CATEGORIES.map(c => (
          <button
            key={c}
            className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
 
      {filtered.length === 0 && (
        <div className="card p-4 text-center text-muted">No policies match your search.</div>
      )}
 
      <div className="row g-3">
        {filtered.map(p => {
          const policySummaries = summaries[p.id]
          const isOpen = !!expanded[p.id]
 
          return (
            <div key={p.id} className="col-md-6">
              <div className="card p-3 h-100 d-flex flex-column">
 
                <span
                  className="badge mb-2"
                  style={{ background: '#27235c', width: 'fit-content' }}
                >
                  {p.category}
                </span>
 
                <h6 className="fw-bold mb-1">{p.title}</h6>
 
                {/* <p className="text-muted small mb-2">{p.description?.substring(0, 150)}...</p> */}
 
                {p.tags && <small className="text-muted">🏷 {p.tags}</small>}
                <small className="text-muted mt-1 mb-3">👁 {p.views} views</small>
 
                <button
                  className="btn btn-sm btn-outline-primary mt-auto"
                  style={{ borderColor: '#27235c', color: '#27235c' }}
                  onClick={() => toggleSummaries(p.id)}
                >
                  {isOpen ? '▲ Hide Summaries' : '▼ View Contributor Summaries'}
                </button>
 
                {isOpen && (
                  <div className="mt-3">
                    {!policySummaries ? (
                      <p className="text-muted small">Loading summaries...</p>
                    ) : policySummaries.length === 0 ? (
                      <div
                        className="p-2 rounded text-muted small text-center"
                        style={{ background: '#f8f9fa', border: '1px dashed #dee2e6' }}
                      >
                        No approved summaries yet for this policy.
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        <small className="fw-semibold text-muted">
                           {policySummaries.length} Contributor Summary{policySummaries.length > 1 ? 'ies' : ''}
                        </small>
                        {policySummaries.map(s => (
                          <div
                            key={s.id}
                            className="p-3 rounded"
                            style={{ background: '#f0f0f8', border: '1px solid #d0cce8' }}
                          >
                            {/* Contributor info */}
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="fw-semibold small" style={{ color: '#27235c' }}>
                                👤 {s.user?.name}
                              </span>
                              {s.user?.contributorType && (
                                <span
                                  className="badge"
                                  style={{ background: '#97247e', fontSize: '0.7rem' }}
                                >
                                  {s.user.contributorType}
                                </span>
                              )}
                            </div>
 
                            {/* Summary text */}
                            <p className="mb-1 small" style={{ lineHeight: 1.6 }}>
                              {s.content}
                            </p>
 
                            {/* Submission date */}
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                              🗓 {new Date(s.submittedAt).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'short', day: 'numeric'
                              })}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}