import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()
app.use(cors())
app.use(express.json())

const OPENROUTER_API_KEY = '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'

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'Eres el asistente oficial de Enred Chile. Tu tono es profesional, cercano y claro. Ayudas a explicar nuestros servicios de consultoría, formación y estrategia organizacional. Si el usuario hace una pregunta genérica, preséntale brevemente lo que ofrecemos y ofrece asistencia amable. Siempre responde en español. Si te preguntan por algún contacto da este numero de contacto de Ignacio Lambert +56976231513'
          },
          { 
            role: 'user',
            content: message
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'OpenRouter-Referer': 'http://localhost:3000',
          'Content-Type': 'application/json'
        }
      }
    )

    const reply = response.data.choices?.[0]?.message?.content?.trim() || 'Lo siento, no entendí tu mensaje.'
    res.json({ reply })

  } catch (error) {
    console.error('❌ Error al generar respuesta:', error.response?.data || error.message)
    res.status(500).json({ reply: 'Ocurrió un error al conectar con el chatbot.' })
  }
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando con OpenRouter en http://localhost:${PORT}`)
})
