import pool from '../database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123'

// POST /auth/registro
export const registro = async (req: any, res: any) => {
  try {
    const { nombre, email, password } = req.body

    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'nombre, email y password son requeridos' 
      })
    }

    // Verificar si el email ya existe
    const existe = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1', [email]
    )
    if (existe.rows.length > 0) {
      return res.status(400).json({ ok: false, mensaje: 'El email ya está registrado' })
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 10)

    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
      [nombre, email, passwordHash]
    )

    const usuario = resultado.rows[0]
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '24h' })

    res.status(201).json({ ok: true, token, usuario })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al registrar usuario' })
  }
}

// POST /auth/login
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ ok: false, mensaje: 'email y password son requeridos' })
    }

    // Buscar usuario
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1', [email]
    )
    if (resultado.rows.length === 0) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' })
    }

    const usuario = resultado.rows[0]

    // Verificar contraseña
    if (!usuario.password) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' })
    }

    const passwordValido = await bcrypt.compare(password, usuario.password)
    if (!passwordValido) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas' })
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, JWT_SECRET, { expiresIn: '24h' })

    res.json({ ok: true, token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al iniciar sesión' })
  }
}