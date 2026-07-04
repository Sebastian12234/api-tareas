import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import tareasRoutes from './routes/tareasRoutes'
import authRoutes from './routes/authRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({ mensaje: 'API de Tareas funcionando ✅' })
})

app.use('/auth', authRoutes)
app.use('/tareas', tareasRoutes)

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})