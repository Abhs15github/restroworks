# Content Seeding Guide

This guide explains how to automatically populate your RestroWorks site with sample content including images and all content blocks.

## What the Script Does

The `seed-content.js` script will:

✅ Login to your PayloadCMS admin
✅ Download and upload a professional restaurant image from Unsplash
✅ Create a homepage with:
  - Hero block with background image
  - Features block with 4 feature items
  - Testimonials block with 3 testimonials
  - CTA block
✅ Add content in both English and Spanish
✅ Set the page status to "Published"
✅ **Check for existing content** - won't create duplicates

## Prerequisites

1. You must have already created an admin user in PayloadCMS
2. Know your admin email and password

## Usage

### For Production (Railway):

```bash
node seed-content.js https://restroworks-production.up.railway.app your-email@example.com your-password
```

### For Local Testing:

```bash
# Make sure your backend is running on port 3001
node seed-content.js http://localhost:3001 your-email@example.com your-password
```

## Expected Output

```
🚀 Starting RestroWorks Content Seeder

📍 Target: https://restroworks-production.up.railway.app

🔐 Logging in...
✅ Login successful

🖼️  Uploading sample images...

📥 Downloading image: restaurant-interior.jpg...
📤 Uploading restaurant-interior.jpg to PayloadCMS...
✅ Uploaded restaurant-interior.jpg (ID: 67...)

🔍 Checking for existing home page...
✅ No existing home page found

📝 Creating homepage with sample content...
✅ Homepage created successfully (ID: 67...)

✨ Content seeding completed successfully!

📋 Summary:
   - Uploaded 1 hero image
   - Created homepage with 4 content blocks
   - Added bilingual content (English & Spanish)
   - Status: Published

🌐 View your site:
   - Frontend: https://restroworks-phi.vercel.app
   - Admin: https://restroworks-production.up.railway.app/admin
```

## After Running the Script

1. **View the admin panel** to see the created content:
   - Go to `https://restroworks-production.up.railway.app/admin`
   - Navigate to Collections → Pages
   - You'll see the "Home" page with all blocks populated

2. **View the live site**:
   - Go to `https://restroworks-phi.vercel.app`
   - The page may be cached for up to 60 seconds
   - Wait ~60 seconds or redeploy on Vercel to see the new content immediately

## Safety Features

- ✅ **No duplicates**: The script checks if a home page already exists before creating
- ✅ **No deletions**: The script only creates content, never deletes
- ✅ **Existing content safe**: Won't affect any manually created pages or content

## Troubleshooting

### Error: "Missing credentials"
Make sure you provide both email and password:
```bash
node seed-content.js <url> <email> <password>
```

### Error: "Login failed"
- Check that your email and password are correct
- Make sure you've created an admin user in PayloadCMS first

### Error: "Home page already exists"
This is not an error! The script is protecting your existing content. If you want to recreate the page:
1. Go to the admin panel
2. Delete the existing "Home" page
3. Run the script again

### Images not showing on frontend
This is usually a caching issue:
1. Wait 60 seconds for the cache to expire, OR
2. Go to Vercel and click "Redeploy" to clear the cache

## Manual Alternative

If you prefer to create content manually, use the `homepage-content.json` file as a reference for the structure and content to add through the admin panel.
