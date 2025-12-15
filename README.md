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

## CMS Modeling Explanation

### Pages Collection
The Pages collection is designed for flexible, dynamic content management:

- **Localized Fields**: Title and all content blocks support English and Spanish translations
- **Block-Based Architecture**: Uses a modular block system allowing editors to build pages by combining different content types (Hero, Features, Testimonials, CTA)
- **SEO Fields**: Dedicated meta title, description, and image fields for each page
- **Slug-based Routing**: Unique slugs enable clean URLs (e.g., `/home`, `/about`)
- **Draft/Published Workflow**: Content can be saved as draft before publishing

**Why Blocks?** This approach provides maximum flexibility - editors can reorder, add, or remove sections without developer intervention.

### Media Collection
Centralized media management with automatic image optimization:

- **Multiple Sizes**: Automatically generates thumbnail (400x300), card (768x1024), and tablet (1024x auto) variants
- **Required Alt Text**: Ensures accessibility compliance
- **Public Access**: Images are publicly accessible for frontend consumption

**Why This Approach?** Automatic image optimization reduces manual work and ensures consistent image quality across the site.

### Contacts Collection
Simple contact form submission storage:

- **Public Create Access**: Allows frontend form submissions without authentication
- **Email Validation**: Built-in validation for email fields
- **Timestamp Tracking**: Automatically records submission date/time

**Why Separate Collection?** Keeps form data organized and allows admin review without cluttering other collections.

### Users Collection
Standard admin authentication:

- **Email-based Login**: Secure authentication for admin panel access
- **Role Management**: Built-in support for future role expansion

## How to Create and Edit Pages

### Creating a New Page

1. **Access Admin Panel**
   - Navigate to https://restroworks-production.up.railway.app/admin
   - Login with your credentials

2. **Create Page**
   - Go to **Collections → Pages**
   - Click **Create New**
   - Fill in basic information:
     - **Title** (English): Enter page title
     - **Title** (Spanish): Switch to Spanish tab and enter translation
     - **Slug**: URL-friendly identifier (e.g., `home`, `about-us`)
     - **Status**: Select "Published" to make it live

3. **Add SEO Data**
   - Expand **SEO** section
   - Add **Meta Title** (both languages)
   - Add **Meta Description** (both languages)
   - Upload **Meta Image** (optional)

4. **Build Page Content with Blocks**

   Click **Add Block** and choose from:

   **a) Hero Block** - Main page banner
   - Heading (localized)
   - Subheading (localized)
   - CTA Text (localized)
   - CTA Link (e.g., `#contact`)
   - Background Image (upload or select from media)

   **b) Features Block** - Feature grid
   - Heading (localized)
   - Add Feature Items:
     - Title (localized)
     - Description (localized)
     - Icon (optional image)

   **c) Testimonials Block** - Customer reviews
   - Heading (localized)
   - Add Testimonials:
     - Name (localized)
     - Role (localized)
     - Content (localized)
     - Rating (1-5)
     - Avatar (optional image)

   **d) CTA Block** - Call to action
   - Heading (localized)
   - Description (localized)
   - Button Text (localized)
   - Button Link

5. **Save and Publish**
   - Click **Save** at the top
   - Ensure **Status** is set to "Published"

### Editing Existing Pages

1. Go to **Collections → Pages**
2. Click on the page you want to edit
3. Modify content:
   - Edit text fields directly
   - Reorder blocks by dragging
   - Add new blocks with **Add Block**
   - Remove blocks with the delete icon
4. Click **Save**

### Managing Content in Multiple Languages

1. Edit any page
2. Fill in English content
3. Click the **Language** dropdown (top right)
4. Select **Spanish**
5. Fill in Spanish translations
6. Save - both languages are stored in one page

### Tips for Content Management

- **Preview Before Publishing**: Set status to "Draft" while working
- **Reuse Media**: Upload images once in Media collection, reuse across pages
- **Consistent Slugs**: Use lowercase, hyphenated slugs (e.g., `our-menu`)
- **Mobile Preview**: Test content on different screen sizes
- **SEO Best Practices**: Keep meta descriptions under 160 characters

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
