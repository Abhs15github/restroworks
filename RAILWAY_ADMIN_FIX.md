# Fix Admin Panel "Cannot GET /admin/login" Error

## Issue
The admin panel is showing "Cannot GET /admin/login" error, which means the admin routes aren't being served correctly.

## Solution

### Step 1: Verify Environment Variables in Railway

Go to your Railway project → Variables tab and ensure these are set:

1. **PAYLOAD_PUBLIC_SERVER_URL** (CRITICAL)
   - Value: `https://restroworks-production.up.railway.app`
   - This MUST match your Railway URL exactly (with https://)
   - Without this, the admin panel won't build correctly

2. **PAYLOAD_SECRET**
   - Should be set (any random string)

3. **DATABASE_URI**
   - Your MongoDB connection string

4. **PORT**
   - Usually Railway sets this automatically, but can be `3001`

5. **CLOUDINARY_URL** (optional, for media storage)
   - `cloudinary://194122349287491:rpbnx05wnLsrSdHmUfUeS3WvY8g@djfnff2m2`

### Step 2: Redeploy

After setting/updating `PAYLOAD_PUBLIC_SERVER_URL`:
1. Save the environment variable
2. Railway will automatically redeploy
3. Wait for the build to complete

### Step 3: Verify Build

Check the build logs to ensure:
- `payload build` completes successfully
- No errors about admin panel build
- Server starts without errors

### Step 4: Test

1. Go to: `https://restroworks-production.up.railway.app/admin`
2. Should redirect to `/admin/login` automatically
3. You should see the login page

## Common Issues

### Issue: Admin still not working after setting PAYLOAD_PUBLIC_SERVER_URL
**Solution**: 
- Make sure the URL is exactly `https://restroworks-production.up.railway.app` (no trailing slash)
- Redeploy after changing the variable
- Check build logs for any errors

### Issue: Build fails
**Solution**:
- Check that all dependencies are installed
- Verify `payload build` completes in the logs
- Ensure TypeScript compilation succeeds

### Issue: Routes not found
**Solution**:
- Ensure PayloadCMS initializes successfully (check server logs)
- Verify the admin build output exists
- Check that middleware is set up correctly

## Verification

After fixing, you should see in the server logs:
```
✅ PayloadCMS initialized successfully
Payload Admin URL: https://restroworks-production.up.railway.app/admin
```

Then `/admin` and `/admin/login` should work correctly.

