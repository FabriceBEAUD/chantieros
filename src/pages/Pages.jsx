import { useState } from 'react'
import { chantiers, situations, pointages, habilitations, incidents, ao_data, materiel_data, fmt } from '../data/mock'

export function Chantiers() {
  const [filter, setFilter] = useState('tous')
  const [showForm, setShowForm] = useState(false)
  const [list, setList] = useState(chantiers)
  const [toast, setToast] = useState(false)
  const [form, setForm] = useState({ ref:'', nom:'', client:'Conseil Dép. Ain', chef:'P. Durand', budget:'', type:'public' })

  const filtered = filter === 'tous' ? list : list.filter(c => c.statut === filter)
  const filters = [{v:'tous',l:'Tous'},{v:'en_cours',l:'En cours'},{v:'retard',l:'Retard'},{v:'bloque',l:'Bloqué'},{v:'depart',l:'Démarrage'}]

  const create = () => {
    if (!form.nom) return
    setList([...list, { id: list.length+1, ref:form.ref||'REF-2026', nom:form.nom, client:form.client, chef:form.chef, budget:parseInt(form.budget)||0, avancement:0, statut:'depart', color:'#378ADD' }])
    setShowForm(false)
    setToast(true)
    setTimeout(() => setToast(false), 3000)
    setForm({ ref:'', nom:'', client:'Conseil Dép. Ain', chef:'P. Durand', budget:'', type:'public' })
  }

  return (
    <div className="fade-in">
      {toast && <div className="toast toast-success">Chantier créé avec succès</div>}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h1 className="section-title">Chantiers</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}><i className="ti ti-plus" aria-hidden="true"></i>Nouveau chantier</button>
      </div>
      <div style={{ display:'flex', gap:6, marginBottom:10 }}>
        {filters.map(f => (
          <button key={f.v} onClick={() => setFilter(f.v)} style={{ padding:'5px 12px', borderRadius:20, border:'0.5px solid var(--border-strong)', background: filter===f.v ? 'var(--blue-dark)' : 'transparent', color: filter===f.v ? 'var(--blue-mid)' : 'var(--text-2)', fontSize:11, cursor:'pointer', fontFamily:'var(--font)' }}>{f.l}</button>
        ))}
      </div>
      <div className="panel" style={{ marginBottom:10 }}>
        <div style={{ overflowX:'auto' }}>
          <table className="data">
            <thead><tr><th>Référence</th><th>Chantier</th><th>Client</th><th>Chef</th><th>Budget</th><th>Avancement</th><th>Statut</th></tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text-2)' }}>{c.ref}</td>
                  <td style={{ fontWeight:500 }}>{c.nom}</td>
                  <td>{c.client}</td><td>{c.chef}</td>
                  <td>{fmt(c.budget)}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:60, background:'var(--surface2)', borderRadius:4, height:5, overflow:'hidden' }}>
                        <div style={{ width:c.avancement+'%', height:'100%', background:c.avancement>60?'#639922':c.avancement>30?'#EF9F27':'#E24B4A', borderRadius:4 }}></div>
                      </div>
                      <span style={{ fontSize:11, color:'var(--text-2)' }}>{c.avancement}%</span>
                    </div>
                  </td>
                  <td><span className={`badge badge-${c.statut==='en_cours'?'green':c.statut==='retard'?'amber':c.statut==='bloque'?'red':'blue'}`}>{c.statut==='en_cours'?'En cours':c.statut==='retard'?'Retard':c.statut==='bloque'?'Bloqué':'Démarrage'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <div className="panel fade-in">
          <div className="panel-title">Nouveau chantier</div>
          <div className="form-grid">
            {[['Référence','ref','REF-2026','text'],['Nom du chantier','nom','Nom...','text'],['Budget (€)','budget','485000','number']].map(([l,k,p,t]) => (
              <div key={k} className="form-row"><label>{l}</label><input type={t} placeholder={p} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})} /></div>
            ))}
            <div className="form-row"><label>Client</label><select value={form.client} onChange={e=>setForm({...form,client:e.target.value})}><option>Conseil Dép. Ain</option><option>Métropole AuRA</option><option>Promogim</option><option>Commune Meximieux</option></select></div>
            <div className="form-row"><label>Chef de chantier</label><select value={form.chef} onChange={e=>setForm({...form,chef:e.target.value})}><option>P. Durand</option><option>S. Blanc</option><option>K. Fontaine</option><option>M. Costa</option></select></div>
            <div className="form-row"><label>Type de marché</label><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>public</option><option>prive</option><option>mixte</option></select></div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn-primary" onClick={create}><i className="ti ti-check" aria-hidden="true"></i>Créer</button>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  )
}

