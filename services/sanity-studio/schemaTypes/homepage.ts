import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // Hero Section
    defineField({
      name: 'heroEyebrow',
      title: 'Hero Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Video',
      type: 'url',
    }),
    defineField({
      name: 'heroPosterImage',
      title: 'Hero Poster Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
    defineField({
      name: 'primaryCta',
      title: 'Primary CTA',
      type: 'string',
    }),
    defineField({
      name: 'secondaryCta',
      title: 'Secondary CTA',
      type: 'string',
    }),

    // Portfolio Section
    defineField({
      name: 'portfolioEyebrow',
      title: 'Portfolio Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'portfolioTitle',
      title: 'Portfolio Title',
      type: 'string',
    }),
    defineField({
      name: 'portfolioSubtitle',
      title: 'Portfolio Subtitle',
      type: 'text',
    }),

    // Founder Section
    defineField({
      name: 'founderEyebrow',
      title: 'Founder Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'founderName',
      title: 'Founder Name',
      type: 'string',
    }),
    defineField({
      name: 'founderImage',
      title: 'Founder Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text',
        },
      ],
    }),
    defineField({
      name: 'founderBiography',
      title: 'Founder Biography',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'founderStatistics',
      title: 'Founder Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'statistic',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
            }),
          ],
        },
      ],
    }),

    // Before & After Section
    defineField({
      name: 'beforeAfterEyebrow',
      title: 'Before & After Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'beforeAfterSubtitle',
      title: 'Before & After Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'beforeAfterQuote',
      title: 'Before & After Quote',
      type: 'text',
    }),

    // Bridal Moment Section
    defineField({
      name: 'bridalMomentEyebrow',
      title: 'Bridal Moment Eyebrow',
      type: 'string',
    }),

    // Collections Section
    defineField({
      name: 'collectionsEyebrow',
      title: 'Collections Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'collectionsTitle',
      title: 'Collections Title',
      type: 'string',
    }),

    // Awards Section
    defineField({
      name: 'awardsEyebrow',
      title: 'Awards Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'awardsTitle',
      title: 'Awards Title',
      type: 'string',
    }),
    defineField({
      name: 'awardsQuote',
      title: 'Awards Quote',
      type: 'text',
    }),
    defineField({
      name: 'awardsTrustIndicators',
      title: 'Awards Trust Indicators',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'trustIndicator',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  { title: 'Trophy', value: 'trophy' },
                  { title: 'Users', value: 'users' },
                  { title: 'Globe', value: 'globe' },
                  { title: 'Star', value: 'star' },
                  { title: 'Gem', value: 'gem' },
                ],
              },
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
            }),
          ],
        },
      ],
    }),

    // Archive In Motion Section
    defineField({
      name: 'archiveInMotionEyebrow',
      title: 'Archive In Motion Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'archiveInMotionCaption',
      title: 'Archive In Motion Caption',
      type: 'string',
    }),

    // Testimonials Section
    defineField({
      name: 'testimonialsBrandStrip',
      title: 'Testimonials Brand Strip',
      type: 'array',
      of: [{ type: 'string' }],
    }),

    // Atelier Section
    defineField({
      name: 'atelierContent',
      title: 'Atelier Content',
      type: 'object',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'string',
        }),
        defineField({
          name: 'quote',
          title: 'Quote',
          type: 'text',
        }),
        defineField({
          name: 'brands',
          title: 'Brands',
          type: 'array',
          of: [{ type: 'string' }],
        }),
        defineField({
          name: 'footerText',
          title: 'Footer Text',
          type: 'string',
        }),
      ],
    }),

    // Booking Form Section
    defineField({
      name: 'bookingFormEyebrow',
      title: 'Booking Form Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'bookingFormTitle',
      title: 'Booking Form Title',
      type: 'string',
    }),
    defineField({
      name: 'bookingFormSubtitle',
      title: 'Booking Form Subtitle',
      type: 'text',
    }),

    // WhatsApp Floating Button
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
    }),
  ],
})
