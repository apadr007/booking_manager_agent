'use client'
import { useState, useEffect } from 'react'

const TODAY = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

const STATUS_PILL = { Researched: '#9B8B7A', Pitched: '#C9A87A', Confirmed: '#6DBF8A', Done: '#8B6F47', Pass: '#4A4A4A' }
const NET_PILL    = { Researched: '#9B8B7A', Registered: '#C9A87A', Attended: '#6DBF8A', 'Followed Up': '#8BC4C9', Pass: '#4A4A4A' }
const SPEAKING_STATUSES  = ['Researched', 'Pitched', 'Confirmed', 'Done', 'Pass']
const NETWORKING_STATUSES = ['Researched', 'Registered', 'Attended', 'Followed Up', 'Pass']

// ── Default data ──────────────────────────────────────────────
const DEFAULT_SPEAKING = [
  { id: 1,  name: 'BIO International Convention',    location: 'Boston, MA',        date: 'Jun 2026',   fee: '$1,500–5,000',       status: 'Researched', contact: 'bio.org',                  deadline: 'Jan 2026',       link: 'https://www.bio.org',                   beginner: '⭐⭐ Large stage — leadership track accepts practitioners',     notes: "World's largest biotech event; leadership & workforce development track fits Alex well." },
  { id: 2,  name: 'SCOPE Summit',                    location: 'Orlando, FL',        date: 'Feb 2026',   fee: 'Travel + honorarium', status: 'Researched', contact: 'scopesummit.com/speak',    deadline: 'Sep 2025',       link: 'https://www.scopesummit.com',           beginner: '⭐⭐⭐ Accessible with clear niche expertise',                  notes: 'Clinical ops leaders in pharma/biotech — strong audience for scientist-to-executive coaching.' },
  { id: 3,  name: 'ICF Converge',                    location: 'TBD',                date: 'Fall 2026',  fee: 'Honorarium',          status: 'Researched', contact: 'coachingfederation.org',   deadline: '6 months prior', link: 'https://www.coachingfederation.org',    beginner: '⭐⭐⭐ Welcoming to credentialed coaches with a niche',           notes: 'ICF flagship conference — ideal for showcasing AI + coaching methodology.' },
  { id: 4,  name: 'eyeforpharma Philadelphia',        location: 'Philadelphia, PA',   date: 'Apr 2026',   fee: '$2,000–4,000',        status: 'Researched', contact: 'eyeforpharma.com',         deadline: 'Nov 2025',       link: 'https://www.eyeforpharma.com',          beginner: '⭐⭐⭐ Practitioner voices welcomed in leadership sessions',      notes: 'Senior pharma commercial and leadership audience — coaching and AI leadership topics fit well.' },
  { id: 5,  name: 'ATD International Conference',    location: 'Washington, DC',     date: 'May 2026',   fee: 'Travel + honorarium', status: 'Researched', contact: 'td.org/events',            deadline: 'Oct 2025',       link: 'https://www.td.org',                    beginner: '⭐⭐⭐⭐ Very open to coaches and practitioners',                 notes: 'Association for Talent Development — ideal for AI leadership and coaching methodology content.' },
  { id: 6,  name: 'LEAP HR Life Sciences',           location: 'Various US cities',  date: 'Fall 2026',  fee: '$2,000–5,000',        status: 'Researched', contact: 'leaphr.co',               deadline: 'Rolling',        link: 'https://www.leaphr.co',                 beginner: '⭐⭐⭐ Good fit — niche HR/people leaders in pharma/biotech',    notes: 'Targets HR & people leaders in life sciences — strong fit for coaching offer.' },
  { id: 7,  name: 'Colorado SHRM Annual Conference', location: 'Denver, CO',         date: 'Sep 2026',   fee: 'Travel + honorarium', status: 'Researched', contact: 'coshrm.org',              deadline: 'Spring 2026',    link: 'https://www.coshrm.org',                beginner: '⭐⭐⭐⭐ Excellent local entry point',                            notes: 'Strong HR network in Colorado — direct access to local biotech/pharma HR leaders.' },
]

