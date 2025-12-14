import dotenv from 'dotenv'
import path from 'path'

// Only load .env file in development (Railway injects env vars in production)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env') })
}

import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import webpack from 'webpack'

import { Pages } from './collections/Pages'
import { Contacts } from './collections/Contacts'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  admin: {
    user: 'users',
    bundler: webpackBundler({
      webpack: (config: any) => {
        // Ignore Cloudinary completely during webpack build
        config.plugins = config.plugins || []
        config.plugins.push(
          new webpack.IgnorePlugin({
            checkResource: (resource: string) => {
              // Ignore cloudinary package and any file that imports it
              if (resource && (resource.includes('cloudinary') || resource === 'cloudinary')) {
                return true
              }
              return false
            },
          })
        )
        
        // Exclude Cloudinary and Node.js modules as externals (function form for better matching)
        const externals = config.externals || []
        const externalsArray = Array.isArray(externals) ? externals : [externals]
        
        // Add function-based external matching
        externalsArray.push(({ request }: { request: string }, callback: Function) => {
          if (request && (
            request === 'cloudinary' ||
            request.includes('cloudinary') ||
            request === 'fs' ||
            request === 'path'
          )) {
            return callback(null, `commonjs ${request}`)
          }
          callback()
        })
        
        config.externals = externalsArray
        
        // Add fallbacks for Node.js modules
        config.resolve = config.resolve || {}
        config.resolve.fallback = {
          ...(config.resolve.fallback || {}),
          fs: false,
          stream: false,
          url: false,
          querystring: false,
          path: false,
        }
        
        return config
      },
    }),
  },
  collections: [Users, Pages, Contacts, Media],
  editor: lexicalEditor({}),
  typescript: {
    outputFile: path.resolve(__dirname, '../payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  localization: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    fallback: true,
  },
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
    process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
  ],
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
    process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000',
  ],
})

