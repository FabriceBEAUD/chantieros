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
Réponds de façon concise, professionnelle et opérationnelle. Langue : français uniquement.`

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages requis' })
    }

    const mistralMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
        .filter(m => ['user', 'assistant'].includes(m.role))
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
        max_tokens: 500
      })
    })

    const data = await response.json()

    const text = data?.choices?.[0]?.message?.content || 'Je n’ai pas réussi à générer une réponse.'

    res.json({ text })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', provider: 'mistral', model: MISTRAL_MODEL })
})

app.listen(PORT, () => {
  console.log('ChantierOS API Mistral running on port ' + PORT)
})
