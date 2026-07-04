import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './swagger'
import tareasRoutes from './routes/tareasRoutes'
import authRoutes from './routes/authRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

// Documentación Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/', (req: Request, res: Response) => {
  res.json({ 
    mensaje: 'API de Tareas funcionando ✅',
    documentacion: `http://localhost:${PORT}/docs`
  })
})

app.use('/auth', authRoutes)
app.use('/tareas', tareasRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
  console.log(`Documentación en http://localhost:${PORT}/docs`)
})