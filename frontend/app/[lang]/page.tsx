import { Metadata } from 'next'
import { getPage } from '@/lib/payload'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { notFound } from 'next/navigation'
import { type Locale } from '@/lib/i18n'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const page = await getPage('home', lang)

  return {
    title: page?.seo?.metaTitle || page?.title || 'Restroworks',
    description: page?.seo?.metaDescription || 'Production-ready CMS-powered website',
    openGraph: {
      title: page?.seo?.metaTitle || page?.title || 'Restroworks',
      description: page?.seo?.metaDescription || 'Production-ready CMS-powered website',
      images: page?.seo?.metaImage?.url ? [page.seo.metaImage.url] : [],
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const page = await getPage('home', lang)

  if (!page) {
    notFound()
  }

  return (
    <div>
      {page.blocks && <BlockRenderer blocks={page.blocks} />}
    </div>
  )
}



