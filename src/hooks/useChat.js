import { useState, useCallback } from 'react'

const API_BASE_URL = ''

export function useChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour Sébastien ! Je suis votre assistant ChantierOS propulsé par Mistral AI. Que puis-je faire pour vous aujourd\'hui ?'
    }
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(async (userText, context) => {
    if (!userText.trim() || loading) return

    const userMessage = { role: 'user', content: userText }
    const currentMessages = [...messages, userMessage]

    setMessages(currentMessages)
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages, context })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur serveur')

      setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
    } catch (err) {
      setError(err.message)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Erreur de connexion : ' + err.message }])
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  const reset = useCallback(() => {
    setMessages([{
      role: 'assistant',
      content: 'Bonjour Sébastien ! Je suis votre assistant ChantierOS propulsé par Mistral AI.'
    }])
    setError(null)
  }, [])

  return { messages, loading, error, sendMessage, reset }
}
