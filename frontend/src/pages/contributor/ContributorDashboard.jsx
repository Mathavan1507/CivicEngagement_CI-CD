import { useEffect, useState, useContext } from 'react'
import API from '../../api/axios'
import { AuthContext } from '../../context/AuthContext'
 
const TYPE_LABEL = {
  EDUCATOR:           ' Educator',
  CIVIC_ORGANIZATION: ' Civic Organization',
  CIVIC_MANAGEMENT:   ' Civic Management',
}
 
export default function ContributorDashboard() {
  const { name, contributorType } = useContext(AuthContext)
  const [policies, setPolicies] = useState([])
 
  useEffect(() => {
    // GET /api/policies — the backend automatically filters by contributorType
    // for CONTRIBUTOR role, so no extra params needed here.
    API.get('/policies').then(r => setPolicies(r.data)).catch(() => {})
  }, [])
 
  return (
    <div>
      <h3 className="fw-bold mb-1">Contributor Dashboard</h3>
      <p className="text-muted mb-4">
        Welcome, <strong>{name}</strong> — {TYPE_LABEL[contributorType] || 'Contributor'}
      </p>
 
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card p-3 text-center">
            <h2 className="fw-bold" style={{ color: '#27235c' }}>{policies.length}</h2>
            <p className="mb-0 text-muted">Policies Available to You</p>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card p-4">
            <h6 className="fw-bold mb-2">Your Role</h6>
            <p className="mb-1">
              As a <strong>{TYPE_LABEL[contributorType] || 'contributor'}</strong>, you help make
              government policies accessible to the public by writing plain-language summaries.
            </p>
            <p className="text-muted small mb-0">
              You can only see policies that are assigned to your contributor type
              or marked as visible to all contributors.
            </p>
          </div>
        </div>
      </div>
 
      <h5 className="fw-bold mb-3">
        Latest Policies for {TYPE_LABEL[contributorType] || 'You'}
      </h5>
 
      {policies.length === 0 && (
        <div className="card p-4 text-center text-muted">
          No policies are currently assigned to your contributor type.
        </div>
      )}
 
      <div className="row g-3">
        {policies.slice(0, 6).map(p => (
          <div key={p.id} className="col-md-6">
            <div className="card p-3">
              <div className="d-flex gap-2 mb-2 flex-wrap">
                <span className="badge" style={{ background: '#27235c', width: 'fit-content' }}>
                  {p.category}
                </span>
                {p.contributionType && (
                  <span className="badge" style={{ background: '#97247e', width: 'fit-content' }}>
                    {TYPE_LABEL[p.contributionType] || p.contributionType}
                  </span>
                )}
              </div>
              <h6 className="fw-bold mb-1">{p.title}</h6>
              <p className="text-muted small mb-0">{p.description?.substring(0, 100)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}