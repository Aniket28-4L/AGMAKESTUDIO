import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'offering',
  title: 'Offering',
  type: 'document',
  fields: [
    defineField({
      name: 'number',
      title: 'Number',
      type: 'number',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'image',
      title: 'Image',
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
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
    }),
  ],
})
