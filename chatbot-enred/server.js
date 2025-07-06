import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

// ✅ Middleware CORS configurado para responder preflight correctamente
app.use(cors({
  origin: 'https://enredchilecl.netlify.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

// ✅ Verifica que Render esté leyendo esta variable desde Environment
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

// Ruta de prueba
app.get('/chat', (req, res) => {
  res.send("Chatbot activo. Usa POST para enviar mensajes.")
})

// Ruta principal del chatbot
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
            content: 'Eres el asistente oficial de Enred Chile. Tu tono es profesional, cercano y claro. Ayudas a explicar nuestros servicios de consultoría, formación y estrategia organizacional. Siempre responde en español. Si te preguntan por contacto, da este número de Ignacio Lambert: +56976231513.'
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
          'OpenRouter-Referer': 'https://enredchilecl.netlify.app',
          'Content-Type': 'application/json'
        }
      }
    )

    const reply = response.data.choices?.[0]?.message?.content?.trim() || 'Lo siento, no entendí tu mensaje.'
    res.json({ reply })

  } catch (error) {
    console.error('❌ Error al generar respuesta COMPLETO:')
    console.error(error.response?.data || error.message || error)
    res.status(500).json({ reply: 'Ocurrió un error al conectar con el chatbot.' })
  }
})

// ✅ Escuchar en el puerto correcto que Render asigna
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
})
