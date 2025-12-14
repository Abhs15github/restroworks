require('dotenv').config()

import express from 'express'
import payload from 'payload'
import config from './payload.config'
import path from 'path'
import fs from 'fs'

const app = express()

// Add body parser middleware (PayloadCMS needs this)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const start = async () => {
  // Ensure media directory exists
  const mediaDir = path.resolve(__dirname, '../media')
  if (!fs.existsSync(mediaDir)) {
    fs.mkdirSync(mediaDir, { recursive: true })
    console.log(`Created media directory: ${mediaDir}`)
  }

  // Initialize Payload
  try {
    await payload.init({
      config,
      secret: process.env.PAYLOAD_SECRET!,
      express: app,
      onInit: async () => {
        payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
        payload.logger.info(`Server URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001'}`)
      },
    })
    console.log('✅ PayloadCMS initialized successfully')
  } catch (error) {
    console.error('❌ Error initializing PayloadCMS:', error)
    throw error
  }

  // Redirect root to admin (after PayloadCMS is initialized)
  app.get('/', (_, res) => {
    res.redirect('/admin')
  })

  // Explicitly serve static media files (backup in case PayloadCMS doesn't handle it)
  // This ensures /media/* routes are served correctly
  const staticMediaPath = path.resolve(__dirname, '../media')
  if (fs.existsSync(staticMediaPath)) {
    app.use('/media', express.static(staticMediaPath))
    console.log(`Serving static media from: ${staticMediaPath}`)
  }

  // Add your own express routes here

  const port = process.env.PORT || 3001

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
    console.log(`Payload Admin URL: http://localhost:${port}/admin`)
    console.log(`Media directory: ${mediaDir}`)
  })
}

start().catch((error) => {
  console.error('Error starting server:', error)
  process.exit(1)
})

