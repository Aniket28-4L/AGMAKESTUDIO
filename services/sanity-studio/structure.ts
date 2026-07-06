import { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
    S.listItem()
      .title('Site Settings')
      .child(
        S.document()
          .schemaType('siteSettings')
          .documentId('siteSettings')
          .title('Site Settings')
      ),
    S.listItem()
      .title('Homepage')
      .child(
        S.document()
          .schemaType('homepage')
          .documentId('homepage')
          .title('Homepage')
      ),
    S.divider(),
    S.documentTypeListItem('portfolio').title('Portfolio'),
    S.documentTypeListItem('archive').title('Archive'),
    S.documentTypeListItem('beforeAfter').title('Before After'),
    S.documentTypeListItem('bridalMoment').title('Bridal Moment'),
    S.documentTypeListItem('offering').title('Offerings'),
    S.documentTypeListItem('award').title('Awards'),
    S.documentTypeListItem('testimonial').title('Testimonials'),
    S.documentTypeListItem('archiveInMotion').title('Archive In Motion'),
  ])
