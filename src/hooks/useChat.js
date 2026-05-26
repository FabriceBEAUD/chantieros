import { useState, useCallback } from 'react'

const API_BASE_URL = 'https://chantieros.onrender.com'

export function useChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour Michel ! Je suis votre assistant ChantierOS propulsé par Mistral AI. Que puis-je faire pour vous aujourd’hui ?'
    }
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || loading) return

    const newMessages = [...messages, { role: 'user', content: userText }]
    setMessages(newMessages)
    setLoading(true)
    setError(null)

    const assistantMsg = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      if (!res.ok) throw new Error('HTTP ' + res.status)

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue

          const data = line.slice(6)
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)

            if (parsed.text) {
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + parsed.text
                }
                return updated
              })
            }

            if (parsed.error) setError(parsed.error)
          } catch {}
        }
      }
    } catch (err) {
      setError(err.message)

      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Erreur de connexion à Mistral AI. Vérifiez que le backend Render est actif et que MISTRAL_API_KEY est bien renseignée.'
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  const reset = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: 'Bonjour Michel ! Je suis votre assistant ChantierOS propulsé par Mistral AI.'
      }
    ])

    setError(null)
  }, [])

  return { messages, loading, error, sendMessage, reset }
}
