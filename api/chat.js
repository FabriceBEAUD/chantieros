const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest'

const BASE_PROMPT = `Tu es l'assistant IA intégré à ChantierOS, un logiciel de gestion pour PME de travaux publics.
Tu aides le gérant et ses équipes à piloter leurs chantiers, leur trésorerie, leurs RH et leur sécurité.
Réponds de façon concise, professionnelle et opérationnelle. Langue : français uniquement.
Quand on te pose une question sur un chantier ou une donnée, utilise UNIQUEMENT les données fournies ci-dessous — ne les invente pas.`

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, context } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages requis' })
    }

    const contextStr = context
      ? `\n\nDonnées actuelles de ChantierOS :\n${JSON.stringify(context, null, 2)}`
      : ''

    const mistralMessages = [
      { role: 'system', content: BASE_PROMPT + contextStr },
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
        temperature: 0.3,
        max_tokens: 600
      })
    })

    const data = await response.json()

    if (!response.ok || data.error || !data.choices) {
      const reason = data?.message || data?.error?.message || JSON.stringify(data)
      console.error('Mistral API error:', response.status, reason)
      return res.status(502).json({ error: `Mistral: ${reason}` })
    }

    res.json({ text: data.choices[0].message.content })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
