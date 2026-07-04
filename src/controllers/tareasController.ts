// Base de datos temporal en memoria (luego conectamos PostgreSQL)
let tareas = [
  { id: 1, titulo: 'Diseñar base de datos', estado: 'pendiente', asignado: 'Sebastian' },
  { id: 2, titulo: 'Crear endpoints', estado: 'pendiente', asignado: 'Sebastian' },
  { id: 3, titulo: 'Documentar API', estado: 'completada', asignado: 'Sebastian' }
]

// GET /tareas - obtener todas las tareas
export const obtenerTareas = (req: any, res: any) => {
  res.json({ ok: true, datos: tareas })
}

// GET /tareas/:id - obtener una tarea por id
export const obtenerTareaPorId = (req: any, res: any) => {
  const tarea = tareas.find(t => t.id === parseInt(req.params.id))
  if (!tarea) {
    return res.status(404).json({ ok: false, mensaje: 'Tarea no encontrada' })
  }
  res.json({ ok: true, datos: tarea })
}

// POST /tareas - crear una tarea
export const crearTarea = (req: any, res: any) => {
  const { titulo, asignado } = req.body
  if (!titulo || !asignado) {
    return res.status(400).json({ ok: false, mensaje: 'titulo y asignado son requeridos' })
  }
  const nuevaTarea = {
    id: tareas.length + 1,
    titulo,
    estado: 'pendiente',
    asignado
  }
  tareas.push(nuevaTarea)
  res.status(201).json({ ok: true, datos: nuevaTarea })
}

// PATCH /tareas/:id/completar - marcar tarea como completada
export const completarTarea = (req: any, res: any) => {
  const tarea = tareas.find(t => t.id === parseInt(req.params.id))
  if (!tarea) {
    return res.status(404).json({ ok: false, mensaje: 'Tarea no encontrada' })
  }
  if (tarea.estado === 'completada') {
    return res.status(400).json({ ok: false, mensaje: 'Esta tarea ya fue completada' })
  }
  tarea.estado = 'completada'
  res.json({ ok: true, datos: tarea })
}

// GET /tareas/filtrar/:estado - filtrar por estado
export const filtrarTareas = (req: any, res: any) => {
  const { estado } = req.params
  const resultado = tareas.filter(t => t.estado === estado)
  res.json({ ok: true, datos: resultado, total: resultado.length })
}