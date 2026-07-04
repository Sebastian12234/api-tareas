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

/**
 * @swagger
 * /tareas:
 *   get:
 *     summary: Obtener todas las tareas
 *     tags: [Tareas]
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
router.get('/', (req: Request, res: Response) => obtenerTareas(req, res))

/**
 * @swagger
 * /tareas/filtrar/{estado}:
 *   get:
 *     summary: Filtrar tareas por estado
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pendiente, completada]
 *     responses:
 *       200:
 *         description: Tareas filtradas
 */
router.get('/filtrar/:estado', (req: Request, res: Response) => filtrarTareas(req, res))

/**
 * @swagger
 * /tareas/{id}:
 *   get:
 *     summary: Obtener una tarea por id
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *       404:
 *         description: Tarea no encontrada
 */
router.get('/:id', (req: Request, res: Response) => obtenerTareaPorId(req, res))

/**
 * @swagger
 * /tareas:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, asignado_a, creado_por]
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               asignado_a:
 *                 type: integer
 *               creado_por:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 *       401:
 *         description: Token requerido
 */
router.post('/', verificarToken, (req: Request, res: Response) => crearTarea(req, res))

/**
 * @swagger
 * /tareas/{id}/completar:
 *   patch:
 *     summary: Marcar una tarea como completada
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea completada exitosamente
 *       400:
 *         description: Tarea ya completada
 *       404:
 *         description: Tarea no encontrada
 */
router.patch('/:id/completar', verificarToken, (req: Request, res: Response) => completarTarea(req, res))

export default router