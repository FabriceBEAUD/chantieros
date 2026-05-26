import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'

const app = express()
const PORT = process.env.PORT || 3001
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.use(cors())
app.use(express.json())

const SYSTEM_PROMPT = `Tu es l'assistant IA intégré à ChantierOS, un logiciel de gestion pour PME de travaux publics.
Tu aides le gérant et ses équipes à piloter leurs chantiers, leur trésorerie, leurs RH et leur sécurité.

Contexte de l'entreprise :
- 6 chantiers actifs (RD132 Déviation Bourg, Giratoire N7 Montluel, ZAC Les Peupliers, Assainissement Meximieux, Pont RD22 Pérouges, RN75 Réhabilitation)
- 38 salariés pointés aujourd'hui, 2 absences
- CA en cours : 847 000€, impayés > 30j : 214 000€ (3 factures)
- Alertes actives : CACES R482 expiré (J. Martin), facture impayée 61j (Métropole AuRA 87 400€), révision pelle CAT 320 dans 4 jours

Tu peux répondre à des questions sur :
- Le statut des chantiers et leur avancement
- La trésorerie, les situations de travaux, les impayés
- Les RH : pointages, habilitations, formations
- La sécurité : incidents, PPSPS, EPI
- Les appels d'offres et le pipeline commercial
- Les règles métier BTP (facturation à l'avancement, retenue de garantie, marchés publics)
- La réglementation TP (CACES, habilitations, PPSPS, RE2020, Loi Bâtir Responsable 2025)

Réponds de façon concise, professionnelle et opérationnelle. Donne des chiffres quand tu les connais.
Si tu proposes une action, sois précis sur les étapes. Langue : français uniquement.`

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages requis' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`)
      }
    }
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error('Anthropic error:', err)
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})

app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '1.0.0' }))

app.listen(PORT, () => console.log(`ChantierOS API → http://localhost:${PORT}`))
