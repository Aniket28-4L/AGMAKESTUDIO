import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'archiveInMotion',
  title: 'Archive In Motion',
  type: 'document',
  fields: [
    defineField({
      name: 'reelTitle',
      title: 'Reel Title',
      type: 'string',
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
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
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
    }),
  ],
})
