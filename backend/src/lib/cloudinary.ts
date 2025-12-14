import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
// Cloudinary SDK automatically reads CLOUDINARY_URL if set
// Format: cloudinary://api_key:api_secret@cloud_name
// If CLOUDINARY_URL is not set, fall back to individual variables
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
  })
}
// If CLOUDINARY_URL is set, Cloudinary SDK will automatically use it

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  width?: number
  height?: number
  format?: string
  bytes?: number
}

/**
 * Upload a file to Cloudinary
 */
export async function uploadToCloudinary(
  filePath: string,
  folder?: string
): Promise<CloudinaryUploadResult> {
  const options: any = {
    resource_type: 'auto', // Automatically detect image, video, etc.
    folder: folder || 'restroworks', // Organize files in a folder
  }

  const result = await cloudinary.uploader.upload(filePath, options)
  
  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    url: result.url,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  }
}

/**
 * Upload a buffer to Cloudinary
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  filename: string,
  folder?: string
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: folder || 'restroworks',
        public_id: filename.replace(/\.[^/.]+$/, ''), // Remove extension
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            url: result.url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          })
        } else {
          reject(new Error('Upload failed: No result returned'))
        }
      }
    )

    uploadStream.end(buffer)
  })
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

/**
 * Get Cloudinary cloud name from environment
 */
function getCloudName(): string {
  if (process.env.CLOUDINARY_URL) {
    // Extract cloud name from URL: cloudinary://api_key:api_secret@cloud_name
    const match = process.env.CLOUDINARY_URL.match(/@([^/]+)/)
    if (match && match[1]) {
      return match[1]
    }
  }
  return process.env.CLOUDINARY_CLOUD_NAME || cloudinary.config().cloud_name || ''
}

/**
 * Generate optimized image URL with transformations
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number
    height?: number
    crop?: string
    quality?: string | number
    format?: string
  }
): string {
  const cloudName = getCloudName()
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`
  
  if (!transformations) {
    return `${baseUrl}/${publicId}`
  }

  const transformParts: string[] = []
  
  if (transformations.width || transformations.height) {
    const size = transformations.width 
      ? `w_${transformations.width}` 
      : `h_${transformations.height}`
    transformParts.push(size)
  }
  
  if (transformations.crop) {
    transformParts.push(`c_${transformations.crop}`)
  }
  
  if (transformations.quality) {
    transformParts.push(`q_${transformations.quality}`)
  }
  
  if (transformations.format) {
    transformParts.push(`f_${transformations.format}`)
  }

  const transforms = transformParts.length > 0 ? transformParts.join(',') + '/' : ''
  return `${baseUrl}/${transforms}${publicId}`
}

export { cloudinary }

