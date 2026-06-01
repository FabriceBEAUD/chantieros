import { useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import { useTable } from '../hooks/useTable'
import { fmt } from '../data/mock'

const Del = ({ onDelete }) => (
  <button onClick={onDelete} title="Supprimer"
    style={{ background:'none', border:'none', color:'var(--text-3)', fontSize:14, cursor:'pointer', padding:'2px 4px', borderRadius:4, lineHeight:1 }}
    onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}>
    <i className="ti ti-trash" aria-hidden="true"></i>
  </button>
)

const StatusSelect = ({ value, options, onChange }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ fontSize:11, padding:'2px 6px', border:'0.5px solid var(--border)', borderRadius:12, background:'var(--surface)', color:'var(--text)', cursor:'pointer', fontFamily:'var(--font)' }}>
    {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
  </select>
)

function EditableCell({ value, onSave, type = 'text', style = {} }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)

  useEffect(() => setVal(value), [value])

  const commit = () => { setEditing(false); if (val !== value) onSave(val) }

  if (editing) {
    return <input autoFocus type={type} value={val}
      onChange={e => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setVal(value); setEditing(false) } }}
      style={{ width: type === 'date' ? 120 : 70, fontSize:11, padding:'2px 6px', border:'1px solid var(--blue)', borderRadius:4, background:'var(--surface)', color:'var(--text)', fontFamily:'var(--font)', ...style }} />
  }
  return (
    <span onClick={() => setEditing(true)} title="Cliquer pour modifier"
      style={{ cursor:'pointer', borderBottom:'1px dashed var(--border)', paddingBottom:1, ...style }}>
      {value || '—'}
    </span>
  )
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0)
  const n = value || 0
  return (
    <span style={{ fontSize:15, letterSpacing:1, cursor:'pointer' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          style={{ color: i <= (hover || n) ? 'var(--amber)' : 'var(--border-strong)' }}>
          ★
        </span>
      ))}
    </span>
  )
}

const CHANTIER_STATUTS = [['en_cours','En cours'],['retard','Retard'],['bloque','Bloqué'],['depart','Démarrage'],['termine','Terminé']]

