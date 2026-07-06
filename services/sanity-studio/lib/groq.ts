/**
 * GROQ Queries for AG Makeup Studio
 */

export const HOME_PAGE_QUERY = `*[_type == "homepage" && _id == "homepage"][0] {
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  heroVideo,
  heroPosterImage,
  primaryCta,
  secondaryCta,
  portfolioEyebrow,
  portfolioTitle,
  portfolioSubtitle,
  founderEyebrow,
  founderName,
  founderImage,
  founderBiography,
  founderStatistics,
  beforeAfterEyebrow,
  beforeAfterSubtitle,
  beforeAfterQuote,
  bridalMomentEyebrow,
  collectionsEyebrow,
  collectionsTitle,
  awardsEyebrow,
  awardsTitle,
  awardsQuote,
  awardsTrustIndicators,
  archiveInMotionEyebrow,
  archiveInMotionCaption,
  testimonialsBrandStrip,
  atelierContent,
  bookingFormEyebrow,
  bookingFormTitle,
  bookingFormSubtitle,
  whatsappNumber
}`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0] {
  businessName,
  contactEmail,
  address,
  copyrightText,
  mapEmbedUrl,
  socialLinks,
  footerContent
}`

export const PORTFOLIO_QUERY = `*[_type == "portfolio"] | order(displayOrder asc, _createdAt desc) {
  _id,
  title,
  slug,
  image,
  altText,
  caption,
  featured,
  displayOrder
}`

export const FEATURED_PORTFOLIO_QUERY = `*[_type == "portfolio" && featured == true] | order(displayOrder asc, _createdAt desc) {
  _id,
  title,
  slug,
  image,
  altText,
  caption,
  featured,
  displayOrder
}`

export const BEFORE_AFTER_QUERY = `*[_type == "beforeAfter"] | order(_createdAt desc) {
  _id,
  title,
  beforeImage,
  afterImage
}`

export const BRIDAL_MOMENTS_QUERY = `*[_type == "bridalMoment"] | order(_createdAt desc) {
  _id,
  images,
  verses
}`

export const OFFERINGS_QUERY = `*[_type == "offering"] | order(_createdAt desc) {
  _id,
  number,
  name,
  description,
  image,
  ctaText
}`

export const AWARDS_QUERY = `*[_type == "award"] | order(_createdAt desc) {
  _id,
  title,
  description,
  location,
  year,
  image
}`

export const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  quote,
  brideName,
  brideType,
  featured
}`

export const ARCHIVE_IN_MOTION_QUERY = `*[_type == "archiveInMotion"] | order(displayOrder asc, _createdAt desc) {
  _id,
  reelTitle,
  instagramUrl,
  thumbnail,
  videoUrl,
  displayOrder
}`

export const ARCHIVE_QUERY = `*[_type == "archive"] | order(displayOrder asc, _createdAt desc) {
  _id,
  image,
  altText,
  displayOrder
}`
