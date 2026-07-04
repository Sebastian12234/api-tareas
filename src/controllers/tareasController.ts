import pool from '../database'

// GET /tareas
export const obtenerTareas = async (req: any, res: any) => {
    console.log('🔍 Consultando PostgreSQL...')
  try {
    const resultado = await pool.query(`
      SELECT t.*, u.nombre as asignado_nombre 
      FROM tareas t
      LEFT JOIN usuarios u ON t.asignado_a = u.id
      ORDER BY t.created_at DESC
    `)
    res.json({ ok: true, datos: resultado.rows })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener tareas' })
  }
}

// GET /tareas/:id
export const obtenerTareaPorId = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const resultado = await pool.query(`
      SELECT t.*, u.nombre as asignado_nombre 
      FROM tareas t
      LEFT JOIN usuarios u ON t.asignado_a = u.id
      WHERE t.id = $1
    `, [id])
    if (resultado.rows.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Tarea no encontrada' })
    }
    res.json({ ok: true, datos: resultado.rows[0] })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener tarea' })
  }
}

// POST /tareas
export const crearTarea = async (req: any, res: any) => {
  try {
    const { titulo, descripcion, asignado_a, creado_por } = req.body
    if (!titulo || !asignado_a || !creado_por) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'titulo, asignado_a y creado_por son requeridos' 
      })
    }
    const resultado = await pool.query(`
      INSERT INTO tareas (titulo, descripcion, asignado_a, creado_por)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [titulo, descripcion, asignado_a, creado_por])
    res.status(201).json({ ok: true, datos: resultado.rows[0] })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al crear tarea' })
  }
}

// PATCH /tareas/:id/completar
export const completarTarea = async (req: any, res: any) => {
  try {
    const { id } = req.params
    const tarea = await pool.query('SELECT * FROM tareas WHERE id = $1', [id])
    if (tarea.rows.length === 0) {
      return res.status(404).json({ ok: false, mensaje: 'Tarea no encontrada' })
    }
    if (tarea.rows[0].estado === 'completada') {
      return res.status(400).json({ ok: false, mensaje: 'Esta tarea ya fue completada' })
    }
    const resultado = await pool.query(`
      UPDATE tareas 
      SET estado = 'completada', fecha_completada = NOW()
      WHERE id = $1
      RETURNING *
    `, [id])
    res.json({ ok: true, datos: resultado.rows[0] })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al completar tarea' })
  }
}

// GET /tareas/filtrar/:estado
export const filtrarTareas = async (req: any, res: any) => {
  try {
    const { estado } = req.params
    const resultado = await pool.query(`
      SELECT t.*, u.nombre as asignado_nombre 
      FROM tareas t
      LEFT JOIN usuarios u ON t.asignado_a = u.id
      WHERE t.estado = $1
    `, [estado])
    res.json({ ok: true, datos: resultado.rows, total: resultado.rows.length })
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al filtrar tareas' })
  }
}