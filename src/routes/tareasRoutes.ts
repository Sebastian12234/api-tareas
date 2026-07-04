import { Router, Request, Response } from 'express'
import {
  obtenerTareas,
  obtenerTareaPorId,
  crearTarea,
  completarTarea,
  filtrarTareas
} from '../controllers/tareasController'
import { verificarToken } from '../middleware/auth'

const router = Router()

// Rutas públicas
router.get('/', (req: Request, res: Response) => obtenerTareas(req, res))
router.get('/filtrar/:estado', (req: Request, res: Response) => filtrarTareas(req, res))
router.get('/:id', (req: Request, res: Response) => obtenerTareaPorId(req, res))

// Rutas protegidas — requieren token
router.post('/', verificarToken, (req: Request, res: Response) => crearTarea(req, res))
router.patch('/:id/completar', verificarToken, (req: Request, res: Response) => completarTarea(req, res))

export default router