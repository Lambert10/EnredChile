import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

// ✅ Configuración correcta de CORS
app.use(cors({
  origin: 'https://enredchilecl.netlify.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}))

app.use(express.json())

const OPENROUTER_API_KEY = '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'

// Ruta GET de prueba
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
            content: 'Eres el asistente oficial de Enred Chile. Tu tono es profesional, cercano y claro. Ayudas a explicar nuestros servicios de consultoría, formación y estrategia organizacional. Si el usuario hace una pregunta genérica, preséntale brevemente lo que ofrecemos y ofrece asistencia amable. Siempre responde en español. Si te preguntan por algún contacto da este número de contacto de Ignacio Lambert +56976231513'
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
    console.error(error)
    res.status(500).json({ reply: 'Ocurrió un error al conectar con el chatbot.' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando con OpenRouter en http://localhost:${PORT}`)
})
