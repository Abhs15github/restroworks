import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface HeroProps {
  heading: string
  subheading?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: any
}

export default function Hero({
  heading,
  subheading,
  ctaText,
  ctaLink,
  backgroundImage,
}: HeroProps) {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {backgroundImage ? (
        <Image
          src={backgroundImage.url}
          alt={backgroundImage.alt || ''}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
      )}
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          {heading}
        </h1>
        {subheading && (
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            {subheading}
          </p>
        )}
        {ctaText && ctaLink && (
          <Button size="lg" asChild>
            <a href={ctaLink}>{ctaText}</a>
          </Button>
        )}
      </div>
    </section>
  )
}



