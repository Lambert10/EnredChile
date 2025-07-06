import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

app.use(cors({
  origin: 'https://enredchilecl.netlify.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

app.get('/chat', (req, res) => {
  res.send("Chatbot activo. Usa POST para enviar mensajes.")
})

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', // ✅ modelo seguro
        messages: [
          {
            role: 'system',
            content: 'Eres el asistente oficial de Enred Chile. Tu tono es profesional, cercano y claro...'
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
          'HTTP-Referer': 'https://enredchilecl.netlify.app', // ✅ corrección
          'X-Title': 'Chatbot Enred Chile',
          'Content-Type': 'application/json'
        }
      }
    )

    const reply = response.data.choices?.[0]?.message?.content?.trim() || 'Lo siento, no entendí tu mensaje.'
    res.json({ reply })

  } catch (error) {
    console.error('❌ Error al generar respuesta COMPLETO:')
    console.error(error.response?.data || error.message)
    res.status(500).json({ reply: 'Ocurrió un error al conectar con el chatbot.' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
})
