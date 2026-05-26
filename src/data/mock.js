export const chantiers = [
  { id:1, ref:'RD132-2026', nom:'RD132 — Déviation Bourg', client:'Conseil Dép. Ain', chef:'P. Durand', budget:485000, avancement:68, statut:'en_cours', color:'#639922' },
  { id:2, ref:'N7-2026',    nom:'Giratoire N7 — Montluel', client:'Métropole AuRA',   chef:'S. Blanc',  budget:312000, avancement:41, statut:'retard',   color:'#EF9F27' },
  { id:3, ref:'ZAC-2026',   nom:'ZAC Les Peupliers — VRD', client:'Promogim',         chef:'K. Fontaine',budget:780000, avancement:8, statut:'depart',   color:'#378ADD' },
  { id:4, ref:'ASSAIN-2026',nom:'Assainissement Meximieux',client:'Commune',           chef:'P. Durand', budget:124000, avancement:84, statut:'en_cours', color:'#639922' },
  { id:5, ref:'RD22-2026',  nom:'Pont RD22 — Pérouges',   client:'Conseil Dép. Ain', chef:'M. Costa',  budget:920000, avancement:33, statut:'bloque',   color:'#E24B4A' },
  { id:6, ref:'RN75-2025',  nom:'RN75 — Réhabilitation',  client:'Métropole AuRA',   chef:'S. Blanc',  budget:1200000,avancement:95, statut:'en_cours', color:'#639922' },
]

export const situations = [
  { id:1, chantier:'RD132 Déviation', num:'Sit. 4', emise:'10/05/2026', echeance:'10/06/2026', ht:84200, ttc:101040, statut:'en_attente' },
  { id:2, chantier:'Giratoire N7',    num:'Sit. 2', emise:'25/04/2026', echeance:'25/05/2026', ht:47800, ttc:57360,  statut:'impayee' },
  { id:3, chantier:'Assainissement',  num:'Sit. 6', emise:'15/05/2026', echeance:'15/06/2026', ht:28400, ttc:34080,  statut:'payee' },
  { id:4, chantier:'ZAC Peupliers',   num:'Sit. 1', emise:'20/05/2026', echeance:'20/06/2026', ht:35600, ttc:42720,  statut:'emise' },
]

export const pointages = [
  { id:1, nom:'R. Bernard', chantier:'RD132',       date:'27/05/2026', h:'8h', sup:'1h30', gd:true,  statut:'soumis' },
  { id:2, nom:'L. Perrin',  chantier:'Giratoire N7',date:'27/05/2026', h:'7h', sup:'0',    gd:false, statut:'soumis' },
  { id:3, nom:'T. Moreau',  chantier:'Assainissement',date:'27/05/2026',h:'8h', sup:'2h',  gd:true,  statut:'soumis' },
  { id:4, nom:'F. Simon',   chantier:'ZAC Peupliers',date:'27/05/2026', h:'8h', sup:'0',   gd:false, statut:'valide' },
]

export const habilitations = [
  { nom:'J. Martin',  type:'CACES R482-B1',       expiration:'24/05/2026', jours:-3 },
  { nom:'A. Perrin',  type:'Habilitation élec. B2',expiration:'08/06/2026', jours:12 },
  { nom:'C. Moulin',  type:'AIPR encadrant',       expiration:'15/06/2026', jours:19 },
]

export const incidents = [
  { id:1, chantier:'Giratoire N7', type:"Presqu'accident",    gravite:'modere', date:'22/05/2026', statut:'ouvert' },
  { id:2, chantier:'Pont RD22',    type:'Situation dangereuse',gravite:'mineur', date:'18/05/2026', statut:'en_traitement' },
]

export const ao_data = [
  { intitule:'Réhabilitation voirie RN75',    acheteur:'Conseil Dép. Isère', limite:'15/06/2026', montant:2400000, prio:5, statut:'en_cours' },
  { intitule:'VRD lotissement Les Acacias',   acheteur:'SCI Bellevue',       limite:'05/06/2026', montant:680000,  prio:3, statut:'analyse' },
  { intitule:'Réfection parking Mairie',      acheteur:'Commune Pont-d\'Ain',limite:'30/05/2026', montant:145000,  prio:2, statut:'soumis' },
  { intitule:'Assainissement ZA Nord',        acheteur:'CC Bugey Sud',       limite:'20/06/2026', montant:890000,  prio:4, statut:'en_cours' },
]

export const materiel_data = [
  { nom:'Pelle CAT 320',     immat:'RU-482-AJ', affecte:'RD132',       revision:'31/05/2026', heures:'4 820h',  statut:'disponible',  urgent:true },
  { nom:'Chargeuse JCB 427', immat:'TL-291-BK', affecte:'Giratoire N7',revision:'15/07/2026', heures:'2 140h',  statut:'affecte',     urgent:false },
  { nom:'Compacteur Bomag',  immat:'AX-874-CL', affecte:'Assainissement',revision:'01/08/2026',heures:'1 890h', statut:'affecte',     urgent:false },
  { nom:'Camion benne 26T',  immat:'RZ-559-DM', affecte:'—',           revision:'10/06/2026', heures:'98 400km',statut:'en_revision', urgent:false },
  { nom:'Nacelle Haulotte',  immat:'VK-103-EN', affecte:'Pont RD22',   revision:'20/09/2026', heures:'640h',    statut:'affecte',     urgent:false },
]

export const fmt = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n)) + '€'