const DEFAULT_NETWORKING = [
  { id: 1,  name: 'Colorado Bioscience Association', location: 'Denver/Boulder, CO', date: 'Monthly 2026', type: 'Meetup',     cost: 'Free–$50',     status: 'Researched', contact: 'coloradobioscience.org',   link: 'https://www.coloradobioscience.org', value: '⭐⭐⭐⭐⭐ Best local biotech access',                            notes: 'Top local network for CO biotech client pipeline — monthly mixers and leadership forums.' },
  { id: 2,  name: 'BIO International Convention',    location: 'Boston, MA',         date: 'Jun 2026',     type: 'Conference', cost: '$1,200–3,000', status: 'Researched', contact: 'bio.org',                  link: 'https://www.bio.org',               value: "⭐⭐⭐⭐ World's largest biotech gathering",                       notes: 'Unmatched density of biotech executives — worth attending even without a speaking slot.' },
  { id: 3,  name: 'SHRM Annual Conference & Expo',   location: 'San Diego, CA',      date: 'Jun 2026',     type: 'Conference', cost: '$1,800–2,500', status: 'Researched', contact: 'shrm.org/events',          link: 'https://www.shrm.org',              value: '⭐⭐⭐⭐ HR decision-makers who hire coaches',                     notes: 'Large audience of CHROs and people leaders in biotech/pharma — strong prospecting ground.' },
  { id: 4,  name: 'MedCity CONVERGE',               location: 'Philadelphia, PA',   date: 'Jun 2026',     type: 'Conference', cost: '$800–1,500',   status: 'Researched', contact: 'medcitynews.com/converge', link: 'https://medcitynews.com',           value: '⭐⭐⭐⭐ Healthcare innovation leaders and investors',              notes: 'Emerging biotech + digital health audience — strong fit for coaching and AI consulting.' },
  { id: 5,  name: 'Biocom Life Sciences Summit',    location: 'San Diego, CA',      date: 'Oct 2026',     type: 'Conference', cost: '$500–1,000',   status: 'Researched', contact: 'biocom.org/events',        link: 'https://www.biocom.org',            value: '⭐⭐⭐⭐ Senior CA biotech executives and investors',              notes: 'Top West Coast biotech networking event — leadership and workforce sessions align well.' },
  { id: 6,  name: 'Denver Startup Week',            location: 'Denver, CO',         date: 'Sep 2026',     type: 'Meetup',     cost: 'Free',         status: 'Researched', contact: 'denverstartupweek.org',    link: 'https://www.denverstartupweek.org', value: '⭐⭐⭐ Local tech and entrepreneurship network',                  notes: 'Good for AI consulting pipeline and building Boulder/Denver professional visibility.' },
  { id: 7,  name: 'ICF Converge 2026',              location: 'TBD',                date: 'Fall 2026',    type: 'Summit',     cost: '$500–1,200',   status: 'Researched', contact: 'coachingfederation.org',   link: 'https://www.coachingfederation.org', value: '⭐⭐⭐ Coaching peers + referral partners',                       notes: 'Good for referral relationships and showcasing AI + coaching methodology.' },
]

