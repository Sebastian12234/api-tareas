import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Tareas',
      version: '1.0.0',
      description: 'API REST para gestionar tareas con autenticación JWT',
      contact: {
        name: 'Sebastian Urrego',
        email: 'urregogonzalezsebastian@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
}

export default swaggerJsdoc(options)