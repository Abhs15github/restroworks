const PAYLOAD_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3001'

export interface Page {
  id: string
  title: string
  slug: string
  seo?: {
    metaTitle?: string
    metaDescription?: string
    metaImage?: {
      url: string
      alt?: string
    }
  }
  blocks?: any[]
  status: 'draft' | 'published'
  updatedAt: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  message: string
}

export async function getPage(slug: string, locale: string = 'en'): Promise<Page | null> {
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/pages?where[slug][equals]=${slug}&where[status][equals]=published&locale=${locale}&depth=2`,
      {
        next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
      }
    )
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        submittedAt: new Date().toISOString(),
      }),
    })
    
    if (!res.ok) {
      throw new Error('Failed to submit contact form')
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error submitting contact form:', error)
    throw error
  }
}

export async function getAllPages(locale: string = 'en'): Promise<Page[]> {
  try {
    const res = await fetch(
      `${PAYLOAD_URL}/api/pages?where[status][equals]=published&locale=${locale}&limit=100&depth=1`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    )
    
    if (!res.ok) {
      return []
    }
    
    const data = await res.json()
    return data.docs || []
  } catch (error) {
    console.error('Error fetching pages:', error)
    return []
  }
}



