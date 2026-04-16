import { useEffect, useState } from 'react'
import API from '../api/axios'
 
const EMPTY = { title: '', category: '', description: '', tags: '', contributionType: '' }
 
const CATEGORIES = [
  'Environment', 'Health', 'Education', 'Economy',
  'Security', 'Transport', 'Technology',
]
 
const CONTRIBUTION_TYPES = [
  { value: '',                    label: '-- All Contributors (no restriction) --' },
  { value: 'EDUCATOR',            label: '🎓 Educator' },
  { value: 'CIVIC_ORGANIZATION',  label: '🏛 Civic Organization' },
  { value: 'CIVIC_MANAGEMENT',    label: '⚖ Civic Management' },
]
 
export default function PolicyCrud() {
  const [form,    setForm]    = useState(EMPTY)
  const [list,    setList]    = useState([])
  const [editId,  setEditId]  = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState('')
  const [prev_loading, setPrevLoad] = useState(false)
 
  const load = () => API.get('/admin/policies').then(r => setList(r.data))
  useEffect(() => { load() }, [])
 
  const save = async () => {
    if (!form.title || !form.category || !form.description) {
      setMessage('⚠ Title, category and description are required.')
      return
    }
    setLoading(true)
    setMessage('')
    try {
      // Send contributionType as null when empty string (so backend stores NULL)
      const payload = {
        ...form,
        contributionType: form.contributionType || null,
      }
      if (editId) {
        await API.put(`/admin/policies/${editId}`, payload)
        setMessage(' Policy updated successfully.')
      } else {
        await API.post('/admin/policies', payload)
        setMessage(' Policy added successfully.')
      }
      setForm(EMPTY)
      setEditId(null)
      setPreview('')
      load()
    } catch {
      setMessage(' Operation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
 
  const startEdit = (p) => {
    setForm({
      title:            p.title,
      category:         p.category,
      description:      p.description,
      tags:             p.tags || '',
      contributionType: p.contributionType || '',
    })
    setEditId(p.id)
    setPreview('')
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
 
  const cancelEdit = () => { setForm(EMPTY); setEditId(null); setMessage(''); setPreview('') }
 
  const del = async (id) => {
    if (!window.confirm('Delete this policy?')) return
    try {
      await API.delete(`/admin/policies/${id}`)
      setMessage(' Policy deleted.')
      load()
    } catch { setMessage(' Delete failed.') }
  }
 
  const handlePreview = async () => {
    if (!form.description.trim()) return
    setPrevLoad(true)
    setPreview('')
    try {
      const r = await API.post('/summarize', { text: form.description })
      setPreview(r.data.summary)
    } catch { setPreview(' Preview failed.') }
    finally { setPrevLoad(false) }
  }
 
  const wordCount = form.description.trim().split(/\s+/).filter(Boolean).length
 
  /** Human-readable label for the contributionType badge */
  const typeLabel = (ct) => CONTRIBUTION_TYPES.find(t => t.value === ct)?.label || '—'
 
  return (
    <div>
      <h3 className="fw-bold mb-1"> Manage Policies</h3>
      <p className="text-muted mb-4">Add, update, or delete government policies.</p>
 
      <div className="card p-4 mb-4">
        <h5 className="fw-bold mb-3">{editId ? '✏ Edit Policy' : ' Add New Policy'}</h5>
 
        <label className="form-label fw-semibold">Title *</label>
        <input className="form-control mb-3" placeholder="Policy title"
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
 
        <label className="form-label fw-semibold">Category *</label>
        <select className="form-select mb-3" value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">-- Select category --</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
 
        {/* ── NEW: Contribution Type selector ── */}
        <label className="form-label fw-semibold">Contribution Type</label>
        <select
          className="form-select mb-3"
          value={form.contributionType}
          onChange={(e) => setForm({ ...form, contributionType: e.target.value })}
        >
          {CONTRIBUTION_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <small className="text-muted d-block mb-3" style={{ marginTop: '-10px' }}>
          Restricts which contributor type can view this policy. Leave blank to allow all contributors.
        </small>
 
        <div className="d-flex justify-content-between mb-1">
          <label className="form-label fw-semibold mb-0">Description *</label>
          <small className="text-muted">{wordCount} words</small>
        </div>
        <textarea className="form-control mb-2" rows={7}
          placeholder="Full policy description..."
          value={form.description}
          onChange={(e) => { setForm({ ...form, description: e.target.value }); setPreview('') }} />
 
        {wordCount >= 50 && (
          <div className="mb-3">
            <div className="d-flex gap-2 mb-2">
              <button type="button" className="btn btn-sm btn-outline-primary"
                onClick={handlePreview} disabled={prev_loading}>
                {prev_loading ? ' Generating...' : ' Preview Auto-Summary'}
              </button>
              {preview && (
                <button type="button" className="btn btn-sm btn-outline-secondary"
                  onClick={() => setPreview('')}>Clear</button>
              )}
            </div>
            {preview && (
              <div className="p-3 rounded" style={{ background: '#fffdf0', border: '1px solid #ffe89b' }}>
                <strong>Auto-Summary Preview</strong>
                <hr className="my-2" />
                <p className="mb-0 small" style={{ lineHeight: 1.8 }}>{preview}</p>
              </div>
            )}
          </div>
        )}
 
        <label className="form-label fw-semibold">Tags</label>
        <input className="form-control mb-3" placeholder="e.g. reform, education, 2024"
          value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
 
        {message && <div className="alert alert-info py-2 mb-3">{message}</div>}
 
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={save} disabled={loading}>
            {loading ? 'Saving...' : editId ? 'Update Policy' : 'Add Policy'}
          </button>
          {editId && (
            <button className="btn btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
          )}
        </div>
      </div>
 
      <h5 className="fw-bold mb-3">All Policies ({list.length})</h5>
      {list.length === 0 &&
        <div className="card p-4 text-center text-muted">No policies yet. Add one above.</div>}
 
      {list.map(p => (
        <div key={p.id} className="card p-3 mb-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="d-flex gap-2 mb-1 flex-wrap">
                <span className="badge" style={{ background: '#27235c' }}>{p.category}</span>
                {p.contributionType && (
                  <span className="badge" style={{ background: '#97247e' }}>
                    {typeLabel(p.contributionType)}
                  </span>
                )}
                {!p.contributionType && (
                  <span className="badge bg-secondary">All Contributors</span>
                )}
              </div>
              <h6 className="fw-bold mb-1">{p.title}</h6>
              <p className="text-muted small mb-1">{p.description?.substring(0, 120)}...</p>
              {p.tags && <small className="text-muted">🏷 {p.tags}</small>}
            </div>
            <div className="d-flex gap-2 ms-3 flex-shrink-0">
              <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(p)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={() => del(p.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
 