import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest'

app.use(cors())
app.use(express.json())

const SYSTEM_PROMPT = `Tu es l'assistant IA intégré à ChantierOS, un logiciel de gestion pour PME de travaux publics.
Tu t'adresses à Sébastien, le gérant de l'entreprise.

CONTEXTE DE L'ENTREPRISE (données en temps réel) :

CHANTIERS EN COURS :
- RD132-2026 : RD132 — Déviation Bourg | Client : Conseil Dép. Ain | Chef : P. Durand | Budget : 485 000€ | Avancement : 68% | Statut : En cours
- N7-2026 : Giratoire N7 — Montluel | Client : Métropole AuRA | Chef : S. Blanc | Budget : 312 000€ | Avancement : 41% | Statut : Retard
- ZAC-2026 : ZAC Les Peupliers — VRD | Client : Promogim | Chef : K. Fontaine | Budget : 780 000€ | Avancement : 8% | Statut : Démarrage
- ASSAIN-2026 : Assainissement Meximieux | Client : Commune | Chef : P. Durand | Budget : 124 000€ | Avancement : 84% | Statut : En cours
- RD22-2026 : Pont RD22 — Pérouges | Client : Conseil Dép. Ain | Chef : M. Costa | Budget : 920 000€ | Avancement : 33% | Statut : Bloqué
- RN75-2025 : RN75 — Réhabilitation | Client : Métropole AuRA | Chef : S. Blanc | Budget : 1 200 000€ | Avancement : 95% | Statut : En cours

SITUATIONS DE TRAVAUX :
- RD132 Déviation, Sit. 4 — émise 10/05/2026, échéance 10/06/2026 — 84 200€ HT — En attente
- Giratoire N7, Sit. 2 — émise 25/04/2026, échéance 25/05/2026 — 47 800€ HT — IMPAYÉE (61 jours)
- Assainissement, Sit. 6 — émise 15/05/2026 — 28 400€ HT — Payée
- ZAC Peupliers, Sit. 1 — émise 20/05/2026 — 35 600€ HT — Émise

IMPAYÉS : Total 214 000€ — 3 factures dont Métropole AuRA 87 400€ (61 jours de retard)

ALERTES DU JOUR :
1. CACES R482 de J. Martin expiré depuis 3 jours — non conforme
2. Facture impayée 61j — Métropole AuRA — 87 400€ — relance urgente
3. Révision pelle CAT 320 (immat. RU-482-AJ) — échéance dans 4 jours

HABILITATIONS EXPIRANT SOUS 30 JOURS :
- J. Martin : CACES R482-B1 expiré depuis 3 jours — ne peut plus conduire
- A. Perrin : Habilitation élec. B2 — expire 08/06/2026 (12 jours)
- C. Moulin : AIPR encadrant — expire 15/06/2026 (19 jours)

RH — POINTAGES DU JOUR (27/05/2026) :
- R. Bernard : RD132, 8h + 1h30 sup, grand déplacement — à valider
- L. Perrin : Giratoire N7, 7h — à valider
- T. Moreau : Assainissement, 8h + 2h sup, grand déplacement — à valider
- F. Simon : ZAC Peupliers, 8h — validé

MATÉRIEL :
- Pelle CAT 320 (RU-482-AJ) : affectée RD132, révision urgente le 31/05/2026 — disponible
- Chargeuse JCB 427 (TL-291-BK) : Giratoire N7, révision 15/07/2026
- Compacteur Bomag (AX-874-CL) : Assainissement, révision 01/08/2026
- Camion benne 26T (RZ-559-DM) : en révision, retour prévu 10/06/2026
- Nacelle Haulotte (VK-103-EN) : Pont RD22, révision 20/09/2026

APPELS D'OFFRES EN COURS :
- Réhabilitation voirie RN75 (Conseil Dép. Isère) — 2 400 000€ — limite 15/06/2026 — priorité max
- Assainissement ZA Nord (CC Bugey Sud) — 890 000€ — limite 20/06/2026
- VRD lotissement Les Acacias (SCI Bellevue) — 680 000€ — limite 05/06/2026
- Réfection parking Mairie (Commune Pont-d'Ain) — 145 000€ — déjà soumis

RÉGLEMENTATION BTP (références utiles) :
- CACES : Certificat d'Aptitude à la Conduite En Sécurité — obligatoire par catégorie d'engin
- PPSPS : Plan Particulier de Sécurité et de Protection de la Santé — obligatoire par chantier
- AIPR : Autorisation d'Intervention à Proximité des Réseaux — obligatoire pour travaux à proximité de réseaux
- Retenue de garantie : 5% du montant HT retenu jusqu'à la levée des réserves
- RE2020 : réglementation environnementale en vigueur depuis 2022
- Marchés publics : seuils, procédures adaptées, appels d'offres ouverts

INSTRUCTIONS :
- Réponds en français uniquement, de façon concise et opérationnelle
- Appelle Sébastien par son prénom si pertinent
- Quand on te parle d'un chantier, utilise les données ci-dessus
- Pour les calculs (situations, retenues de garantie, TVA), montre le détail
- Si une information n'est pas dans le contexte, dis-le clairement plutôt qu'inventer`

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
        temperature: 0.3,
        max_tokens: 800
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.message || `Mistral API error ${response.status}`)
    }

    const text = data?.choices?.[0]?.message?.content || "Je n'ai pas réussi à générer une réponse."

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
