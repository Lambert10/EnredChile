import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

// ✅ CORS CONFIGURADO CORRECTAMENTE PARA NETLIFY
app.use(cors({
  origin: 'https://enredchilecl.netlify.app',  // tu frontend en Netlify
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json())

// ✅ Lee tu API Key desde las variables de entorno
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

console.log("🔐 API Key leída desde entorno:", OPENROUTER_API_KEY ? "✅ OK" : "❌ NO DEFINIDA")


// ✅ Ruta GET simple para verificar que el backend está vivo
app.get('/chat', (req, res) => {
  res.send("✅ Chatbot activo. Usa POST para enviar mensajes.")
})

// ✅ Ruta principal POST del chatbot
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
            content: 'Eres el asistente oficial de Enred Chile. Tu tono es profesional, cercano y claro. Ayudas a explicar nuestros servicios de consultoría, formación y estrategia organizacional. Si el usuario hace una pregunta genérica, preséntale brevemente lo que ofrecemos y ofrece asistencia amable. Siempre responde en español. Si te preguntan por algún contacto da este número de contacto de Ignacio Lambert +56976231513.'
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
    console.error('❌ Error al generar respuesta:')
    console.error(error?.response?.data || error.message)
    res.status(500).json({ reply: 'Ocurrió un error al conectar con el chatbot.' })
  }
})

// ✅ Puerto de ejecución
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`)
})
