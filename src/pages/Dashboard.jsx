import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTable } from '../hooks/useTable'

const STATUT_LABEL = { en_cours: 'En cours', retard: 'Retard', bloque: 'Bloqué', depart: 'Démarrage', termine: 'Terminé' }
const STATUT_COLOR_CLASS = { en_cours: 'green', retard: 'amber', bloque: 'red', depart: 'blue', termine: 'green' }
const CHANTIER_DOT_COLOR = { en_cours: '#639922', retard: '#EF9F27', bloque: '#E24B4A', depart: '#378ADD', termine: '#999' }

function fmt(n) {
  if (!n) return '0€'
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M€'
  if (n >= 1000) return Math.round(n / 1000) + 'k€'
  return n + '€'
}

function todayLabel() {
  return new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: chantiers } = useTable('chantiers')
  const { data: situations } = useTable('situations')
  const { data: habilitations } = useTable('habilitations')
  const { data: pointages } = useTable('pointages')

  const [dismissedAlerts, setDismissedAlerts] = useState([])

  const actifs = chantiers.filter(c => c.statut !== 'termine')
  const caTotal = actifs.reduce((s, c) => s + (Number(c.budget) || 0), 0)

  const today = new Date()
  const impayes = situations.filter(s => {
    if (s.statut !== 'impayée') return false
    const ech = new Date(s.echeance)
    return (today - ech) / 86400000 > 30
  })
  const impayesTotal = impayes.reduce((s, sit) => s + (Number(sit.ttc) || 0), 0)

  const salariesPointes = [...new Set(pointages.map(p => p.salarie))].length

  const alerts = useMemo(() => {
    const list = []
    habilitations.forEach(h => {
      if (h.jours !== undefined && h.jours <= 30 && h.jours >= 0) {
        list.push({
          key: `hab-${h.id}`,
          icon: 'ti-alert-triangle',
          bg: 'var(--red-light)',
          color: 'var(--red-dark)',
          title: `${h.type} expire dans ${h.jours}j`,
          detail: h.nom
        })
      }
    })
    impayes.forEach(s => {
      const days = Math.round((today - new Date(s.echeance)) / 86400000)
      list.push({
        key: `sit-${s.id}`,
        icon: 'ti-clock',
        bg: 'var(--amber-light)',
        color: 'var(--amber-dark)',
        title: `Facture impayée ${days}j`,
        detail: `${s.chantier} · ${fmt(s.ttc)}`
      })
    })
    return list
  }, [habilitations, impayes])

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.includes(a.key))

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 16, fontWeight: 500 }}>Tableau de bord — {todayLabel()}</h1>
        <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>
          {actifs.length} chantier{actifs.length !== 1 ? 's' : ''} actif{actifs.length !== 1 ? 's' : ''} · {visibleAlerts.length} alerte{visibleAlerts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-val">{actifs.length}</div>
          <div className="kpi-lbl">Chantiers actifs</div>
          <div className="kpi-delta" style={{ color: 'var(--text-2)' }}>{chantiers.length} au total</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-val">{fmt(caTotal)}</div>
          <div className="kpi-lbl">CA en cours</div>
          <div className="kpi-delta" style={{ color: 'var(--text-2)' }}>budgets actifs</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-val">{impayesTotal > 0 ? fmt(impayesTotal) : '—'}</div>
          <div className="kpi-lbl">Impayés &gt;30j</div>
          <div className="kpi-delta dn">{impayes.length} facture{impayes.length !== 1 ? 's' : ''}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-val">{salariesPointes || '—'}</div>
          <div className="kpi-lbl">Salariés pointés</div>
          <div className="kpi-delta" style={{ color: 'var(--text-2)' }}>{pointages.length} pointages</div>
        </div>
      </div>

      <div className="dashboard-main" style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 10, marginBottom: 10 }}>
        <div className="panel">
          <div className="panel-title">Chantiers actifs <button onClick={() => navigate('/chantiers')}>Voir tous →</button></div>
          {actifs.slice(0, 5).map(c => (
            <div key={c.id} onClick={() => navigate('/chantiers')} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '0.5px solid var(--border)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: CHANTIER_DOT_COLOR[c.statut] || '#999', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{c.nom}</div>
                <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{c.client} · {c.chef}</div>
              </div>
              <span className={`badge badge-${STATUT_COLOR_CLASS[c.statut] || 'green'}`}>
                {STATUT_LABEL[c.statut] || c.statut}
              </span>
              <div className="prog-bar">
                <div className="prog-bg">
                  <div className="prog-fill" style={{ width: (c.avancement || 0) + '%', background: CHANTIER_DOT_COLOR[c.statut] || '#639922' }}></div>
                </div>
                <div className="prog-pct">{c.avancement || 0}%</div>
              </div>
            </div>
          ))}
          {actifs.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Aucun chantier actif</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="panel">
            <div className="panel-title">
              Alertes <span style={{ background: 'var(--red-light)', color: 'var(--red-dark)', fontSize: 10, padding: '1px 6px', borderRadius: 8 }}>{visibleAlerts.length}</span>
            </div>
            {visibleAlerts.map((a, i) => (
              <div key={a.key} onClick={() => setDismissedAlerts(d => [...d, a.key])}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '6px 0', borderBottom: i < visibleAlerts.length - 1 ? '0.5px solid var(--border)' : 'none', cursor: 'pointer' }}
                title="Cliquer pour fermer">
                <div style={{ width: 22, height: 22, borderRadius: 6, background: a.bg, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                  <i className={`ti ${a.icon}`} aria-hidden="true"></i>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{a.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-2)' }}>{a.detail}</div>
                </div>
              </div>
            ))}
            {visibleAlerts.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Aucune alerte active</p>}
          </div>
          <div className="panel" style={{ cursor: 'pointer' }} onClick={() => navigate('/finance')}>
            <div className="panel-title">Tréso prévisionnelle</div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>
              {fmt(situations.filter(s => s.statut === 'validée').reduce((sum, s) => sum + (Number(s.ttc) || 0), 0))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2 }}>Situations validées</div>
            <div style={{ margin: '8px 0 3px', background: 'var(--surface2)', borderRadius: 4, height: 5, overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', background: 'var(--green)', borderRadius: 4 }}></div>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-2)' }}>{situations.length} situation{situations.length !== 1 ? 's' : ''} au total</div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Avancement chantiers <button onClick={() => navigate('/planning')}>Planning →</button></div>
        {actifs.slice(0, 6).map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 130, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nom}</div>
            <div style={{ flex: 1, background: 'var(--surface2)', borderRadius: 4, height: 14, overflow: 'hidden' }}>
              <div style={{ width: (c.avancement || 0) + '%', height: '100%', background: (CHANTIER_DOT_COLOR[c.statut] || '#639922') + 'b3', borderRadius: 4 }}></div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', width: 30, textAlign: 'right' }}>{c.avancement || 0}%</div>
          </div>
        ))}
        {actifs.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-2)' }}>Aucun chantier actif</p>}
      </div>
    </div>
  )
}
