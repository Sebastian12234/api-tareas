import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123'

export const verificarToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Token requerido' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.usuario = decoded
    next()
  } catch (error) {
    return res.status(403).json({ ok: false, mensaje: 'Token inválido o expirado' })
  }
}