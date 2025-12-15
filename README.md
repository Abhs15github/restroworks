# RestroWorks

A full-stack restaurant website built with Next.js 14 and PayloadCMS.

## Live Demo

- **Website**: https://restroworks-phi.vercel.app
- **Admin Panel**: https://restroworks-production.up.railway.app/admin

## Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Deployed on Vercel

**Backend:**
- PayloadCMS 2.x
- MongoDB Atlas
- Express.js
- Deployed on Railway

## Features

- Multi-language support (English/Spanish)
- SEO optimized with dynamic metadata
- Responsive design
- Content management with blocks (Hero, Features, Testimonials, CTA)
- Contact form with backend integration
- Image optimization

## Local Development

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your MongoDB connection string
npm run dev
```

Backend runs on http://localhost:3001

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Configure .env.local with backend URL
npm run dev
```

Frontend runs on http://localhost:3000

## Environment Variables

**Backend (.env):**
```
DATABASE_URI=mongodb://localhost:27017/restroworks
PAYLOAD_SECRET=your-secret-key
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
PORT=3001
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Project Structure

```
├── backend/           # PayloadCMS backend
│   └── src/
│       ├── collections/   # CMS collections
│       ├── server.ts      # Express server
│       └── payload.config.ts
│
└── frontend/          # Next.js frontend
    ├── app/           # App router pages
    ├── components/    # React components
    └── lib/           # Utilities
```

## CMS Collections

- **Pages** - Dynamic pages with content blocks
- **Media** - Image library with automatic optimization
- **Contacts** - Form submissions
- **Users** - Admin authentication

## Deployment

**Frontend (Vercel):**
- Connect GitHub repository
- Set root directory to `frontend`
- Add environment variables
- Deploy

**Backend (Railway):**
- Connect GitHub repository
- Set root directory to `backend`
- Add environment variables
- Deploy

## License

MIT
