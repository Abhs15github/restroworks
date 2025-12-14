# RESTROWORKS Full-Stack Assignment

A production-ready CMS-powered website built with Next.js 14+ (App Router) and PayloadCMS 2.x as a headless backend.

## 🚀 Tech Stack

- **Frontend**: Next.js 14+ (App Router, TypeScript)
- **Backend**: PayloadCMS 2.x
- **Database**: MongoDB (local or Atlas)
- **Styling**: TailwindCSS + Custom UI Components
- **Image Optimization**: Next.js Image component
- **Internationalization**: Built-in i18n support (English & Spanish)

## 📁 Project Structure

```
restroworks/
├── backend/                 # PayloadCMS Backend
│   ├── src/
│   │   ├── collections/     # CMS Collections
│   │   │   ├── Pages.ts     # Pages with content blocks
│   │   │   ├── Contacts.ts  # Contact form submissions
│   │   │   ├── Media.ts     # Media library
│   │   │   └── Users.ts     # Admin users
│   │   ├── payload.config.ts
│   │   └── server.ts
│   └── package.json
│
└── frontend/                # Next.js Frontend
    ├── app/
    │   ├── [lang]/          # Internationalization routes
    │   │   ├── page.tsx     # Homepage
    │   │   ├── contact/
    │   │   │   └── page.tsx # Contact page
    │   │   └── layout.tsx   # Shared layout
    │   ├── sitemap.ts       # Dynamic sitemap
    │   └── robots.ts        # Robots.txt
    ├── components/
    │   ├── blocks/          # CMS content blocks
    │   │   ├── Hero.tsx
    │   │   ├── Features.tsx
    │   │   ├── Testimonials.tsx
    │   │   └── CTA.tsx
    │   ├── layout/
    │   │   ├── Header.tsx
    │   │   └── Footer.tsx
    │   └── ui/              # Reusable UI components
    └── lib/
        ├── payload.ts       # Payload API client
        └── i18n.ts          # Internationalization config
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- npm or yarn package manager

### Backend Setup (PayloadCMS)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   Edit `.env` file with your configuration:
   ```env
   DATABASE_URI=mongodb://localhost:27017/restroworks
   PAYLOAD_SECRET=your-secret-key-here-change-in-production
   PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
   PORT=3001
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Access PayloadCMS Admin:**
   - Open http://localhost:3001/admin
   - Create your first admin user
   - Start creating content!

### Frontend Setup (Next.js)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure environment variables:**
   Edit `.env.local` file:
   ```env
   NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3001
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Access the website:**
   - Open http://localhost:3000/en (English)
   - Open http://localhost:3000/es (Spanish)

## 📝 Creating Content in CMS

### Creating a Home Page

1. Log in to PayloadCMS Admin (http://localhost:3001/admin)
2. Navigate to **Pages** collection
3. Click **Create New**
4. Fill in:
   - **Title**: "Home" (localized for both English and Spanish)
   - **Slug**: "home"
   - **Status**: "Published"
   - **SEO**: Add meta title, description, and image
   - **Blocks**: Add content blocks:
     - **Hero Block**: Main banner with heading, subheading, CTA
     - **Features Block**: List of features with icons
     - **Testimonials Block**: Customer testimonials with ratings
     - **CTA Block**: Call-to-action section

### Content Blocks Available

1. **Hero Block**
   - Heading (localized)
   - Subheading (localized)
   - CTA Text & Link
   - Background Image

2. **Features Block**
   - Heading (localized)
   - Feature List (title, description, icon)

3. **Testimonials Block**
   - Heading (localized)
   - Testimonial List (name, role, content, avatar, rating)

4. **CTA Block**
   - Heading (localized)
   - Description (localized)
   - Button Text & Link

### Managing Media

1. Navigate to **Media** collection
2. Upload images (automatically optimized)
3. Add alt text for accessibility
4. Use uploaded media in content blocks

## 🌍 Internationalization

The website supports multiple languages (English and Spanish by default).

- **URL Structure**: `/{lang}/page-slug`
- **Language Switcher**: Available in the header
- **Localized Content**: All content blocks support localization
- **SEO**: Metadata is localized per language

To add more languages:
1. Update `locales` array in `backend/src/payload.config.ts`
2. Update `locales` array in `frontend/lib/i18n.ts`

## 🚀 Deployment

### Deploy PayloadCMS Backend

**Option 1: Railway**
1. Connect your GitHub repository
2. Select the `backend` directory
3. Set environment variables
4. Deploy

**Option 2: Render**
1. Create a new Web Service
2. Connect your repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Configure environment variables

### Deploy Next.js Frontend

**Vercel (Recommended)**
1. Connect your GitHub repository
2. Select the `frontend` directory
3. Set environment variables:
   - `NEXT_PUBLIC_PAYLOAD_URL`: Your deployed PayloadCMS URL
   - `NEXT_PUBLIC_SITE_URL`: Your deployed frontend URL
4. Deploy

**Build Command**: `npm run build`
**Output Directory**: `.next`

## 🔧 Environment Variables

### Backend (.env)
- `DATABASE_URI`: MongoDB connection string
- `PAYLOAD_SECRET`: Secret key for PayloadCMS (generate a strong random string)
- `PAYLOAD_PUBLIC_SERVER_URL`: Public URL of your PayloadCMS instance
- `PORT`: Server port (default: 3001)

### Frontend (.env.local)
- `NEXT_PUBLIC_PAYLOAD_URL`: URL of your PayloadCMS backend
- `NEXT_PUBLIC_SITE_URL`: Public URL of your frontend (for sitemap)

## 📊 CMS Modeling Explanation

### Pages Collection
- **Purpose**: Dynamic page content management
- **Key Features**:
  - Localized fields (title, SEO, blocks)
  - Flexible block-based content system
  - Draft/Published workflow
  - SEO metadata per page

### Contacts Collection
- **Purpose**: Store contact form submissions
- **Key Features**:
  - Public create access (for form submissions)
  - Automatic timestamp
  - Email validation

### Media Collection
- **Purpose**: Centralized media library
- **Key Features**:
  - Automatic image optimization (thumbnail, card, tablet sizes)
  - Alt text requirement for accessibility
  - Public read access

### Users Collection
- **Purpose**: Admin user management
- **Key Features**:
  - Authentication enabled
  - Email-based login

## 🎨 Design Decisions

1. **Block-Based Architecture**: Flexible content management with reusable blocks
2. **ISR (Incremental Static Regeneration)**: Pages revalidate every 60 seconds for optimal performance
3. **Type Safety**: Full TypeScript support with generated Payload types
4. **Responsive Design**: Mobile-first approach with TailwindCSS
5. **Accessibility**: Semantic HTML, alt text requirements, keyboard navigation
6. **SEO Optimization**: Dynamic metadata, sitemap, and robots.txt

## 🧪 Testing Checklist

- [x] All pages load correctly in both languages
- [x] Language switcher works seamlessly
- [x] Contact form submits to PayloadCMS
- [x] Responsive on mobile, tablet, desktop
- [x] Images are optimized and have alt text
- [x] SEO metadata is present on all pages
- [x] Sitemap.xml is accessible
- [x] No console errors
- [x] Fast page load times

## 📚 Additional Resources

- [PayloadCMS Documentation](https://payloadcms.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is part of a technical assignment for Restroworks.

---

**Built with ❤️ using Next.js and PayloadCMS**



