import Image from 'next/image'

interface Testimonial {
  name: string
  role: string
  content: string
  avatar?: any
  rating?: number
}

interface TestimonialsProps {
  heading?: string
  testimonialList?: Testimonial[]
}

export default function Testimonials({
  heading,
  testimonialList,
}: TestimonialsProps) {
  if (!testimonialList || testimonialList.length === 0) {
    return null
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="text-4xl font-bold text-center mb-12">{heading}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialList.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
            >
              {testimonial.rating && (
                <div className="mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              )}
              <p className="text-gray-700 mb-4 italic">&quot;{testimonial.content}&quot;</p>
              <div className="flex items-center gap-4">
                {testimonial.avatar && (
                  <Image
                    src={testimonial.avatar.url}
                    alt={testimonial.avatar.alt || testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