export function Chantiers() {
  const { data: list, loading, insert, update, remove } = useTable('chantiers')
  const [filter, setFilter] = useState('tous')
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState(false)
  const [form, setForm] = useState({ ref:'', nom:'', client:'Conseil Dép. Ain', chef:'P. Durand', budget:'', type:'public' })

  const filtered = filter === 'tous' ? list : list.filter(c => c.statut === filter)
  const filters = [['tous','Tous'],['en_cours','En cours'],['retard','Retard'],['bloque','Bloqué'],['depart','Démarrage']]

  const create = async () => {
    if (!form.nom) return
    await insert({ ref:form.ref||'REF-2026', nom:form.nom, client:form.client, chef:form.chef, budget:parseInt(form.budget)||0, avancement:0, statut:'depart', color:'#378ADD' })
    setShowForm(false); setToast(true); setTimeout(() => setToast(false), 3000)
    setForm({ ref:'', nom:'', client:'Conseil Dép. Ain', chef:'P. Durand', budget:'', type:'public' })
  }

  const del = (id, nom) => { if (window.confirm(`Supprimer le chantier "${nom}" ?`)) remove(id) }

  return (
    <div className="fade-in">
      {toast && <div className="toast toast-success">Chantier créé avec succès</div>}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h1 className="section-title">Chantiers</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}><i className="ti ti-plus" aria-hidden="true"></i>Nouveau chantier</button>
      </div>
      <div style={{ display:'flex', gap:6, marginBottom:10 }}>
        {filters.map(([v,l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding:'5px 12px', borderRadius:20, border:'0.5px solid var(--border-strong)', background: filter===v ? 'var(--blue-dark)' : 'transparent', color: filter===v ? 'var(--blue-mid)' : 'var(--text-2)', fontSize:11, cursor:'pointer', fontFamily:'var(--font)' }}>{l}</button>
        ))}
      </div>
      <div className="panel" style={{ marginBottom:10 }}>
        {loading ? <div style={{color:'var(--text-2)',fontSize:12,padding:12}}>Chargement…</div> : (
        <div style={{ overflowX:'auto' }}>
          <table className="data">
            <thead><tr><th>Référence</th><th>Chantier</th><th>Client</th><th>Chef</th><th>Budget</th><th>Avancement</th><th>Statut</th><th></th></tr></thead>
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
                        <div style={{ width:(c.avancement||0)+'%', height:'100%', background:(c.avancement||0)>60?'#639922':(c.avancement||0)>30?'#EF9F27':'#E24B4A', borderRadius:4 }}></div>
                      </div>
                      <EditableCell value={c.avancement||0} type="number"
                        onSave={v => update(c.id, { avancement: Math.min(100, Math.max(0, parseInt(v)||0)) })}
                        style={{ fontSize:11, color:'var(--text-2)', minWidth:28 }} />
                      <span style={{ fontSize:11, color:'var(--text-3)' }}>%</span>
                    </div>
                  </td>
                  <td><StatusSelect value={c.statut} options={CHANTIER_STATUTS} onChange={v => update(c.id, { statut: v })} /></td>
                  <td><Del onDelete={() => del(c.id, c.nom)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
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

const SIT_STATUTS = [['emise','Émise'],['en_attente','En attente'],['payee','Payée'],['impayee','Impayée']]

export function Finance() {
  const { data: situations, loading, update, remove } = useTable('situations')

  const totalImpayes = situations.filter(s => s.statut === 'impayee').reduce((s, r) => s + (Number(r.ttc)||0), 0)
  const totalPayees = situations.filter(s => s.statut === 'payee').reduce((s, r) => s + (Number(r.ttc)||0), 0)

  const del = (id) => { if (window.confirm('Supprimer cette situation ?')) remove(id) }

  return (
    <div className="fade-in">
      <h1 className="section-title" style={{ marginBottom:12 }}>Trésorerie & situations de travaux</h1>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-val">{fmt(totalPayees)}</div><div className="kpi-lbl">Encaissements</div></div>
        <div className="kpi-card"><div className="kpi-val">{fmt(totalImpayes)}</div><div className="kpi-lbl">Impayés total</div><div className="kpi-delta dn">{situations.filter(s=>s.statut==='impayee').length} factures</div></div>
        <div className="kpi-card"><div className="kpi-val">{situations.filter(s=>s.statut==='en_attente').length}</div><div className="kpi-lbl">En attente</div></div>
        <div className="kpi-card"><div className="kpi-val">{situations.length}</div><div className="kpi-lbl">Total situations</div></div>
      </div>
      <div className="panel">
        <div className="panel-title">Situations de travaux</div>
        {loading ? <div style={{color:'var(--text-2)',fontSize:12,padding:12}}>Chargement…</div> : (
        <div style={{ overflowX:'auto' }}>
          <table className="data">
            <thead><tr><th>Chantier</th><th>N°</th><th>Émise le</th><th>Échéance</th><th>Montant HT</th><th>TTC</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {situations.map(s => (
                <tr key={s.id}>
                  <td style={{fontWeight:500}}>{s.chantier}</td><td>{s.num}</td><td>{s.emise}</td><td>{s.echeance}</td>
                  <td>{fmt(s.ht)}</td><td>{fmt(s.ttc)}</td>
                  <td><StatusSelect value={s.statut} options={SIT_STATUTS} onChange={v => update(s.id, { statut: v })} /></td>
                  <td><Del onDelete={() => del(s.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  )
}

function generatePDF({ chantier, num, av, periode, rg, net, ttc, echeance }) {
  const doc = new jsPDF()
  const today = new Date().toLocaleDateString('fr-FR')

  doc.setFillColor(22, 40, 68)
  doc.rect(0, 0, 210, 28, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('ChantierOS', 14, 12)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Situation de travaux', 14, 20)

  doc.setTextColor(40, 40, 40)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text(`Situation n° ${num}`, 14, 42)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  doc.text(`Chantier : ${chantier}`, 14, 52)
  doc.text(`Date d'émission : ${today}`, 14, 60)
  doc.text(`Échéance : ${echeance || today}`, 14, 68)
  doc.text(`Avancement : ${av}%`, 14, 76)

  doc.setDrawColor(200, 200, 200)
  doc.line(14, 84, 196, 84)

  const rows = [
    ['Montant de la période HT', `${periode.toLocaleString('fr-FR')} €`],
    ['Retenue de garantie (5%)', `− ${rg.toLocaleString('fr-FR')} €`],
    ['Net HT', `${net.toLocaleString('fr-FR')} €`],
    ['TVA (20%)', `${(ttc - net).toLocaleString('fr-FR')} €`],
  ]

  let y = 96
  doc.setFontSize(9)
  rows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    doc.text(label, 14, y)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(40, 40, 40)
    doc.text(value, 160, y, { align: 'right' })
    y += 10
  })

  doc.line(14, y, 196, y)
  y += 8
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(22, 40, 68)
  doc.text('TOTAL NET TTC', 14, y)
  doc.text(`${ttc.toLocaleString('fr-FR')} €`, 196, y, { align: 'right' })

  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.setFont('helvetica', 'normal')
  doc.text('Document généré par ChantierOS', 14, 282)
  doc.text(today, 196, 282, { align: 'right' })

  doc.save(`situation-${chantier.replace(/\s+/g,'-')}-n${num}.pdf`)
}

export function Situations() {
  const { data: chantiers } = useTable('chantiers')
  const { data: allSituations, insert } = useTable('situations')
  const [chantier, setChantier] = useState('')
  const [num, setNum] = useState(1)
  const [av, setAv] = useState(0)
  const [cumul, setCumul] = useState(0)
  const [prec, setPrec] = useState(0)
  const [echeance, setEcheance] = useState('')
  const [toast, setToast] = useState(false)

  const selectedNom = chantier || (chantiers[0]?.nom || '')
  const sitsPourChantier = allSituations.filter(s => s.chantier === selectedNom).sort((a,b) => (a.num||0)-(b.num||0))
  const derniereSit = sitsPourChantier[sitsPourChantier.length - 1]

  useEffect(() => {
    if (derniereSit) {
      setNum((derniereSit.num || 0) + 1)
      setPrec(derniereSit.ht || 0)
      setAv(Math.min(100, (derniereSit.avancement || 0) + 10))
    } else {
      setNum(1); setPrec(0); setAv(0)
    }
  }, [selectedNom, allSituations.length])

  const periode = cumul - prec
  const rg = Math.round(Math.max(0, periode) * 0.05)
  const net = Math.max(0, periode) - rg
  const ttc = Math.round(net * 1.2)

  const create = async () => {
    const today = new Date().toLocaleDateString('fr-FR')
    await insert({ chantier: selectedNom, num, emise: today, echeance: echeance || today, ht: net, ttc, avancement: av, statut: 'emise' })
    setToast(true); setTimeout(() => setToast(false), 3000)
    generatePDF({ chantier: selectedNom, num, av, periode: Math.max(0, periode), rg, net, ttc, echeance })
  }

  return (
    <div className="fade-in">
      {toast && <div className="toast toast-success">Situation créée et PDF téléchargé</div>}
      <h1 className="section-title" style={{ marginBottom:12 }}>Nouvelle situation de travaux</h1>
      <div className="panel">
        <div className="form-grid">
          <div className="form-row"><label>Chantier</label>
            <select value={selectedNom} onChange={e => setChantier(e.target.value)}>
              {chantiers.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </select>
          </div>
          <div className="form-row"><label>N° de situation</label><input type="number" value={num} onChange={e=>setNum(+e.target.value)} /></div>
          <div className="form-row"><label>Avancement ({av}%)</label><input type="range" min={0} max={100} step={1} value={av} onChange={e=>setAv(+e.target.value)} /></div>
          <div className="form-row"><label>Date d'échéance</label><input type="date" value={echeance} onChange={e=>setEcheance(e.target.value)} /></div>
          <div className="form-row"><label>Montant cumulé HT (€)</label><input type="number" value={cumul} onChange={e=>setCumul(+e.target.value)} /></div>
          <div className="form-row"><label>Montant précédent HT (€) <span style={{fontSize:10,color:'var(--text-2)'}}>auto</span></label><input type="number" value={prec} onChange={e=>setPrec(+e.target.value)} /></div>
        </div>

        {sitsPourChantier.length > 0 && (
          <div style={{ background:'var(--surface2)', borderRadius:6, padding:'8px 12px', marginBottom:12, fontSize:11, color:'var(--text-2)' }}>
            {sitsPourChantier.length} situation{sitsPourChantier.length>1?'s':''} existante{sitsPourChantier.length>1?'s':''} pour ce chantier —
            dernière : n°{derniereSit.num} ({fmt(derniereSit.ht)} HT, {derniereSit.statut})
          </div>
        )}

        <div style={{ background:'var(--surface2)', borderRadius:8, padding:'10px 14px', marginBottom:12 }}>
          {[[`Montant période HT`,fmt(Math.max(0,periode)),'var(--text)'],[`Retenue de garantie (5%)`,`− ${fmt(rg)}`,'var(--amber-dark)'],[`Net HT`,fmt(net),'var(--text)'],[`Net TTC (TVA 20%)`,fmt(ttc),'var(--blue)']].map(([l,v,c],i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'3px 0', borderTop: i===3?'0.5px solid var(--border)':'none', marginTop: i===3?4:0, paddingTop: i===3?8:3 }}>
              <span style={{ fontSize:12, color: i===3?'var(--text)':'var(--text-2)', fontWeight: i===3?500:400 }}>{l}</span>
              <span style={{ fontSize:12, fontWeight: i===3?500:400, color:c }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button className="btn-primary" onClick={create}><i className="ti ti-file-invoice" aria-hidden="true"></i>Créer & télécharger PDF</button>
          <button className="btn-secondary" onClick={() => generatePDF({ chantier: selectedNom, num, av, periode: Math.max(0,periode), rg, net, ttc, echeance })}>
            <i className="ti ti-download" aria-hidden="true"></i>PDF seulement
          </button>
        </div>
      </div>
    </div>
  )
}

export function RH() {
  const { data: pointages, loading: loadP, update: updP, remove: delP } = useTable('pointages')
  const { data: habilitations, loading: loadH, remove: delH } = useTable('habilitations')

  const delPointage = (id) => { if (window.confirm('Supprimer ce pointage ?')) delP(id) }
  const delHab = (id, nom) => { if (window.confirm(`Supprimer l'habilitation de ${nom} ?`)) delH(id) }

  return (
    <div className="fade-in">
      <h1 className="section-title" style={{ marginBottom:12 }}>RH & pointage du jour</h1>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-val">{pointages.length}</div><div className="kpi-lbl">Pointages</div></div>
        <div className="kpi-card"><div className="kpi-val">{pointages.filter(p=>p.statut==='soumis').length}</div><div className="kpi-lbl">À valider</div></div>
        <div className="kpi-card"><div className="kpi-val">{pointages.filter(p=>p.gd).length}</div><div className="kpi-lbl">Grands déplacements</div></div>
        <div className="kpi-card"><div className="kpi-val">{habilitations.filter(h=>h.jours<=30).length}</div><div className="kpi-lbl">Habilitations à renouveler</div></div>
      </div>
      <div className="panel" style={{ marginBottom:10 }}>
        <div className="panel-title">Pointages</div>
        {loadP ? <div style={{color:'var(--text-2)',fontSize:12,padding:12}}>Chargement…</div> : (
        <div style={{ overflowX:'auto' }}>
          <table className="data">
            <thead><tr><th>Salarié</th><th>Chantier</th><th>Date</th><th>Heures</th><th>H.Sup</th><th>GD</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {pointages.map(p => (
                <tr key={p.id}>
                  <td style={{fontWeight:500}}>{p.nom}</td><td>{p.chantier}</td><td>{p.date}</td><td>{p.h}</td><td>{p.sup}</td>
                  <td>{p.gd ? <span className="badge badge-green">Oui</span> : 'Non'}</td>
                  <td><StatusSelect value={p.statut||'soumis'} options={[['soumis','À valider'],['valide','Validé']]} onChange={v => updP(p.id, { statut: v })} /></td>
                  <td><Del onDelete={() => delPointage(p.id)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
      <div className="panel">
        <div className="panel-title">Habilitations</div>
        {loadH ? <div style={{color:'var(--text-2)',fontSize:12,padding:12}}>Chargement…</div> : (
        <table className="data">
          <thead><tr><th>Salarié</th><th>Habilitation</th><th>Expiration</th><th>Jours restants</th><th></th></tr></thead>
          <tbody>
            {habilitations.map(h => (
              <tr key={h.id}>
                <td style={{fontWeight:500}}>{h.nom}</td><td>{h.type}</td><td>{h.expiration}</td>
                <td><span className={`badge badge-${h.jours<0?'red':h.jours<=30?'amber':'green'}`}>{h.jours<0?'Expiré':h.jours+' jours'}</span></td>
                <td><Del onDelete={() => delHab(h.id, h.nom)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  )
}

const INC_STATUTS = [['ouvert','Ouvert'],['en_traitement','En traitement'],['ferme','Fermé']]

export function Securite() {
  const { data: incidents, loading, insert, update, remove } = useTable('incidents')

  const report = () => insert({ chantier:'RD132 Déviation', type:'Situation dangereuse', gravite:'mineur', date:new Date().toLocaleDateString('fr-FR'), statut:'ouvert' })
  const del = (id, type) => { if (window.confirm(`Supprimer l'incident "${type}" ?`)) remove(id) }

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h1 className="section-title">Sécurité & conformité</h1>
        <button className="btn-primary" onClick={report}><i className="ti ti-alert-triangle" aria-hidden="true"></i>Déclarer un incident</button>
      </div>
      <div className="kpi-grid">
        <div className="kpi-card"><div className="kpi-val">0</div><div className="kpi-lbl">Accidents ce mois</div><div className="kpi-delta up">Objectif atteint</div></div>
        <div className="kpi-card"><div className="kpi-val">{incidents.filter(i=>i.statut==='ouvert').length}</div><div className="kpi-lbl">Incidents ouverts</div></div>
        <div className="kpi-card"><div className="kpi-val">4/6</div><div className="kpi-lbl">PPSPS à jour</div></div>
        <div className="kpi-card"><div className="kpi-val">3</div><div className="kpi-lbl">EPI à renouveler</div></div>
      </div>
      <div className="panel" style={{ marginBottom:10 }}>
        <div className="panel-title">Incidents</div>
        {loading ? <div style={{color:'var(--text-2)',fontSize:12,padding:12}}>Chargement…</div> : (
        <table className="data">
          <thead><tr><th>Chantier</th><th>Type</th><th>Gravité</th><th>Date</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            {incidents.map(inc => (
              <tr key={inc.id}>
                <td style={{fontWeight:500}}>{inc.chantier}</td><td>{inc.type}</td>
                <td><span className={`badge badge-${inc.gravite==='modere'?'amber':inc.gravite==='grave'?'red':'blue'}`}>{inc.gravite}</span></td>
                <td>{inc.date}</td>
                <td><StatusSelect value={inc.statut} options={INC_STATUTS} onChange={v => update(inc.id, { statut: v })} /></td>
                <td><Del onDelete={() => del(inc.id, inc.type)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  )
}

export function Planning() {
  const { data: chantiers, loading } = useTable('chantiers')
  const weeks = ['S22','S23','S24','S25','S26','S27','S28','S29']
  const colors = { en_cours:'#639922', retard:'#EF9F27', bloque:'#E24B4A', depart:'#378ADD', termine:'#999' }
  const actifs = chantiers.filter(c => c.statut !== 'termine')

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
        {loading ? <div style={{color:'var(--text-2)',fontSize:12,padding:12}}>Chargement…</div> : actifs.map(c => {
          const av = c.avancement || 0
          const end = Math.round((av / 100) * weeks.length)
          const color = colors[c.statut] || '#639922'
          return (
            <div key={c.id} style={{ display:'flex', alignItems:'center', marginBottom:8 }}>
              <div style={{ width:150, fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{c.nom}</div>
              <div style={{ flex:1, background:'var(--surface2)', borderRadius:4, height:18, display:'grid', gridTemplateColumns:`repeat(${weeks.length},1fr)`, overflow:'hidden' }}>
                {weeks.map((_,j) => (
                  <div key={j} style={{ height:'100%', background: j<end ? color+'cc' : 'transparent', borderRight: j<end-1 ? `1px solid ${color}33` : 'none' }}></div>
                ))}
              </div>
              <div style={{ width:32, textAlign:'right', fontSize:11, color:'var(--text-2)', marginLeft:6 }}>{av}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const AO_STATUTS = [['analyse','Analyse'],['en_cours','En cours'],['soumis','Soumis'],['gagne','Gagné'],['perdu','Perdu']]

export function AO() {
  const { data: ao_data, loading, update, remove } = useTable('ao_data')

  const del = (id, intitule) => { if (window.confirm(`Supprimer l'AO "${intitule}" ?`)) remove(id) }

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h1 className="section-title">Appels d'offres</h1>
        <button className="btn-primary"><i className="ti ti-plus" aria-hidden="true"></i>Ajouter un AO</button>
      </div>
      <div className="panel">
        {loading ? <div style={{color:'var(--text-2)',fontSize:12,padding:12}}>Chargement…</div> : (
        <div style={{ overflowX:'auto' }}>
          <table className="data">
            <thead><tr><th>Intitulé</th><th>Acheteur</th><th>Limite</th><th>Montant estimé</th><th>Priorité</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {ao_data.map(a => (
                <tr key={a.id}>
                  <td style={{fontWeight:500}}>{a.intitule}</td><td>{a.acheteur}</td><td>{a.limite}</td>
                  <td>{fmt(a.montant)}</td>
                  <td><StarRating value={a.prio} onChange={v => update(a.id, { prio: v })} /></td>
                  <td><StatusSelect value={a.statut} options={AO_STATUTS} onChange={v => update(a.id, { statut: v })} /></td>
                  <td><Del onDelete={() => del(a.id, a.intitule)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  )
}

const MAT_STATUTS = [['disponible','Disponible'],['affecte','Affecté'],['en_revision','En révision'],['panne','Panne']]

export function Materiel() {
  const { data: materiel_data, loading, update, remove } = useTable('materiel_data')

  const del = (id, nom) => { if (window.confirm(`Supprimer "${nom}" du parc matériel ?`)) remove(id) }

  return (
    <div className="fade-in">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <h1 className="section-title">Parc matériel</h1>
        <button className="btn-primary"><i className="ti ti-plus" aria-hidden="true"></i>Ajouter un engin</button>
      </div>
      <div className="panel">
        {loading ? <div style={{color:'var(--text-2)',fontSize:12,padding:12}}>Chargement…</div> : (
        <div style={{ overflowX:'auto' }}>
          <table className="data">
            <thead><tr><th>Désignation</th><th>Immat.</th><th>Affecté à</th><th>Prochain entretien</th><th>Compteur (h)</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {materiel_data.map(m => (
                <tr key={m.id}>
                  <td style={{fontWeight:500}}>{m.nom}</td>
                  <td style={{fontFamily:'var(--font-mono)',fontSize:11}}>{m.immat}</td>
                  <td>{m.affecte}</td>
                  <td style={{ color: m.urgent ? 'var(--amber-dark)' : 'var(--text)' }}>
                    <EditableCell value={m.revision} type="text" onSave={v => update(m.id, { revision: v })} />
                  </td>
                  <td>
                    <EditableCell value={m.heures} type="number" onSave={v => update(m.id, { heures: v })} />
                  </td>
                  <td><StatusSelect value={m.statut} options={MAT_STATUTS} onChange={v => update(m.id, { statut: v })} /></td>
                  <td><Del onDelete={() => del(m.id, m.nom)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  )
}
