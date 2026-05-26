import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest'

app.use(cors())
app.use(express.json())

const SYSTEM_PROMPT = `Tu es l'assistant IA intégré à ChantierOS, un logiciel de gestion pour PME de travaux publics.
Tu aides le gérant et ses équipes à piloter leurs chantiers, leur trésorerie, leurs RH et leur sécurité.

Contexte de l'entreprise :
- 6 chantiers actifs
- 38 salariés pointés aujourd'hui, 2 absences
- CA en cours : 847 000€, impayés > 30j : 214 000€
- Alertes actives : CACES expiré, facture impayée, révision matériel

Réponds de façon concise, professionnelle et opérationnelle. Langue : français uniquement.`

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages requis' })
  }

  if (!process.env.MISTRAL_API_KEY) {
    return res.status(500).json({ error: 'MISTRAL_API_KEY manquante côté serveur' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const mistralMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
        .filter(m => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string')
        .map(m => ({ role: m.role, content: m.content }))
    ]

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.MISTRAL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: mistralMessages,
        temperature: 0.4,
        max_tokens: 1024,
        stream: true
      })
    })

    if (!response.ok) {
      const details = await response.text()
      throw new Error('Erreur Mistral ' + response.status + ': ' + details)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data: ')) continue

        const data = trimmed.slice(6)
        if (data === '[DONE]') {
          res.write('data: [DONE]\n\n')
          res.end()
          return
        }

        try {
          const parsed = JSON.parse(data)
          const text = parsed.choices?.[0]?.delta?.content
          if (text) res.write('data: ' + JSON.stringify({ text }) + '\n\n')
        } catch {}
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error('Mistral error:', err)
    res.write('data: ' + JSON.stringify({ error: err.message }) + '\n\n')
    res.end()
  }
})

app.get('/api/health', (_, res) => res.json({ status: 'ok', provider: 'mistral', model: MISTRAL_MODEL }))

app.listen(PORT, () => console.log('ChantierOS API Mistral -> http://localhost:' + PORT))
