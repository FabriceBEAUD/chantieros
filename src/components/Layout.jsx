import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AIAssistant from './AIAssistant'

const NAV = [
  { section: 'Pilotage' },
  { id: '/', icon: 'ti-layout-dashboard', label: 'Tableau de bord' },
  { id: '/chantiers', icon: 'ti-building-factory', label: 'Chantiers' },
  { id: '/planning', icon: 'ti-calendar', label: 'Planning' },
  { section: 'Finance' },
  { id: '/finance', icon: 'ti-cash', label: 'Trésorerie' },
  { id: '/situations', icon: 'ti-receipt', label: 'Situations' },
  { section: 'Équipes' },
  { id: '/rh', icon: 'ti-users', label: 'RH & pointage' },
  { id: '/securite', icon: 'ti-shield-check', label: 'Sécurité' },
  { section: 'Commercial' },
  { id: '/ao', icon: 'ti-search', label: "Appels d'offres" },
  { id: '/materiel', icon: 'ti-truck', label: 'Matériel' },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [aiOpen, setAiOpen] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 16px', background: 'var(--surface)',
        borderBottom: '0.5px solid var(--border)', flexShrink: 0, zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 500 }}>
          <i className="ti ti-helmet" aria-hidden="true" style={{ color: 'var(--blue)', fontSize: 20 }}></i>
          Chantier<span style={{ color: 'var(--blue)' }}>OS</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {[['/', 'Tableau de bord'], ['/chantiers', 'Chantiers'], ['/finance', 'Finance'], ['/rh', 'RH'], ['/securite', 'Sécurité']].map(([path, label]) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                padding: '5px 10px', borderRadius: 6, border: 'none',
                background: pathname === path ? 'var(--blue-light)' : 'transparent',
                color: pathname === path ? 'var(--blue-dark)' : 'var(--text-2)',
                fontWeight: pathname === path ? 500 : 400, fontSize: 12, cursor: 'pointer',
                transition: 'all 0.12s'
              }}
            >{label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setAiOpen(!aiOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px',
              borderRadius: 6, border: '0.5px solid var(--border-strong)',
              background: aiOpen ? 'var(--blue-light)' : 'transparent',
              color: aiOpen ? 'var(--blue-dark)' : 'var(--text-2)',
              fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font)'
            }}
          >
            <i className="ti ti-message-chatbot" aria-hidden="true" style={{ fontSize: 14 }}></i>
            Assistant IA
          </button>
          <div style={{ position: 'relative' }}>
            <i className="ti ti-bell" aria-hidden="true" style={{ fontSize: 18, color: 'var(--text-2)' }}></i>
            <span style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, background: 'var(--red)', borderRadius: '50%' }}></span>
          </div>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', background: 'var(--blue-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 500, color: 'var(--blue-dark)'
          }}>SB</div>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{
          width: 190, flexShrink: 0, background: 'var(--surface)',
          borderRight: '0.5px solid var(--border)', overflowY: 'auto', padding: '8px 0'
        }}>
          {NAV.map((item, i) => {
            if (item.section) return (
              <div key={i} style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '12px 14px 4px' }}>
                {item.section}
              </div>
            )
            const active = pathname === item.id
            return (
              <div
                key={item.id}
                onClick={() => navigate(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 14px', cursor: 'pointer', fontSize: 12,
                  color: active ? 'var(--blue-dark)' : 'var(--text-2)',
                  background: active ? 'var(--blue-light)' : 'transparent',
                  fontWeight: active ? 500 : 400,
                  borderLeft: active ? '2px solid var(--blue)' : '2px solid transparent',
                  transition: 'all 0.12s'
                }}
              >
                <i className={`ti ${item.icon}`} aria-hidden="true" style={{ fontSize: 15 }}></i>
                {item.label}
              </div>
            )
          })}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: 'var(--bg)' }}>
          {children}
        </div>

        <AIAssistant collapsed={!aiOpen} onToggle={() => setAiOpen(!aiOpen)} />
      </div>
    </div>
  )
}
