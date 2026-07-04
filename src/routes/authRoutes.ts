import { Router, Request, Response } from 'express'
import { registro, login } from '../controllers/authController'

const router = Router()

router.post('/registro', (req: Request, res: Response) => registro(req, res))
router.post('/login', (req: Request, res: Response) => login(req, res))

export default router
