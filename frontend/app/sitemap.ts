import { getAllPages } from '@/lib/payload'
import { locales } from '@/lib/i18n'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'

  const routes: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    const pages = await getAllPages(locale)

    pages.forEach((page) => {
      const slug = page.slug === 'home' ? '' : page.slug
      routes.push({
        url: `${baseUrl}/${locale}${slug ? `/${slug}` : ''}`,
        lastModified: new Date(page.updatedAt),
        changeFrequency: 'weekly',
        priority: page.slug === 'home' ? 1.0 : 0.8,
      })
    })
  }

  return routes
}