// ── Helpers ───────────────────────────────────────────────────
function storage_get(key) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null } catch { return null }
}
function storage_set(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

function parseAIResponse(raw) {
  const clean = raw.split('```json').join('').split('```').join('').trim()
  const match = clean.match(/\[[\s\S]*/)
  if (!match) throw new Error('No JSON array found in response')
  let jsonStr = match[0]
  if (!jsonStr.trimEnd().endsWith(']')) {
    const lastClose = jsonStr.lastIndexOf('}')
    if (lastClose === -1) throw new Error('No valid objects found')
    jsonStr = jsonStr.slice(0, lastClose + 1) + ']'
  }
  return JSON.parse(jsonStr)
}

async function callClaude(prompt) {
  // Calls our own API route — key stays server-side
  const resp = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const data = await resp.json()
  if (data.error) throw new Error(data.error.message)
  return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('')
}

async function fetchSpeaking(existing) {
  const skip = existing.map(e => e.name).join(', ')
  const prompt = `Today is ${TODAY}. Find 4 upcoming speaking opportunities for Alex Padron — executive coach for biotech/scientific leaders in Boulder CO. Topics: AI leadership for scientists, scientist-to-executive transitions, burnout recovery, leadership development.

RULES:
1. Only events AFTER ${TODAY}. Use 2026/2027 dates for annual events already passed.
2. Real, annually recurring conferences that genuinely accept CFPs/speaker proposals.
3. Mix: biotech/life sciences (at least 2), coaching/leadership, HR in life sciences.
4. Do NOT include: ${skip}

Return raw JSON only — no markdown, no code fences:
[{"name":"...","location":"City, ST","date":"Month Year","fee":"$X or Travel only","status":"Researched","contact":"example.com/speak","deadline":"Month Year or Rolling","link":"https://...","beginner":"⭐⭐⭐ one sentence","notes":"one sentence"}]`
  return parseAIResponse(await callClaude(prompt))
}

async function fetchNetworking(existing) {
  const skip = existing.map(e => e.name).join(', ')
  const prompt = `Today is ${TODAY}. Find 4 upcoming networking events for Alex Padron — executive coach for biotech/scientific leaders in Boulder CO, also building AI consulting and leadership coaching offers.

RULES:
1. Only events AFTER ${TODAY}. Use 2026/2027 dates for annual events already passed.
2. Real events focused on networking value, not just learning.
3. Mix: biotech/pharma industry events (at least 2), HR/people-leadership, local CO events, coaching community.
4. Do NOT include: ${skip}

Return raw JSON only — no markdown, no code fences:
[{"name":"...","location":"City, ST","date":"Month Year","type":"Conference or Meetup or Summit","cost":"Free or $X","status":"Researched","contact":"example.com","link":"https://...","value":"⭐⭐⭐ one sentence on ROI","notes":"one sentence"}]`
  return parseAIResponse(await callClaude(prompt))
}

// ── OpportunityTable component ────────────────────────────────
function OpportunityTable({ title, icon, rows, cols, statuses, pillColors, onStatusChange, onDelete, onAdd, onRefresh, isRefreshing, lastRefreshed, refreshError, addFields }) {
  const [expanded, setExpanded] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newRow, setNewRow] = useState({})

  const statusCounts = statuses.filter(s => s !== 'Pass').reduce((acc, s) => {
    const c = rows.filter(r => r.status === s).length
    if (c > 0) acc[s] = c
    return acc
  }, {})

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div style={{ fontSize: 18, color: '#F5EDE0', fontWeight: 'bold' }}>{icon} {title}</div>
          <div style={{ fontSize: 11, color: refreshError ? '#E07070' : '#9B8B7A', marginTop: 3 }}>
            {isRefreshing ? '🔄 Searching for new opportunities…'
              : refreshError ? refreshError
              : lastRefreshed ? `Last updated: ${lastRefreshed}`
              : "Click 'Find New' to discover opportunities"}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onRefresh} disabled={isRefreshing} style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(201,168,122,0.1)', border: '1px solid rgba(201,168,122,0.3)', color: '#C9A87A', fontSize: 12.5, cursor: isRefreshing ? 'default' : 'pointer', fontFamily: 'Georgia,serif', transition: 'all 0.2s' }}>
            {isRefreshing ? 'Searching…' : '🔍 Find New'}
          </button>
          <button onClick={() => setShowAdd(!showAdd)} style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(109,191,138,0.1)', border: '1px solid rgba(109,191,138,0.3)', color: '#6DBF8A', fontSize: 12.5, cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
            + Add
          </button>
        </div>
      </div>

      {/* Status pills */}
      {Object.keys(statusCounts).length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {Object.entries(statusCounts).map(([s, c]) => (
            <div key={s} style={{ background: `${pillColors[s]}18`, border: `1px solid ${pillColors[s]}44`, borderRadius: 20, padding: '3px 12px', fontSize: 11, color: pillColors[s] }}>
              {s}: {c}
            </div>
          ))}
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div style={{ background: 'rgba(245,237,224,0.05)', border: '1px solid rgba(201,168,122,0.2)', borderRadius: 14, padding: 16, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            {addFields.filter(f => f !== 'notes').map(f => (
              <input key={f} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} value={newRow[f] || ''} onChange={e => setNewRow(p => ({ ...p, [f]: e.target.value }))}
                style={{ background: 'rgba(245,237,224,0.07)', border: '1px solid rgba(201,168,122,0.18)', borderRadius: 8, padding: '7px 10px', color: '#F5EDE0', fontSize: 12.5, fontFamily: 'Georgia,serif', outline: 'none' }} />
            ))}
          </div>
          <textarea placeholder="Notes…" value={newRow.notes || ''} onChange={e => setNewRow(p => ({ ...p, notes: e.target.value }))} rows={2}
            style={{ width: '100%', background: 'rgba(245,237,224,0.07)', border: '1px solid rgba(201,168,122,0.18)', borderRadius: 8, padding: '7px 10px', color: '#F5EDE0', fontSize: 12.5, fontFamily: 'Georgia,serif', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { onAdd({ ...newRow, id: Date.now(), status: 'Researched' }); setNewRow({}); setShowAdd(false) }}
              style={{ flex: 1, padding: 9, background: 'linear-gradient(135deg,#C9A87A,#8B6F47)', border: 'none', borderRadius: 10, color: '#2C1F14', cursor: 'pointer', fontSize: 13, fontFamily: 'Georgia,serif' }}>Add</button>
            <button onClick={() => setShowAdd(false)}
              style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,122,0.18)', borderRadius: 10, color: '#9B8B7A', cursor: 'pointer', fontSize: 13, fontFamily: 'Georgia,serif' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(201,168,122,0.18)' }}>
              {cols.map(c => (
                <th key={c.key} style={{ textAlign: 'left', padding: '8px 10px', color: '#9B8B7A', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', width: c.w, fontWeight: 'normal', whiteSpace: 'nowrap' }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <>
                <tr key={row.id} onClick={() => setExpanded(expanded === row.id ? null : row.id)}
                  style={{ borderBottom: '1px solid rgba(201,168,122,0.07)', cursor: 'pointer', background: expanded === row.id ? 'rgba(201,168,122,0.05)' : 'transparent', transition: 'background 0.15s' }}>
                  {cols.map(c => {
                    if (c.key === 'name') return (
                      <td key="name" style={{ padding: '11px 10px', color: '#F5EDE0', fontWeight: 'bold' }}>
                        {row.name}
                        <div style={{ fontSize: 10, color: '#9B8B7A', fontWeight: 'normal', marginTop: 2 }}>{row.contact}</div>
                      </td>
                    )
                    if (c.key === 'dateLoc') return (
                      <td key="dateLoc" style={{ padding: '11px 10px', color: '#C9A87A', whiteSpace: 'nowrap' }}>
                        {row.date}
                        <div style={{ fontSize: 10, color: '#9B8B7A', marginTop: 2 }}>{row.location}</div>
                      </td>
                    )
                    if (c.key === 'status') return (
                      <td key="status" style={{ padding: '11px 10px' }}>
                        <select value={row.status} onClick={e => e.stopPropagation()} onChange={e => { e.stopPropagation(); onStatusChange(row.id, e.target.value) }}
                          style={{ background: `${pillColors[row.status]}18`, border: `1px solid ${pillColors[row.status]}55`, borderRadius: 10, padding: '3px 8px', fontSize: 11, color: pillColors[row.status], cursor: 'pointer', fontFamily: 'Georgia,serif', outline: 'none' }}>
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    )
                    if (c.key === 'actions') return (
                      <td key="actions" style={{ padding: '11px 10px' }}>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {row.link && (
                            <button onClick={e => { e.stopPropagation(); window.open(row.link, '_blank') }}
                              style={{ fontSize: 10, color: '#6DBF8A', background: 'none', border: '1px solid rgba(109,191,138,0.3)', borderRadius: 8, padding: '2px 8px', cursor: 'pointer', fontFamily: 'Georgia,serif' }}>
                              Open ↗
                            </button>
                          )}
                          <button onClick={e => { e.stopPropagation(); onDelete(row.id) }}
                            style={{ background: 'none', border: 'none', color: '#9B8B7A', cursor: 'pointer', fontSize: 15, lineHeight: 1, padding: '0 2px' }}>×</button>
                        </div>
                      </td>
                    )
                    return <td key={c.key} style={{ padding: '11px 10px', color: '#C9A87A', fontSize: 12 }}>{row[c.key]}</td>
                  })}
                </tr>
                {expanded === row.id && (
                  <tr key={`${row.id}-exp`}>
                    <td colSpan={cols.length} style={{ padding: '10px 10px 14px', background: 'rgba(201,168,122,0.04)', borderBottom: '1px solid rgba(201,168,122,0.1)', fontSize: 12.5, color: '#C9A87A' }}>
                      <strong style={{ color: '#F5EDE0' }}>Notes: </strong>{row.notes || 'No notes yet.'}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div style={{ textAlign: 'center', padding: 36, color: '#9B8B7A', fontSize: 13 }}>No entries yet — click "Find New" or "+ Add".</div>
        )}
      </div>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────
export default function OpportunityFinder() {
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState('speaking')

  const [speaking, setSpeaking]               = useState(DEFAULT_SPEAKING)
  const [speakingRefreshed, setSpeakingRefreshed]     = useState(null)
  const [speakingRefreshing, setSpeakingRefreshing]   = useState(false)
  const [speakingError, setSpeakingError]             = useState('')

  const [networking, setNetworking]           = useState(DEFAULT_NETWORKING)
  const [networkingRefreshed, setNetworkingRefreshed] = useState(null)
  const [networkingRefreshing, setNetworkingRefreshing] = useState(false)
  const [networkingError, setNetworkingError]         = useState('')

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setMounted(true)
    const s = storage_get('opp-speaking');    if (s) setSpeaking(s)
    const sr = storage_get('opp-speaking-ts'); if (sr) setSpeakingRefreshed(sr)
    const n = storage_get('opp-networking');   if (n) setNetworking(n)
    const nr = storage_get('opp-networking-ts'); if (nr) setNetworkingRefreshed(nr)
  }, [])

  // Auto-save on change
  useEffect(() => { if (mounted) storage_set('opp-speaking', speaking) }, [speaking, mounted])
  useEffect(() => { if (mounted) storage_set('opp-networking', networking) }, [networking, mounted])

  // Auto-refresh speaking on mount if stale
  useEffect(() => {
    if (!mounted) return
    const ts = storage_get('opp-speaking-ts-raw')
    if (!ts || Date.now() - ts > ONE_WEEK_MS) doRefreshSpeaking()
  }, [mounted])

  // Auto-refresh networking when tab opened if stale
  useEffect(() => {
    if (!mounted || tab !== 'networking') return
    const ts = storage_get('opp-networking-ts-raw')
    if (!ts || Date.now() - ts > ONE_WEEK_MS) doRefreshNetworking()
  }, [tab, mounted])

  async function doRefreshSpeaking() {
    if (speakingRefreshing) return
    setSpeakingRefreshing(true); setSpeakingError('')
    try {
      const results = await fetchSpeaking(speaking)
      let added = 0
      setSpeaking(prev => {
        const merged = [...prev]
        for (const opp of results) {
          const exists = merged.some(e => e.name.toLowerCase().includes(opp.name.toLowerCase().slice(0, 12)))
          if (!exists) { merged.push({ ...opp, id: Date.now() + Math.random() }); added++ }
        }
        return merged
      })
      const label = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + (added > 0 ? ` · +${added} new` : ' · no new found')
      setSpeakingRefreshed(label)
      storage_set('opp-speaking-ts', label)
      storage_set('opp-speaking-ts-raw', Date.now())
    } catch (e) { setSpeakingError('Search failed: ' + (e.message || 'unknown error')) }
    setSpeakingRefreshing(false)
  }

  async function doRefreshNetworking() {
    if (networkingRefreshing) return
    setNetworkingRefreshing(true); setNetworkingError('')
    try {
      const results = await fetchNetworking(networking)
      let added = 0
      setNetworking(prev => {
        const merged = [...prev]
        for (const evt of results) {
          const exists = merged.some(e => e.name.toLowerCase().includes(evt.name.toLowerCase().slice(0, 12)))
          if (!exists) { merged.push({ ...evt, id: Date.now() + Math.random() }); added++ }
        }
        return merged
      })
      const label = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + (added > 0 ? ` · +${added} new` : ' · no new found')
      setNetworkingRefreshed(label)
      storage_set('opp-networking-ts', label)
      storage_set('opp-networking-ts-raw', Date.now())
    } catch (e) { setNetworkingError('Search failed: ' + (e.message || 'unknown error')) }
    setNetworkingRefreshing(false)
  }

  const speakingCols = [
    { key: 'name',     label: 'Conference / Event', w: '24%' },
    { key: 'dateLoc',  label: 'Date & Location',    w: '15%' },
    { key: 'fee',      label: 'Fee',                w: '12%' },
    { key: 'deadline', label: 'Deadline',           w: '10%' },
    { key: 'beginner', label: 'Beginner Fit',       w: '22%' },
    { key: 'status',   label: 'Status',             w: '10%' },
    { key: 'actions',  label: '',                   w: '7%'  },
  ]
  const networkingCols = [
    { key: 'name',    label: 'Event / Group',    w: '24%' },
    { key: 'dateLoc', label: 'Date & Location',  w: '15%' },
    { key: 'type',    label: 'Type',             w: '10%' },
    { key: 'cost',    label: 'Cost',             w: '9%'  },
    { key: 'value',   label: 'Networking Value', w: '25%' },
    { key: 'status',  label: 'Status',           w: '10%' },
    { key: 'actions', label: '',                 w: '7%'  },
  ]

  const fmtDate = () => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#1E1610 0%,#2E1F14 35%,#3D2B1A 70%,#2A1D12 100%)', fontFamily: "'Georgia','Times New Roman',serif", padding: '28px 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        *{box-sizing:border-box;}
        input:focus,textarea:focus,select:focus{outline:none;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(201,168,122,0.25);border-radius:2px;}
        select option{background:#2E1F14;color:#F5EDE0;}
        .tab-btn:hover{background:rgba(201,168,122,0.12)!important;}
        tr:hover td{background:rgba(201,168,122,0.03);}
      `}</style>

      {/* Header */}
      <div style={{ width: '100%', maxWidth: 900, marginBottom: 24, animation: 'fadeIn 0.4s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 26, color: '#F5EDE0', letterSpacing: '0.02em', lineHeight: 1.2 }}>✦ Opportunity Finder</div>
            <div style={{ fontSize: 12, color: '#9B8B7A', marginTop: 5, letterSpacing: '0.04em' }}>{mounted ? fmtDate() : ''} · Alex Padrón · Boulder, CO</div>
          </div>
          <div style={{ fontSize: 11, color: '#6DBF8A', background: 'rgba(109,191,138,0.1)', border: '1px solid rgba(109,191,138,0.25)', borderRadius: 20, padding: '4px 12px' }}>● AI-powered · auto-saves</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ width: '100%', maxWidth: 900, display: 'flex', gap: 6, marginBottom: 20 }}>
        {[
          { id: 'speaking',   label: '🎤 Speaking',  count: speaking.filter(s => s.status !== 'Pass' && s.status !== 'Done').length },
          { id: 'networking', label: '🤝 Networking', count: networking.filter(n => n.status !== 'Pass' && n.status !== 'Attended').length },
        ].map(t => (
          <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)} style={{ padding: '10px 22px', borderRadius: 14, background: tab === t.id ? 'rgba(201,168,122,0.18)' : 'rgba(255,255,255,0.03)', border: tab === t.id ? '1px solid rgba(201,168,122,0.45)' : '1px solid rgba(201,168,122,0.1)', color: tab === t.id ? '#C9A87A' : '#9B8B7A', fontSize: 13.5, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Georgia,serif', fontWeight: tab === t.id ? 'bold' : 'normal', display: 'flex', alignItems: 'center', gap: 8 }}>
            {t.label}
            <span style={{ background: tab === t.id ? 'rgba(201,168,122,0.25)' : 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '1px 8px', fontSize: 11, color: tab === t.id ? '#C9A87A' : '#9B8B7A' }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Panel */}
      <div style={{ width: '100%', maxWidth: 900, background: 'rgba(245,237,224,0.04)', backdropFilter: 'blur(20px)', borderRadius: 20, border: '1px solid rgba(201,168,122,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.06)', padding: 24, minHeight: 400 }}>
        {tab === 'speaking' && (
          <OpportunityTable title="Speaking Opportunities" icon="🎤" rows={speaking} cols={speakingCols} statuses={SPEAKING_STATUSES} pillColors={STATUS_PILL}
            onStatusChange={(id, s) => setSpeaking(prev => prev.map(o => o.id === id ? { ...o, status: s } : o))}
            onDelete={id => setSpeaking(prev => prev.filter(o => o.id !== id))}
            onAdd={opp => setSpeaking(prev => [...prev, opp])}
            onRefresh={doRefreshSpeaking} isRefreshing={speakingRefreshing} lastRefreshed={speakingRefreshed} refreshError={speakingError}
            addFields={['name','location','date','fee','deadline','contact','link','beginner']} />
        )}
        {tab === 'networking' && (
          <OpportunityTable title="Networking Events" icon="🤝" rows={networking} cols={networkingCols} statuses={NETWORKING_STATUSES} pillColors={NET_PILL}
            onStatusChange={(id, s) => setNetworking(prev => prev.map(e => e.id === id ? { ...e, status: s } : e))}
            onDelete={id => setNetworking(prev => prev.filter(e => e.id !== id))}
            onAdd={evt => setNetworking(prev => [...prev, evt])}
            onRefresh={doRefreshNetworking} isRefreshing={networkingRefreshing} lastRefreshed={networkingRefreshed} refreshError={networkingError}
            addFields={['name','location','date','type','cost','contact','link','value']} />
        )}
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: 'rgba(155,139,122,0.35)', textAlign: 'center' }}>
        Powered by Claude · Data saves to your browser · Refreshes weekly
      </div>
    </div>
  )
}
