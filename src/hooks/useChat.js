import { useState, useCallback } from 'react'

export function useChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Bonjour Michel ! Je suis votre assistant ChantierOS. Je peux vous aider sur vos chantiers, votre trésorerie, vos équipes et la réglementation TP. Que puis-je faire pour vous ?'
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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

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
        updated[updated.length - 1] = { role: 'assistant', content: 'Désolé, une erreur est survenue. Vérifiez votre clé API Anthropic dans le fichier .env.' }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  const reset = useCallback(() => {
    setMessages([{ role: 'assistant', content: 'Bonjour Michel ! Je suis votre assistant ChantierOS. Comment puis-je vous aider ?' }])
    setError(null)
  }, [])

  return { messages, loading, error, sendMessage, reset }
}