export function Finance() {
  return (
    <div className="fade-in">
      <h1 className="section-title" style={{ marginBottom:12 }}>Trésorerie & situations de travaux</h1>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-val">312k€</div><div className="kpi-lbl">Encaissements prévus 90j</div></div>
        <div className="kpi-card"><div className="kpi-val">188k€</div><div className="kpi-lbl">Décaissements prévus 90j</div></div>
        <div className="kpi-card"><div className="kpi-val">214k€</div><div className="kpi-lbl">Impayés total</div><div className="kpi-delta dn">3 factures</div></div>
        <div className="kpi-card"><div className="kpi-val">87k€</div><div className="kpi-lbl">Retenues de garantie</div></div>
      </div>
      <div className="panel">
        <div className="panel-title">Situations de travaux en cours</div>
        <div style={{ overflowX:'auto' }}>
          <table className="data">
            <thead><tr><th>Chantier</th><th>N°</th><th>Émise le</th><th>Échéance</th><th>Montant HT</th><th>TTC</th><th>Statut</th></tr></thead>
            <tbody>
              {situations.map(s => (
                <tr key={s.id}>
                  <td style={{fontWeight:500}}>{s.chantier}</td><td>{s.num}</td><td>{s.emise}</td><td>{s.echeance}</td>
                  <td>{fmt(s.ht)}</td><td>{fmt(s.ttc)}</td>
                  <td><span className={`badge badge-${s.statut==='payee'?'green':s.statut==='impayee'?'red':s.statut==='en_attente'?'blue':'amber'}`}>{s.statut==='payee'?'Payée':s.statut==='impayee'?'Impayée 61j':s.statut==='en_attente'?'En attente':'Émise'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function Situations() {
  const [av, setAv] = useState(68)
  const [cumul, setCumul] = useState(327800)
  const [prec, setPrec] = useState(243600)
  const [toast, setToast] = useState(false)

  const periode = cumul - prec
  const rg = Math.round(periode * 0.05)
  const net = periode - rg
  const ttc = Math.round(net * 1.2)

  const create = () => { setToast(true); setTimeout(() => setToast(false), 3000) }

  return (
    <div className="fade-in">
      {toast && <div className="toast toast-success">Situation de travaux créée — PDF en cours de génération</div>}
      <h1 className="section-title" style={{ marginBottom:12 }}>Nouvelle situation de travaux</h1>
      <div className="panel">
        <div className="form-grid">
          <div className="form-row"><label>Chantier</label><select><option>RD132 — Déviation Bourg</option><option>Giratoire N7</option><option>ZAC Les Peupliers</option><option>Assainissement Meximieux</option></select></div>
          <div className="form-row"><label>N° de situation</label><input type="number" defaultValue={5} /></div>
          <div className="form-row"><label>Avancement ({av}%)</label><input type="range" min={0} max={100} step={1} value={av} onChange={e=>setAv(+e.target.value)} /></div>
          <div className="form-row"><label>Date d'échéance</label><input type="date" /></div>
          <div className="form-row"><label>Montant cumulé HT (€)</label><input type="number" value={cumul} onChange={e=>setCumul(+e.target.value)} /></div>
          <div className="form-row"><label>Montant précédent HT (€)</label><input type="number" value={prec} onChange={e=>setPrec(+e.target.value)} /></div>
        </div>
        <div style={{ background:'var(--surface2)', borderRadius:8, padding:'10px 14px', marginBottom:12 }}>
          {[[`Montant période HT`,fmt(periode),'var(--text)'],[`Retenue de garantie (5%)`,`− ${fmt(rg)}`,'var(--amber-dark)'],[`Net HT`,fmt(net),'var(--text)'],[`Net TTC (TVA 20%)`,fmt(ttc),'var(--blue)']].map(([l,v,c],i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'3px 0', borderTop: i===3?'0.5px solid var(--border)':'none', marginTop: i===3?4:0, paddingTop: i===3?8:3 }}>
              <span style={{ fontSize:12, color: i===3?'var(--text)':'var(--text-2)', fontWeight: i===3?500:400 }}>{l}</span>
              <span style={{ fontSize:12, fontWeight: i===3?500:400, color:c }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn-primary" onClick={create}><i className="ti ti-file-invoice" aria-hidden="true"></i>Créer & générer PDF</button>
          <button className="btn-secondary">Brouillon</button>
        </div>
      </div>
    </div>
  )
}

export function RH() {
  const [list, setList] = useState(pointages)
  const validate = (id) => setList(list.map(p => p.id===id ? {...p,statut:'valide'} : p))

  return (
    <div className="fade-in">
      <h1 className="section-title" style={{ marginBottom:12 }}>RH & pointage du jour</h1>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-val">38</div><div className="kpi-lbl">Pointés aujourd'hui</div></div>
        <div className="kpi-card"><div className="kpi-val">2</div><div className="kpi-lbl">Absences</div></div>
        <div className="kpi-card"><div className="kpi-val">14</div><div className="kpi-lbl">Grands déplacements</div></div>
        <div className="kpi-card"><div className="kpi-val">3</div><div className="kpi-lbl">Habilitations à renouveler</div></div>
      </div>
      <div className="panel" style={{ marginBottom:10 }}>
        <div className="panel-title">Pointages à valider</div>
        <div style={{ overflowX:'auto' }}>
          <table className="data">
            <thead><tr><th>Salarié</th><th>Chantier</th><th>Date</th><th>Heures</th><th>H.Sup</th><th>GD</th><th>Statut</th><th>Action</th></tr></thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id}>
                  <td style={{fontWeight:500}}>{p.nom}</td><td>{p.chantier}</td><td>{p.date}</td><td>{p.h}</td><td>{p.sup}</td>
                  <td>{p.gd ? <span className="badge badge-green">Oui</span> : 'Non'}</td>
                  <td><span className={`badge badge-${p.statut==='valide'?'green':'blue'}`}>{p.statut==='valide'?'Validé':'À valider'}</span></td>
                  <td>{p.statut==='soumis' && <button className="btn-primary" style={{padding:'4px 10px',fontSize:11}} onClick={()=>validate(p.id)}>Valider</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel">
        <div className="panel-title">Habilitations expirant dans 30 jours</div>
        <table className="data">
          <thead><tr><th>Salarié</th><th>Habilitation</th><th>Expiration</th><th>Jours restants</th></tr></thead>
          <tbody>
            {habilitations.map((h,i) => (
              <tr key={i}>
                <td style={{fontWeight:500}}>{h.nom}</td><td>{h.type}</td><td>{h.expiration}</td>
                <td><span className={`badge badge-${h.jours<0?'red':'amber'}`}>{h.jours<0?'Expiré':h.jours+' jours'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Securite() {
  const [list, setList] = useState(incidents)

  const report = () => {
    setList([{ id:list.length+1, chantier:'RD132 Déviation', type:'Situation dangereuse', gravite:'mineur', date:'27/05/2026', statut:'ouvert' }, ...list])
  }

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h1 className="section-title">Sécurité & conformité</h1>
        <button className="btn-primary" onClick={report}><i className="ti ti-alert-triangle" aria-hidden="true"></i>Déclarer un incident</button>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-val">0</div><div className="kpi-lbl">Accidents ce mois</div><div className="kpi-delta up">Objectif atteint</div></div>
        <div className="kpi-card"><div className="kpi-val">{list.length}</div><div className="kpi-lbl">Incidents ouverts</div></div>
        <div className="kpi-card"><div className="kpi-val">4/6</div><div className="kpi-lbl">PPSPS à jour</div></div>
        <div className="kpi-card"><div className="kpi-val">3</div><div className="kpi-lbl">EPI à renouveler</div></div>
      </div>
      <div className="panel" style={{ marginBottom:10 }}>
        <div className="panel-title">Incidents ouverts</div>
        <table className="data">
          <thead><tr><th>Chantier</th><th>Type</th><th>Gravité</th><th>Date</th><th>Statut</th></tr></thead>
          <tbody>
            {list.map(inc => (
              <tr key={inc.id}>
                <td style={{fontWeight:500}}>{inc.chantier}</td><td>{inc.type}</td>
                <td><span className={`badge badge-${inc.gravite==='modere'?'amber':'blue'}`}>{inc.gravite}</span></td>
                <td>{inc.date}</td>
                <td><span className={`badge badge-${inc.statut==='ouvert'?'red':'amber'}`}>{inc.statut}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function Planning() {
  const weeks = ['S22','S23','S24','S25','S26','S27','S28','S29']
  const bars = [
    {nom:'RD132 Déviation',s:0,e:4,c:'#639922'},{nom:'Giratoire N7',s:1,e:6,c:'#EF9F27'},
    {nom:'ZAC Peupliers',s:2,e:8,c:'#378ADD'},{nom:'Assainissement',s:0,e:2,c:'#639922'},
    {nom:'Pont RD22',s:1,e:8,c:'#E24B4A'},{nom:'RN75 Réhab.',s:0,e:3,c:'#639922'},
  ]
  return (
    <div className="fade-in">
      <h1 className="section-title" style={{ marginBottom:12 }}>Planning — vue Gantt</h1>
      <div className="panel">
        <div style={{ display:'flex', marginBottom:10 }}>
          <div style={{ width:150 }}></div>
          <div style={{ flex:1, display:'grid', gridTemplateColumns:`repeat(${weeks.length},1fr)` }}>
            {weeks.map(w => <div key={w} style={{ fontSize:10, color:'var(--text-2)', textAlign:'center', fontFamily:'var(--font-mono)' }}>{w}</div>)}
          </div>
        </div>
        {bars.map((b,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', marginBottom:8 }}>
            <div style={{ width:150, fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.nom}</div>
            <div style={{ flex:1, background:'var(--surface2)', borderRadius:4, height:18, display:'grid', gridTemplateColumns:`repeat(${weeks.length},1fr)`, overflow:'hidden' }}>
              {weeks.map((_,j) => (
                <div key={j} style={{ height:'100%', background: j>=b.s&&j<b.e ? b.c+'cc' : 'transparent', borderRight: j>=b.s&&j<b.e-1 ? `1px solid ${b.c}33` : 'none' }}></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AO() {
  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5-n)
  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h1 className="section-title">Appels d'offres</h1>
        <button className="btn-primary"><i className="ti ti-plus" aria-hidden="true"></i>Ajouter un AO</button>
      </div>
      <div className="panel">
        <div style={{ overflowX:'auto' }}>
          <table className="data">
            <thead><tr><th>Intitulé</th><th>Acheteur</th><th>Limite</th><th>Montant estimé</th><th>Priorité</th><th>Statut</th></tr></thead>
            <tbody>
              {ao_data.map((a,i) => (
                <tr key={i}>
                  <td style={{fontWeight:500}}>{a.intitule}</td><td>{a.acheteur}</td><td>{a.limite}</td>
                  <td>{fmt(a.montant)}</td>
                  <td style={{ color:'var(--amber)', fontSize:13, letterSpacing:1 }}>{stars(a.prio)}</td>
                  <td><span className={`badge badge-${a.statut==='en_cours'?'amber':a.statut==='soumis'?'green':'blue'}`}>{a.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export function Materiel() {
  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h1 className="section-title">Parc matériel</h1>
        <button className="btn-primary"><i className="ti ti-plus" aria-hidden="true"></i>Ajouter un engin</button>
      </div>
      <div className="panel">
        <div style={{ overflowX:'auto' }}>
          <table className="data">
            <thead><tr><th>Désignation</th><th>Immat.</th><th>Affecté à</th><th>Prochain entretien</th><th>Compteur</th><th>Statut</th></tr></thead>
            <tbody>
              {materiel_data.map((m,i) => (
                <tr key={i}>
                  <td style={{fontWeight:500}}>{m.nom}</td>
                  <td style={{fontFamily:'var(--font-mono)',fontSize:11}}>{m.immat}</td>
                  <td>{m.affecte}</td>
                  <td style={{ color: m.urgent ? 'var(--amber-dark)' : 'var(--text)', fontWeight: m.urgent ? 500 : 400 }}>{m.revision}</td>
                  <td>{m.heures}</td>
                  <td><span className={`badge badge-${m.statut==='disponible'?'green':m.statut==='affecte'?'blue':m.statut==='en_revision'?'red':'amber'}`}>{m.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
