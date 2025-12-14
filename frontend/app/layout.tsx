import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Restroworks',
  description: 'Production-ready CMS-powered website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}



