# Cloudinary Setup Guide for RestroWorks

This guide will help you set up Cloudinary for storing and serving media files in production.

## Why Cloudinary?

- ✅ **Free Tier**: 25GB storage, 25GB bandwidth/month
- ✅ **Easy Setup**: Simple API, no complex configuration
- ✅ **Image Optimization**: Automatic resizing, format conversion, and optimization
- ✅ **CDN**: Fast global delivery
- ✅ **Works with PayloadCMS 2.x**: No version conflicts

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account (no credit card required)
3. Verify your email address

## Step 2: Get Your Cloudinary Credentials

1. After logging in, go to your **Dashboard**
2. You'll see your account details:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

⚠️ **Important**: Keep your API Secret secure! Never commit it to version control.

## Step 3: Add Environment Variables

### For Local Development

Add these to your `backend/.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### For Railway (Production)

1. Go to your Railway project dashboard
2. Select your backend service
3. Go to **Variables** tab
4. Add these environment variables:
   - `CLOUDINARY_CLOUD_NAME` = Your cloud name
   - `CLOUDINARY_API_KEY` = Your API key
   - `CLOUDINARY_API_SECRET` = Your API secret

## Step 4: How It Works

Once configured, the system will:

1. **Upload Flow**:
   - User uploads an image via PayloadCMS admin
   - File is temporarily saved locally
   - Automatically uploaded to Cloudinary
   - URL is updated to point to Cloudinary
   - Local file can be kept or removed (optional)

2. **Image Sizes**:
   - Thumbnail (400x300)
   - Card (768x1024)
   - Tablet (1024x647)
   - All sizes are automatically uploaded to Cloudinary

3. **Deletion**:
   - When you delete media in PayloadCMS
   - It's automatically deleted from Cloudinary too

## Step 5: Testing

1. **Start your backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Upload an image**:
   - Go to `http://localhost:3001/admin`
   - Navigate to **Media** collection
   - Upload a test image
   - Check the console logs - you should see:
     ```
     Uploading filename.jpg to Cloudinary...
     ✅ Successfully uploaded filename.jpg to Cloudinary
     ```

3. **Verify**:
   - Check the image URL in the Media collection
   - It should point to `res.cloudinary.com` instead of local `/media`
   - Open the URL in a browser to verify it loads

## Step 6: Deploy to Production

1. **Add environment variables to Railway** (as described in Step 3)
2. **Redeploy your backend**
3. **Upload new images** - they'll automatically go to Cloudinary
4. **Existing images**: You may need to re-upload them, or they'll continue using local storage until re-uploaded

## Troubleshooting

### Images not uploading to Cloudinary?

1. **Check environment variables**:
   ```bash
   # In your backend, verify they're set
   echo $CLOUDINARY_CLOUD_NAME
   ```

2. **Check console logs** for error messages

3. **Verify credentials** in Cloudinary dashboard

### Images still showing local URLs?

- New uploads will use Cloudinary
- Old images may still have local URLs
- Re-upload them to migrate to Cloudinary

### Free tier limits?

- **Storage**: 25GB (plenty for most projects)
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month

If you exceed limits, Cloudinary will notify you. You can upgrade to a paid plan if needed.

## Benefits

✅ **No more lost files on Railway redeploys**
✅ **Fast global CDN delivery**
✅ **Automatic image optimization**
✅ **Scalable storage**
✅ **Easy to manage via Cloudinary dashboard**

## Next Steps

1. Set up your Cloudinary account
2. Add environment variables
3. Test locally
4. Deploy to production
5. Enjoy persistent, fast media storage! 🎉

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Cloudinary Free Tier Details](https://cloudinary.com/pricing)

