import Hero from './Hero'
import Features from './Features'
import Testimonials from './Testimonials'
import CTA from './CTA'

interface BlockRendererProps {
  blocks: any[]
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'hero':
            return <Hero key={index} {...block} />
          case 'features':
            return <Features key={index} {...block} />
          case 'testimonials':
            return <Testimonials key={index} {...block} />
          case 'cta':
            return <CTA key={index} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}



