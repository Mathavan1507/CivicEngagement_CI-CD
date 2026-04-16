import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import API from '../api/axios'
 
ChartJS.register(ArcElement, Tooltip, Legend)
 
export default function AdminDashboard() {
  const [stats,    setStats]    = useState({})
  const [policies, setPolicies] = useState([])
  const nav = useNavigate()
 
  useEffect(() => {
    API.get('/admin/stats').then(r => setStats(r.data)).catch(() => {})
    API.get('/admin/policies').then(r => setPolicies(r.data)).catch(() => {})
  }, [])
 
  const chartData = {
    labels: ['Policies', 'Users', 'Summaries'],
    datasets: [{
      data: [
        stats.totalPolicies  || 0,
        stats.totalUsers     || 0,
        stats.totalSummaries || 0,
      ],
      backgroundColor: ['#27235c', '#97247e', '#e01950'],
      borderWidth: 0,
    }],
  }
 
  const StatCard = ({ value, label, color }) => (
    <div className="col-md-3">
      <div className="card p-3 text-center">
        <h2 className="fw-bold" style={{ color }}>{value ?? 0}</h2>
        <p className="mb-0 text-muted">{label}</p>
      </div>
    </div>
  )
 
  const QuickCard = ({ emoji, title, subtitle, path, color }) => (
    <div className="col-md-3">
      <div className="card p-3 text-center"
           style={{ cursor: 'pointer', borderTop: `4px solid ${color}` }}
           onClick={() => nav(path)}>
        <h5>{emoji} {title}</h5>
        <p className="text-muted small mb-0">{subtitle}</p>
      </div>
    </div>
  )
 
  return (
    <div>
      <h3 className="fw-bold mb-1"> Admin Dashboard</h3>
      <p className="text-muted mb-4">Platform overview and quick actions.</p>
 
      <div className="row g-3 mb-4">
        <StatCard value={stats.totalPolicies}  label="Total Policies"   color="#27235c" />
        <StatCard value={stats.totalUsers}     label="Registered Users" color="#97247e" />
        <StatCard value={stats.totalSummaries} label="Total Summaries"  color="#e01950" />
        <StatCard value={stats.pendingReviews} label="Pending Reviews"  color="#fd7e14" />
      </div>
 
      <div className="row g-3 mb-4">
        <QuickCard emoji="" title="Manage Policies"  subtitle="Add, update, delete"        path="/admin/policies"     color="#27235c" />
        <QuickCard emoji="" title="Manage Users"     subtitle="Activate or deactivate"     path="/admin/users"        color="#97247e" />
        <QuickCard emoji="" title="Contributors"     subtitle="Manage contributor accounts" path="/admin/contributors" color="#e01950" />
        <QuickCard emoji="" title="Review Summaries" subtitle="Approve or reject"          path="/admin/review"       color="#fd7e14" />
      </div>
 
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card p-3">
            <h6 className="fw-bold mb-3">Distribution</h6>
            <Pie data={chartData} />
          </div>
        </div>
        <div className="col-md-8">
          <div className="card p-3">
            <h6 className="fw-bold mb-3">Recent Policies</h6>
            {policies.slice(0, 6).map(p => (
              <div key={p.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                <div>
                  <strong className="d-block">{p.title}</strong>
                  <small className="text-muted">{p.category}</small>
                </div>
                <span className="text-muted small">{p.views}</span>
              </div>
            ))}
            {policies.length === 0 &&
              <p className="text-muted text-center mt-3">No policies yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}