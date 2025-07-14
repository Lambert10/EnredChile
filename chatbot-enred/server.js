import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

// ✅ Lista de orígenes permitidos
const allowedOrigins = [
  'https://enredchilecl.netlify.app',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://localhost:3000',
  'http://www.enredchile.cl',
  'http://enredchile.cl',
  'https://www.enredchile.cl',
  'https://enredchile.cl'
]

// ✅ Middleware CORS correcto para Render
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`❌ CORS bloqueado para origen no permitido: ${origin}`)
      callback(new Error(`No permitido por CORS: ${origin}`))
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

// Ruta GET de prueba
app.get('/chat', (req, res) => {
  res.send('Chatbot activo. Usa POST para enviar mensajes.')
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
          'OpenRouter-Referer': req.headers.origin || 'https://enredchilecl.netlify.app',
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
})
