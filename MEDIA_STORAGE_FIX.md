# Media Storage Fix for Railway

## Problem

Images uploaded to PayloadCMS are not accessible on Railway because:
1. Railway's filesystem is **ephemeral** - files are lost when the container restarts or redeploys
2. Even though file metadata is saved in MongoDB, the actual image files are gone
3. Accessing image URLs returns `Cannot GET /media/...` errors

## Current Fix Applied

I've updated the code to:
1. Use absolute paths for the media directory
2. Explicitly serve static files via Express
3. Ensure the media directory is created on startup

However, **this is still not a permanent solution** because files will be lost on redeploy.

## Permanent Solution: Use Cloud Storage

For production on Railway, you should use cloud storage. Here are the recommended options:

### Option 1: Cloudflare R2 (Recommended - Free tier available)
### Option 2: AWS S3
### Option 3: Railway Volumes (Persistent storage)

## Quick Fix for Testing

If you need images to work immediately:

1. **Re-upload the images** after deploying the updated code
2. The images will work until the next redeploy
3. For permanent solution, implement cloud storage

## Testing the Fix

After deploying the updated code:

1. Check if media directory is created (check logs)
2. Upload a new image via admin panel
3. Verify the image URL works: `https://restroworks-production.up.railway.app/media/filename.jpg`
4. If it works, the static file serving is fixed
5. Remember: files will still be lost on redeploy without cloud storage

## Next Steps

To implement cloud storage, you'll need to:
1. Install a PayloadCMS storage adapter (e.g., `@payloadcms/storage-s3`)
2. Configure it in `Media.ts` collection
3. Set up cloud storage account (R2, S3, etc.)
4. Add environment variables for storage credentials

