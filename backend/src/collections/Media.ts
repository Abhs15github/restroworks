import { CollectionConfig } from 'payload/types'
import path from 'path'
import fs from 'fs'
// Cloudinary is imported dynamically in hooks to avoid webpack bundling issues

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: path.resolve(__dirname, '../../media'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'cloudinaryPublicId',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Cloudinary public ID (auto-generated)',
      },
    },
    {
      name: 'cloudinaryUrl',
      type: 'text',
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Cloudinary URL (auto-generated)',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Only upload to Cloudinary if Cloudinary is configured
        if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
          return doc
        }

        // Skip if already uploaded to Cloudinary
        if (doc.cloudinaryUrl) {
          return doc
        }

        try {
          // Get the file path
          const filePath = path.resolve(__dirname, '../../media', doc.filename)
          
          // Check if file exists
          if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`)
            return doc
          }

          // Upload to Cloudinary (use dynamic require to avoid webpack bundling)
          console.log(`Uploading ${doc.filename} to Cloudinary...`)
          // Use dynamic require that webpack can't analyze
          const cloudinaryLib = eval('require')(path.join(__dirname, '../server-only/cloudinary'))
          const cloudinaryResult = await cloudinaryLib.uploadToCloudinary(filePath, 'restroworks')

          // Update the document with Cloudinary info
          await req.payload.update({
            collection: 'media',
            id: doc.id,
            data: {
              cloudinaryPublicId: cloudinaryResult.public_id,
              cloudinaryUrl: cloudinaryResult.secure_url,
              url: cloudinaryResult.secure_url, // Update main URL to Cloudinary
            },
          })

          // Update sizes URLs to use Cloudinary
          if (doc.sizes) {
            const updatedSizes: any = {}
            
            for (const [sizeName, sizeData] of Object.entries(doc.sizes)) {
              if (sizeData && typeof sizeData === 'object' && 'filename' in sizeData) {
                const sizeFile = sizeData as any
                const sizePath = path.resolve(__dirname, '../../media', sizeFile.filename)
                
                if (fs.existsSync(sizePath)) {
                  // Upload size variant to Cloudinary
                  const cloudinaryLib = eval('require')(path.join(__dirname, '../server-only/cloudinary'))
                  const sizeResult = await cloudinaryLib.uploadToCloudinary(sizePath, 'restroworks')
                  
                  updatedSizes[sizeName] = {
                    ...sizeFile,
                    url: sizeResult.secure_url,
                    cloudinaryPublicId: sizeResult.public_id,
                  }
                }
              }
            }

            // Update document with size URLs
            if (Object.keys(updatedSizes).length > 0) {
              await req.payload.update({
                collection: 'media',
                id: doc.id,
                data: {
                  sizes: updatedSizes,
                },
              })
            }
          }

          console.log(`✅ Successfully uploaded ${doc.filename} to Cloudinary`)
        } catch (error) {
          console.error(`❌ Error uploading to Cloudinary:`, error)
          // Don't fail the operation, just log the error
        }

        return doc
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        // Only delete from Cloudinary if configured
        if (!process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_CLOUD_NAME) {
          return
        }

        try {
          // Get the document to find Cloudinary public ID
          const doc = await req.payload.findByID({
            collection: 'media',
            id,
          })

          if (doc.cloudinaryPublicId && typeof doc.cloudinaryPublicId === 'string') {
            console.log(`Deleting ${doc.cloudinaryPublicId} from Cloudinary...`)
            const cloudinaryLib = eval('require')(path.join(__dirname, '../server-only/cloudinary'))
            await cloudinaryLib.deleteFromCloudinary(doc.cloudinaryPublicId)
            console.log(`✅ Successfully deleted from Cloudinary`)
          }

          // Also delete size variants if they exist
          if (doc.sizes) {
            const cloudinaryLib = eval('require')(path.join(__dirname, '../server-only/cloudinary'))
            for (const [sizeName, sizeData] of Object.entries(doc.sizes)) {
              if (sizeData && typeof sizeData === 'object' && 'cloudinaryPublicId' in sizeData) {
                const sizeDataObj = sizeData as any
                if (sizeDataObj.cloudinaryPublicId && typeof sizeDataObj.cloudinaryPublicId === 'string') {
                  try {
                    await cloudinaryLib.deleteFromCloudinary(sizeDataObj.cloudinaryPublicId)
                  } catch (error) {
                    console.error(`Error deleting size variant ${sizeName}:`, error)
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error(`❌ Error deleting from Cloudinary:`, error)
          // Don't fail the operation, just log the error
        }
      },
    ],
  },
}



