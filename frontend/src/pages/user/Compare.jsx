import React from 'react'
import { useEffect, useState } from 'react'
import API from '../../api/axios'
 
export default function Compare() {
  const [policies, setPolicies] = useState([])
  const [p1,       setP1]       = useState('')
  const [p2,       setP2]       = useState('')
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
 
  useEffect(() => {
    API.get('/policies').then(r => setPolicies(r.data))
  }, [])
 
  const compare = async () => {
    if (!p1 || !p2)  { setError('Please select two policies.'); return }
    if (p1 === p2)   { setError('Please select two different policies.'); return }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const res = await API.post('/compare', { p1: Number(p1), p2: Number(p2) })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data || 'Comparison failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
 
  const diffClass = (type) => {
    if (type === 'A_ONLY') return 'diff-block diff-a-only'
    if (type === 'B_ONLY') return 'diff-block diff-b-only'
    return 'diff-block diff-common'
  }
 
  const diffBadge = (type) => {
    if (type === 'A_ONLY') return <span className="badge bg-warning text-dark"> Only in Policy A</span>
    if (type === 'B_ONLY') return <span className="badge bg-info text-dark"> Only in Policy B</span>
    return <span className="badge bg-secondary"> Common Theme</span>
  }
 
  return (
    <div>
      <h3 className="fw-bold mb-1">⚖ Compare Policies</h3>
      <p className="text-muted mb-4">
        Select two policies to see their similarities and highlighted differences.
      </p>
 
      <div className="row g-3 mb-3">
        <div className="col-md-5">
          <label className="form-label fw-semibold">Policy A</label>
          <select className="form-select" value={p1} onChange={(e) => setP1(e.target.value)}>
            <option value="">-- Select first policy --</option>
            {policies.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
            ))}
          </select>
        </div>
        <div className="col-md-2 d-flex align-items-end justify-content-center pb-1">
          <span className="fs-4 fw-bold text-muted">vs</span>
        </div>
        <div className="col-md-5">
          <label className="form-label fw-semibold">Policy B</label>
          <select className="form-select" value={p2} onChange={(e) => setP2(e.target.value)}>
            <option value="">-- Select second policy --</option>
            {policies.map(p => (
              <option key={p.id} value={p.id}>{p.title} ({p.category})</option>
            ))}
          </select>
        </div>
      </div>
 
      {error && <div className="alert alert-warning py-2">{error}</div>}
 
      <button className="btn btn-primary px-4 mb-4" onClick={compare} disabled={loading}>
        {loading ? 'Comparing...' : '⚖ Compare Now'}
      </button>
 
      {result && (
        <div>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card p-3 h-100" style={{ borderTop: '4px solid #ffc107' }}>
                <span className="badge bg-warning text-dark mb-2">Policy A</span>
                <h6 className="fw-bold">{result.policy1?.title}</h6>
                <p className="text-muted small mb-1"><strong>Category:</strong> {result.policy1?.category}</p>
                {result.policy1?.tags &&
                  <p className="text-muted small mb-1"><strong>Tags:</strong> {result.policy1.tags}</p>}
                <p className="small mt-2">{result.policy1?.description?.substring(0, 300)}...</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card p-3 h-100" style={{ borderTop: '4px solid #00bcd4' }}>
                <span className="badge bg-info text-dark mb-2">Policy B</span>
                <h6 className="fw-bold">{result.policy2?.title}</h6>
                <p className="text-muted small mb-1"><strong>Category:</strong> {result.policy2?.category}</p>
                {result.policy2?.tags &&
                  <p className="text-muted small mb-1"><strong>Tags:</strong> {result.policy2.tags}</p>}
                <p className="small mt-2">{result.policy2?.description?.substring(0, 300)}...</p>
              </div>
            </div>
          </div>
 
          {result.insight && (
            <div className="card p-3 mb-4" style={{ background: '#f0f4ff', borderLeft: '4px solid #3f51b5' }}>
              <h6 className="fw-bold mb-1">🔎 Key Insight</h6>
              <p className="mb-0">{result.insight}</p>
            </div>
          )}
 
          <div className="d-flex gap-3 flex-wrap mb-3">
            <span className="badge bg-warning text-dark px-3 py-2"> Only in Policy A</span>
            <span className="badge bg-info text-dark px-3 py-2"> Only in Policy B</span>
            <span className="badge bg-secondary px-3 py-2"> Common Theme</span>
          </div>
 
          <h6 className="fw-bold mb-3">Detailed Comparison</h6>
          {result.blocks?.map((block, i) => (
            <div key={i} className={diffClass(block.type)}>
              <div className="mb-1">{diffBadge(block.type)}</div>
              <p className="mb-0">{block.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}