'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/lib/i18n'

export default function Header() {
  const params = useParams()
  const pathname = usePathname()
  const currentLocale = (params?.lang as Locale) || 'en'

  const switchLocale = (newLocale: Locale) => {
    if (!pathname) return `/${newLocale}`
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    return newPath
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href={`/${currentLocale}`} className="text-2xl font-bold">
          Restroworks
        </Link>

        <nav className="flex items-center gap-6">
          <Link href={`/${currentLocale}`} className="hover:underline">
            Home
          </Link>
          <Link href={`/${currentLocale}/contact`} className="hover:underline">
            Contact
          </Link>

          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-sm uppercase">{currentLocale}</span>
            <div className="flex gap-1">
              {locales.map((locale) => (
                <Link
                  key={locale}
                  href={switchLocale(locale)}
                  className={`text-sm uppercase hover:underline ${
                    locale === currentLocale ? 'font-bold' : ''
                  }`}
                >
                  {locale}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}



