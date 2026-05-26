import { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'

const SUGGESTIONS = [
  'Quel est le statut du chantier RD132 ?',
  'Quels impayés dois-je relancer ?',
  'Quelles habilitations expirent bientôt ?',
  'Comment calculer une retenue de garantie ?',
  'Résume les alertes du jour',
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 10, animation: 'fadeIn 0.2s ease'
    }}>
      {!isUser && (
        <div style={{
          width: 26, height: 26, borderRadius: '50%', background: 'var(--blue-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 500, color: 'var(--blue-dark)',
          flexShrink: 0, marginRight: 8, marginTop: 2
        }}>AI</div>
      )}
      <div style={{
        maxWidth: '80%',
        background: isUser ? 'var(--blue-dark)' : 'var(--surface)',
        color: isUser ? 'var(--blue-mid)' : 'var(--text)',
        border: isUser ? 'none' : '0.5px solid var(--border)',
        borderRadius: isUser ? '14px 14px 2px 14px' : '2px 14px 14px 14px',
        padding: '9px 13px', fontSize: 13, lineHeight: 1.6,
        whiteSpace: 'pre-wrap', wordBreak: 'break-word'
      }}>
        {msg.content}
        {msg.content === '' && (
          <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-2)', animation: 'pulse 1s infinite' }}></span>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-2)', animation: 'pulse 1s 0.2s infinite' }}></span>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-2)', animation: 'pulse 1s 0.4s infinite' }}></span>
          </span>
        )}
      </div>
    </div>
  )
}

export default function AIAssistant({ collapsed, onToggle }) {
  const { messages, loading, sendMessage, reset } = useChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const submit = () => {
    const txt = input.trim()
    if (!txt || loading) return
    setInput('')
    sendMessage(txt)
  }

  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 100,
          background: 'var(--blue-dark)', color: 'var(--blue-mid)',
          border: 'none', borderRadius: '50%', width: 48, height: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, cursor: 'pointer', transition: 'background 0.15s',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
        title="Ouvrir l'assistant IA"
      >
        <i className="ti ti-message-chatbot" aria-hidden="true"></i>
      </button>
    )
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      width: 320, height: '100%', background: 'var(--surface)',
      borderLeft: '0.5px solid var(--border)', flexShrink: 0
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(3px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 14px', borderBottom: '0.5px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: 'var(--blue-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: 'var(--blue-dark)'
          }}>
            <i className="ti ti-message-chatbot" aria-hidden="true"></i>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Assistant IA</div>
            <div style={{ fontSize: 11, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#639922', display: 'inline-block' }}></span>
              Propulsé par Mistral AI
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 16, padding: 4, borderRadius: 6 }} title="Nouvelle conversation">
            <i className="ti ti-refresh" aria-hidden="true"></i>
          </button>
          <button onClick={onToggle} style={{ background: 'none', border: 'none', color: 'var(--text-2)', fontSize: 16, padding: 4, borderRadius: 6 }} title="Réduire">
            <i className="ti ti-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px' }}>
        {messages.map((m, i) => <Message key={i} msg={m} />)}
        <div ref={bottomRef} />
      </div>

      {messages.length === 1 && (
        <div style={{ padding: '0 12px 10px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-2)', marginBottom: 6 }}>Questions fréquentes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                style={{
                  background: 'var(--surface2)', border: '0.5px solid var(--border)',
                  borderRadius: 8, padding: '6px 10px', fontSize: 11,
                  color: 'var(--text)', textAlign: 'left', cursor: 'pointer',
                  transition: 'background 0.12s'
                }}
                onMouseEnter={e => e.target.style.background = 'var(--blue-light)'}
                onMouseLeave={e => e.target.style.background = 'var(--surface2)'}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '10px 12px', borderTop: '0.5px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }}
            placeholder="Posez une question..."
            rows={2}
            style={{
              flex: 1, resize: 'none', border: '0.5px solid var(--border-strong)',
              borderRadius: 8, padding: '8px 10px', fontSize: 12,
              fontFamily: 'var(--font)', background: 'var(--surface)',
              color: 'var(--text)', lineHeight: 1.5,
              outline: 'none'
            }}
          />
          <button
            onClick={submit}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? 'var(--surface2)' : 'var(--blue-dark)',
              color: loading || !input.trim() ? 'var(--text-2)' : 'var(--blue-mid)',
              border: 'none', borderRadius: 8, width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0, transition: 'all 0.15s'
            }}
          >
            <i className="ti ti-send" aria-hidden="true"></i>
          </button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 5, textAlign: 'center' }}>
          Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
        </div>
      </div>
    </div>
  )
}
