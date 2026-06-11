import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // Hero Section
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

    // Founder Section
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
  ],
})
