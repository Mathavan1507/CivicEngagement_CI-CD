import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import API from '../../api/axios'
import { AuthContext } from '../../context/AuthContext'
 
ChartJS.register(ArcElement, Tooltip, Legend)
 
export default function UserDashboard() {
  const [trending,    setTrending]    = useState([])
  const [newPolicies, setNewPolicies] = useState([])
  const [search,      setSearch]      = useState('')
  const [summaryMap,  setSummaryMap]  = useState({}) 
  const { name } = useContext(AuthContext)
  const nav = useNavigate()
 
  useEffect(() => {
    API.get('/policies/trending').then(r => {
      setTrending(r.data)
      fetchSummariesForPolicies(r.data)
    }).catch(() => {})
 
    API.get('/policies/new').then(r => {
      setNewPolicies(r.data)
      fetchSummariesForPolicies(r.data)
    }).catch(() => {})
  }, [])
 
  // Fetch approved summaries for a batch of policies
  const fetchSummariesForPolicies = async (policies) => {
    const results = await Promise.allSettled(
      policies.map(p => API.get(`/summaries/${p.id}`))
    )
    setSummaryMap(prev => {
      const updated = { ...prev }
      policies.forEach((p, i) => {
        if (results[i].status === 'fulfilled') {
          updated[p.id] = results[i].value.data
        } else {
          updated[p.id] = []
        }
      })
      return updated
    })
  }
 
  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) nav(`/policies?search=${encodeURIComponent(search.trim())}`)
  }
 
  const chartData = {
    labels: ['Trending', 'Newly Added'],
    datasets: [{
      data: [trending.length, newPolicies.length],
      backgroundColor: ['#27235c', '#97247e'],
      borderWidth: 0,
    }],
  }
 
  // Reusable policy card with summary teaser
  const PolicyCard = ({ p, accentColor }) => {
    const approvedSummaries = summaryMap[p.id] || []
    const topSummary = approvedSummaries[0]
 
    return (
      <div className="card p-3 h-100 d-flex flex-column" style={{ cursor: 'pointer' }}>
        {/* Clickable header area */}
        <div onClick={() => nav('/policies')}>
          <div className="d-flex justify-content-between align-items-start mb-1">
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-1">{p.title}</h6>
              <span className="badge mb-2" style={{ background: accentColor }}>{p.category}</span>
            </div>
            <span className="text-muted small ms-2">👁 {p.views}</span>
          </div>
        </div>
 
        {/* Summary teaser — shown if there is at least one approved summary */}
        {topSummary ? (
          <div
            className="mt-auto p-2 rounded"
            style={{ background: '#f0f0f8', border: '1px solid #d0cce8' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="fw-semibold" style={{ color: '#27235c' }}>
                Contributor Summary
              </small>
              {approvedSummaries.length > 1 && (
                <small
                  className="text-muted"
                  style={{ cursor: 'pointer', fontSize: '0.7rem' }}
                  onClick={() => nav('/policies')}
                >
                  +{approvedSummaries.length - 1} more
                </small>
              )}
            </div>
            <p className="mb-0 small" style={{ color: '#333', lineHeight: 1.5 }}>
              {topSummary.content.substring(0, 120)}
              {topSummary.content.length > 120 ? '...' : ''}
            </p>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>
              — {topSummary.user?.name}
              {topSummary.user?.contributorType ? ` · ${topSummary.user.contributorType}` : ''}
            </small>
          </div>
        ) : (
          summaryMap[p.id] !== undefined && (
            <small className="text-muted mt-auto" style={{ fontSize: '0.72rem' }}>
              No contributor summaries yet.
            </small>
          )
        )}
      </div>
    )
  }
 
  return (
    <div>
      <div className="mb-4">
        <h3 className="fw-bold">Good day, {name} </h3>
        <p className="text-muted">Stay informed. Explore the latest government policies.</p>
      </div>
 
      <form className="d-flex gap-2 mb-4" onSubmit={handleSearch}>
        <input
          className="form-control"
          placeholder="Search for a policy..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary px-4">Search</button>
      </form>
 
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card p-3 text-center">
            <h2 className="fw-bold" style={{ color: '#27235c' }}>{trending.length}</h2>
            <p className="mb-0 text-muted">Trending Policies</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center">
            <h2 className="fw-bold" style={{ color: '#97247e' }}>{newPolicies.length}</h2>
            <p className="mb-0 text-muted">Newly Added</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 d-flex align-items-center justify-content-center" style={{ height: 130 }}>
            <Pie data={chartData} />
          </div>
        </div>
      </div>
 
      <h5 className="fw-bold mb-3"> Trending Policies</h5>
      <div className="row g-3 mb-4">
        {trending.length === 0 && <p className="text-muted ps-3">No trending policies yet.</p>}
        {trending.map(p => (
          <div key={p.id} className="col-md-6">
            <PolicyCard p={p} accentColor="#27235c" />
          </div>
        ))}
      </div>
 
      <h5 className="fw-bold mb-3"> Newly Added</h5>
      <div className="row g-3">
        {newPolicies.length === 0 && <p className="text-muted ps-3">No new policies yet.</p>}
        {newPolicies.map(p => (
          <div key={p.id} className="col-md-6">
            <PolicyCard p={p} accentColor="#97247e" />
          </div>
        ))}
      </div>
    </div>
  )
}
 