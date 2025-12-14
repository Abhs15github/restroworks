// This file is server-only and should never be imported in collection files
// It's loaded dynamically via require() in hooks only

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
  })
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  width?: number
  height?: number
  format?: string
  bytes?: number
}

export async function uploadToCloudinary(
  filePath: string,
  folder?: string
): Promise<CloudinaryUploadResult> {
  const options: any = {
    resource_type: 'auto',
    folder: folder || 'restroworks',
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

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export { cloudinary }

