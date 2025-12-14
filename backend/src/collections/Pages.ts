import { CollectionConfig } from 'payload/types'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true, // Multi-language support
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        // Hero Block
        {
          slug: 'hero',
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'subheading',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'ctaText',
              type: 'text',
              localized: true,
            },
            {
              name: 'ctaLink',
              type: 'text',
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        // Features Block
        {
          slug: 'features',
          fields: [
            {
              name: 'heading',
              type: 'text',
              localized: true,
            },
            {
              name: 'featureList',
              type: 'array',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
        // Testimonials Block
        {
          slug: 'testimonials',
          fields: [
            {
              name: 'heading',
              type: 'text',
              localized: true,
            },
            {
              name: 'testimonialList',
              type: 'array',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'role',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'content',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'avatar',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'rating',
                  type: 'number',
                  min: 1,
                  max: 5,
                },
              ],
            },
          ],
        },
        // CTA Block
        {
          slug: 'cta',
          fields: [
            {
              name: 'heading',
              type: 'text',
              localized: true,
            },
            {
              name: 'description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'buttonText',
              type: 'text',
              localized: true,
            },
            {
              name: 'buttonLink',
              type: 'text',
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}



