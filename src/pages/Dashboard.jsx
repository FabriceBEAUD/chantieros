import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { chantiers, fmt } from '../data/mock'

const alertes_init = [
  { icon: 'ti-alert-triangle', bg: 'var(--red-light)', color: 'var(--red-dark)', title: 'CACES R482 expiré', detail: 'J. Martin — depuis 3 jours' },
  { icon: 'ti-clock',          bg: 'var(--amber-light)',color: 'var(--amber-dark)',title: 'Facture impayée 61j',detail: 'Métropole AuRA · 87 400€' },
  { icon: 'ti-tool',           bg: 'var(--amber-light)',color: 'var(--amber-dark)',title: 'Révision pelle CAT',detail: 'Échéance dans 4 jours' },
]

const gantt = [
  { nom: 'RD132 Déviation', start: 0, end: 4, color: '#639922' },
  { nom: 'Giratoire N7',    start: 1, end: 6, color: '#EF9F27' },
  { nom: 'ZAC Peupliers',   start: 2, end: 8, color: '#378ADD' },
  { nom: 'Assainissement',  start: 0, end: 2, color: '#639922' },
  { nom: 'Pont RD22',       start: 1, end: 8, color: '#E24B4A' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [alertes, setAlertes] = useState(alertes_init)

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ fontSize: 16, fontWeight: 500 }}>Bonjour Michel — mardi 27 mai 2026</h1>
        <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 3 }}>
          6 chantiers actifs · 3 alertes · <span style={{ color: 'var(--amber-dark)' }}>Risque pluie jeudi sur RD132</span>
        </p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-val">6</div><div className="kpi-lbl">Chantiers actifs</div><div className="kpi-delta up"><i className="ti ti-arrow-up" style={{fontSize:10}}></i> +1 ce mois</div></div>
        <div className="kpi-card"><div className="kpi-val">847k€</div><div className="kpi-lbl">CA en cours</div><div className="kpi-delta up"><i className="ti ti-arrow-up" style={{fontSize:10}}></i> +12% vs N-1</div></div>
        <div className="kpi-card"><div className="kpi-val">214k€</div><div className="kpi-lbl">Impayés &gt;30j</div><div className="kpi-delta dn">3 factures</div></div>
        <div className="kpi-card"><div className="kpi-val">38</div><div className="kpi-lbl">Salariés pointés</div><div className="kpi-delta" style={{color:'var(--text-2)'}}>2 absences</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 10, marginBottom: 10 }}>
        <div className="panel">
          <div className="panel-title">Chantiers actifs <button onClick={() => navigate('/chantiers')}>Voir tous →</button></div>
          {chantiers.slice(0,5).map(c => (
            <div key={c.id} onClick={() => navigate('/chantiers')} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom:'0.5px solid var(--border)', cursor:'pointer' }}
              onMouseEnter={e=>e.currentTarget.style.background='var(--surface2)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:c.color, flexShrink:0 }}></div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, fontWeight:500 }}>{c.nom}</div>
                <div style={{ fontSize:11, color:'var(--text-2)' }}>{c.client} · {c.chef}</div>
              </div>
              <span className={`badge badge-${c.statut==='en_cours'?'green':c.statut==='retard'?'amber':c.statut==='bloque'?'red':'blue'}`}>
                {c.statut==='en_cours'?'En cours':c.statut==='retard'?'Retard':c.statut==='bloque'?'Bloqué':'Démarrage'}
              </span>
              <div className="prog-bar">
                <div className="prog-bg"><div className="prog-fill" style={{ width:c.avancement+'%', background:c.color }}></div></div>
                <div className="prog-pct">{c.avancement}%</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div className="panel">
            <div className="panel-title">
              Alertes <span style={{ background:'var(--red-light)', color:'var(--red-dark)', fontSize:10, padding:'1px 6px', borderRadius:8 }}>{alertes.length}</span>
            </div>
            {alertes.map((a,i) => (
              <div key={i} onClick={() => setAlertes(alertes.filter((_,j)=>j!==i))} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'6px 0', borderBottom: i<alertes.length-1?'0.5px solid var(--border)':'none', cursor:'pointer' }}
                title="Cliquer pour fermer">
                <div style={{ width:22, height:22, borderRadius:6, background:a.bg, color:a.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>
                  <i className={`ti ${a.icon}`} aria-hidden="true"></i>
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:500 }}>{a.title}</div>
                  <div style={{ fontSize:11, color:'var(--text-2)' }}>{a.detail}</div>
                </div>
              </div>
            ))}
            {alertes.length === 0 && <p style={{ fontSize:12, color:'var(--text-2)' }}>Aucune alerte active</p>}
          </div>
          <div className="panel" style={{ cursor:'pointer' }} onClick={() => navigate('/finance')}>
            <div className="panel-title">Tréso prévisionnelle</div>
            <div style={{ fontSize:18, fontWeight:500 }}>+124 000€</div>
            <div style={{ fontSize:11, color:'var(--text-2)', marginTop:2 }}>Solde estimé à 30j</div>
            <div style={{ margin:'8px 0 3px', background:'var(--surface2)', borderRadius:4, height:5, overflow:'hidden' }}>
              <div style={{ width:'62%', height:'100%', background:'var(--green)', borderRadius:4 }}></div>
            </div>
            <div style={{ fontSize:10, color:'var(--text-2)' }}>Entrées 312k€ · Sorties 188k€</div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Planning — juin à septembre 2026 <button onClick={() => navigate('/planning')}>Détail →</button></div>
        <div style={{ display:'flex', marginBottom:6 }}>
          <div style={{ width:130 }}></div>
          <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
            {['Juin','Juillet','Août','Septembre'].map(m => <div key={m} style={{ fontSize:10, color:'var(--text-2)', textAlign:'center' }}>{m}</div>)}
          </div>
        </div>
        {gantt.map((g,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
            <div style={{ width:130, fontSize:11, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{g.nom}</div>
            <div style={{ flex:1, background:'var(--surface2)', borderRadius:4, height:14, display:'grid', gridTemplateColumns:'repeat(8,1fr)', overflow:'hidden' }}>
              {Array(8).fill(0).map((_,j) => (
                <div key={j} style={{ height:'100%', background: j>=g.start&&j<g.end ? g.color+'b3' : 'transparent' }}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
