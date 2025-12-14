# Cloudinary Quick Start

## ✅ What's Been Set Up

1. ✅ Cloudinary package installed
2. ✅ Media collection updated with Cloudinary hooks
3. ✅ Automatic upload to Cloudinary after local save
4. ✅ Automatic deletion from Cloudinary when media is removed
5. ✅ All image sizes (thumbnail, card, tablet) uploaded to Cloudinary

## 🚀 Quick Setup (3 Steps)

### 1. Get Cloudinary Credentials

Sign up at [cloudinary.com](https://cloudinary.com/users/register/free) (free, no credit card)

Get these 3 values from your dashboard:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 2. Add to Environment Variables

**Local (`backend/.env`):**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Railway (Production):**
- Go to your Railway project → Variables
- Add the 3 environment variables above

### 3. Test It!

```bash
cd backend
npm run dev
```

1. Go to `http://localhost:3001/admin`
2. Upload an image in Media collection
3. Check console - should see: `✅ Successfully uploaded to Cloudinary`
4. Check image URL - should be `res.cloudinary.com/...`

## 📝 How It Works

- **Upload**: File → Local temp → Cloudinary → URL updated
- **Delete**: PayloadCMS delete → Cloudinary delete (automatic)
- **Sizes**: All variants (thumbnail, card, tablet) uploaded automatically

## 🎯 Benefits

- ✅ Files persist through Railway redeploys
- ✅ Fast CDN delivery worldwide
- ✅ Free tier: 25GB storage, 25GB bandwidth/month
- ✅ Automatic image optimization

## 🔧 Troubleshooting

**Not uploading?**
- Check environment variables are set
- Check console for errors
- Verify credentials in Cloudinary dashboard

**Old images still local?**
- Re-upload them to migrate to Cloudinary
- New uploads automatically go to Cloudinary

That's it! Your media is now stored in the cloud! ☁️

