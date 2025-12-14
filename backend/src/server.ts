require('dotenv').config()

import express from 'express'
import payload from 'payload'
import config from './payload.config'

const app = express()

// Redirect root to admin
app.get('/', (_, res) => {
  res.redirect('/admin')
})

const start = async () => {
  // Initialize Payload
  await payload.init({
    config,
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  // Add your own express routes here

  const port = process.env.PORT || 3001

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    console.log(`Payload Admin URL: http://localhost:${port}/admin`)
  })
}

start().catch((error) => {
  console.error('Error starting server:', error)
  process.exit(1)
})

