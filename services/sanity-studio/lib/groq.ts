/**
 * GROQ Queries for AG Makeup Studio
 */

export const HOME_PAGE_QUERY = `*[_type == "homepage" && _id == "homepage"][0]`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings" && _id == "siteSettings"][0]`

export const PORTFOLIO_QUERY = `*[_type == "portfolio"] | order(displayOrder asc, _createdAt desc)`

export const FEATURED_PORTFOLIO_QUERY = `*[_type == "portfolio" && featured == true] | order(displayOrder asc, _createdAt desc)`

export const BEFORE_AFTER_QUERY = `*[_type == "beforeAfter"] | order(_createdAt desc)`

export const BRIDAL_MOMENTS_QUERY = `*[_type == "bridalMoment"] | order(_createdAt desc)`

export const OFFERINGS_QUERY = `*[_type == "offering"] | order(_createdAt desc)`

export const AWARDS_QUERY = `*[_type == "award"] | order(_createdAt desc)`

export const ARCHIVE_IN_MOTION_QUERY = `*[_type == "archiveInMotion"] | order(_createdAt desc)`
