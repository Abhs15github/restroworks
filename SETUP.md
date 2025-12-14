# Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB running (local or Atlas)

## Step 1: Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secret key
npm run dev
```

The PayloadCMS admin will be available at http://localhost:3001/admin

## Step 2: Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your PayloadCMS URL
npm run dev
```

The website will be available at http://localhost:3000/en

## Step 3: Create Your First Page

1. Go to http://localhost:3001/admin
2. Create a new admin user
3. Navigate to Pages collection
4. Create a new page with:
   - Title: "Home"
   - Slug: "home"
   - Status: "Published"
   - Add content blocks (Hero, Features, etc.)

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check your Atlas connection string
- Verify DATABASE_URI in backend/.env

### Port Already in Use
- Change PORT in backend/.env (default: 3001)
- Update NEXT_PUBLIC_PAYLOAD_URL in frontend/.env.local accordingly

### CORS Errors
- Ensure PAYLOAD_PUBLIC_SERVER_URL and NEXT_PUBLIC_PAYLOAD_URL are correctly set
- Check cors configuration in backend/src/payload.config.ts



