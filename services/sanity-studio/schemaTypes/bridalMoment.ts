import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'bridalMoment',
  title: 'Bridal Moment',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(4).max(4),
    }),
    defineField({
      name: 'verses',
      title: 'Verses',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'verse',
          fields: [
            defineField({
              name: 'verseNumber',
              title: 'Verse Number',
              type: 'string',
            }),
            defineField({
              name: 'verseTitle',
              title: 'Verse Title',
              type: 'string',
            }),
            defineField({
              name: 'verseLines',
              title: 'Verse Lines',
              type: 'array',
              of: [{ type: 'string' }],
            }),
          ],
        },
      ],
    }),
  ],
})
