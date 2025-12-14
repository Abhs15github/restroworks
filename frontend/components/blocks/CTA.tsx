import { Button } from '@/components/ui/button'

interface CTAProps {
  heading?: string
  description?: string
  buttonText?: string
  buttonLink?: string
}

export default function CTA({
  heading,
  description,
  buttonText,
  buttonLink,
}: CTAProps) {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        {heading && (
          <h2 className="text-4xl font-bold mb-4">{heading}</h2>
        )}
        {description && (
          <p className="text-xl mb-8 max-w-2xl mx-auto">{description}</p>
        )}
        {buttonText && buttonLink && (
          <Button size="lg" variant="secondary" asChild>
            <a href={buttonLink}>{buttonText}</a>
          </Button>
        )}
      </div>
    </section>
  )
}



