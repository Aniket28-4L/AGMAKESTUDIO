import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'archive',
  title: 'Archive',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Alt Text',
      type: 'string',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrder',
      by: [
        { field: 'displayOrder', direction: 'asc' },
        { field: '_createdAt', direction: 'desc' },
      ],
    },
  ],
})