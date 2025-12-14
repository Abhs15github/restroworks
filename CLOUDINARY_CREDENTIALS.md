# Your Cloudinary Credentials Setup

## ✅ Quick Setup

### For Local Development (`backend/.env`)

Add this single line:

```env
CLOUDINARY_URL=cloudinary://194122349287491:rpbnx05wnLsrSdHmUfUeS3WvY8g@djfnff2m2
```

### For Railway Production

1. Go to your Railway project dashboard
2. Select your backend service
3. Go to **Variables** tab
4. Click **+ New Variable**
5. Add:
   - **Name**: `CLOUDINARY_URL`
   - **Value**: `cloudinary://194122349287491:rpbnx05wnLsrSdHmUfUeS3WvY8g@djfnff2m2`
6. Save and redeploy

## 🧪 Test It

1. **Start your backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Upload an image**:
   - Go to `http://localhost:3001/admin`
   - Navigate to **Media** collection
   - Upload a test image
   - Check console logs - you should see:
     ```
     Uploading filename.jpg to Cloudinary...
     ✅ Successfully uploaded filename.jpg to Cloudinary
     ```

3. **Verify**:
   - Check the image URL in Media collection
   - Should be: `https://res.cloudinary.com/djfnff2m2/image/upload/...`
   - Open URL in browser to verify it loads

## 📝 What Happens

- ✅ Images automatically upload to Cloudinary after local save
- ✅ All image sizes (thumbnail, card, tablet) uploaded automatically
- ✅ URLs automatically updated to point to Cloudinary
- ✅ Files persist through Railway redeploys
- ✅ Fast global CDN delivery

## 🚀 Deploy to Production

After adding `CLOUDINARY_URL` to Railway:
1. Redeploy your backend
2. Upload new images - they'll automatically go to Cloudinary
3. Old images: Re-upload them to migrate to Cloudinary

That's it! Your media storage is now cloud-based! ☁️

