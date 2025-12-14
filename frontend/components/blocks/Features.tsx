import Image from 'next/image'

interface Feature {
  title: string
  description: string
  icon?: any
}

interface FeaturesProps {
  heading?: string
  featureList?: Feature[]
}

export default function Features({ heading, featureList }: FeaturesProps) {
  if (!featureList || featureList.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="text-4xl font-bold text-center mb-12">{heading}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              {feature.icon && (
                <div className="mb-4">
                  <Image
                    src={feature.icon.url}
                    alt={feature.icon.alt || feature.title}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



