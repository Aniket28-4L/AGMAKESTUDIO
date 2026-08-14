import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env')
dotenv.config({ path: envPath })

// Configuration
const PROJECT_ID = '9hw95g30'
const DATASET = 'production'
const API_VERSION = '2023-06-11'

// Validate token is present
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN
if (!SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN is missing! Check your .env file.')
  console.error('   Create a token at https://www.sanity.io/manage')
  process.exit(1)
}
console.log('✅ SANITY_API_TOKEN loaded successfully (starts with:', SANITY_API_TOKEN.slice(0, 5), '...)')

// Create Sanity client
const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: SANITY_API_TOKEN,
  useCdn: false,
})

// Path to attached assets
const ASSETS_DIR = path.resolve(__dirname, '../../../attached_assets')

// Helper to upload an image
async function uploadImage(fileName: string) {
  const filePath = path.resolve(ASSETS_DIR, fileName)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Image not found: ${filePath}`)
  }
  const buffer = fs.readFileSync(filePath)
  const asset = await client.assets.upload('image', buffer, {
    filename: fileName,
  })
  return asset
}

// Main seed function
async function seed() {
  console.log('Starting seed process...')

  // Validate assets directory first
  console.log('Assets directory:', ASSETS_DIR)

  if (!fs.existsSync(ASSETS_DIR)) {
    throw new Error(`Assets directory not found: ${ASSETS_DIR}`)
  }

  const filesInAssetsDir = fs.readdirSync(ASSETS_DIR)
  console.log('Files found in assets directory:', filesInAssetsDir)

  // Verify hero_bride.png exists specifically
  const heroBridePath = path.resolve(ASSETS_DIR, 'hero_bride.png')
  if (fs.existsSync(heroBridePath)) {
    console.log('✅ hero_bride.png found at:', heroBridePath)
  } else {
    throw new Error('hero_bride.png is missing!')
  }

  // ─────────────────────────────────────────────────────────────────
  // Upload all required images first
  // ─────────────────────────────────────────────────────────────────
  console.log('Uploading images...')

  // Upload homepage and common images
  const [
    heroBrideAsset,
    founderAsset,
    gallery1Asset,
    gallery2Asset,
    gallery3Asset,
    gallery4Asset,
    gallery5Asset,
    gallery6Asset,
    story1Asset,
    story2Asset,
    story3Asset,
    story4Asset,
    awards1Asset,
    awards2Asset,
    awards3Asset,
  ] = await Promise.all([
    uploadImage('hero_bride.png'),
    uploadImage('founder2.png'),
    uploadImage('gallery_1.jpeg'),
    uploadImage('gallery_2.jpeg'),
    uploadImage('gallery_3.jpeg'),
    uploadImage('gallery_4.jpeg'),
    uploadImage('gallery_5.jpeg'),
    uploadImage('gallery_6.jpeg'),
    uploadImage('story_1.png'),
    uploadImage('story_2.png'),
    uploadImage('story_3.png'),
    uploadImage('story_4.png'),
    uploadImage('awards1.jpeg'),
    uploadImage('awards2.jpeg'),
    uploadImage('awards3.jpeg'),
  ])

  // Upload archive images (img1.jpg - img30.jpg)
  const archiveAssets = await Promise.all(
    Array.from({ length: 30 }, (_, i) => uploadImage(`img${i + 1}.jpg`))
  )

  console.log('✅ Images uploaded successfully')

  // ─────────────────────────────────────────────────────────────────
  // Create homepage document (singleton)
  // ─────────────────────────────────────────────────────────────────
  console.log('Creating homepage document...')
  await client.createOrReplace({
    _id: 'homepage',
    _type: 'homepage',
    heroEyebrow: 'AG Bridal Couture',
    heroTitle: 'Crafted For The Bride Who Wants To Feel Unforgettable.',
    heroSubtitle: 'Beauty Designed Like A Memory.',
    heroVideo: '/videos/bridal-hero.mp4',
    heroPosterImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: heroBrideAsset._id,
      },
    },
    primaryCta: 'Explore Collections',
    secondaryCta: 'Find Your Bridal Look',
    portfolioEyebrow: 'The Archive',
    portfolioTitle: 'Editorial Radiance',
    portfolioSubtitle: 'Capturing the essence of modern Indian royalty',
    founderEyebrow: 'The Founder',
    founderName: 'Anu Giri',
    founderImage: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: founderAsset._id,
      },
    },
    founderBiography:
      'With over a decade of dedication to the art of luxury bridal makeup, my philosophy is rooted in a simple truth: we are designing for unforgettable memories. The AG approach blends the flawless techniques of editorial fashion with the emotional resonance of a wedding day. We do not mask; we elevate. We bring forward the radiant, timeless version of you that will be cherished in photographs for generations.',
    founderStatistics: [
      { label: 'Years Mastery', value: '10+' },
      { label: 'Couture Brides', value: '500+' },
      { label: 'Industry Awards', value: '15' },
    ],
    beforeAfterEyebrow: 'The Transformation',
    beforeAfterSubtitle: 'Drag the divider to see the magic unfold',
    beforeAfterQuote: 'Every bride deserves to see herself transformed',
    bridalMomentEyebrow: 'The Bridal Moment',
    collectionsEyebrow: 'Our Offerings',
    collectionsTitle: 'Couture Bridal Experiences',
    awardsEyebrow: 'Recognition Earned Through Passion',
    awardsTitle: 'Awards & Recognition',
    awardsQuote: 'Honoured by industry experts worldwide',
    awardsTrustIndicators: [
      { _key: 'trust-1', icon: 'trophy', title: 'Award-Winning', description: '15+ Industry Accolades' },
      { _key: 'trust-2', icon: 'users', title: '500+ Brides', description: 'Happy Couples Worldwide' },
      { _key: 'trust-3', icon: 'globe', title: 'Global Reach', description: 'Available Worldwide' },
    ],
    archiveInMotionEyebrow: 'The Archive in Motion',
    archiveInMotionCaption: 'Follow us @agmakeupstudio',
    testimonialsBrandStrip: ['Vogue', 'Harper\'s Bazaar', 'Elle', 'Brides Today', 'WeddingSutra'],
    atelierContent: {
      eyebrow: 'The Atelier',
      quote: 'We work with only the finest ingredients and luxury brands in the world.',
      brands: ['Dior', 'Charlotte Tilbury', 'NARS', 'MAC', 'Pat McGrath Labs', 'Gucci Beauty'],
      footerText: 'Beauty is luxury. Luxury is quality.',
    },
    bookingFormEyebrow: 'Inquiries',
    bookingFormTitle: 'Begin Your Story',
    bookingFormSubtitle: 'We accept a limited number of brides each season to ensure complete dedication to every single client.',
    whatsappNumber: '+91 98765 43210',
  })
  console.log('✅ homepage document created/updated')

  // ─────────────────────────────────────────────────────────────────
  // Create siteSettings document (singleton)
  // ─────────────────────────────────────────────────────────────────
  console.log('Creating siteSettings document...')
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    businessName: 'AG Makeup Studio',
    contactEmail: 'hello@agmakeupstudio.com',
    address: {
      street: '123 Luxury Bridal Lane',
      city: 'New Delhi',
      postcode: '110001',
    },
    copyrightText: '© 2024 AG Makeup Studio. All rights reserved.',
    mapEmbedUrl: '#',
    socialLinks: [
      { _key: 'instagram', platform: 'instagram', url: '#' },
      { _key: 'pinterest', platform: 'pinterest', url: '#' },
      { _key: 'behance', platform: 'behance', url: '#' },
    ],
    footerContent: 'Artistry designed for unforgettable memories.',
  })
  console.log('✅ siteSettings document created/updated')

  // ─────────────────────────────────────────────────────────────────
  // Create portfolio items (6 featured items)
  // ─────────────────────────────────────────────────────────────────
  console.log('Creating portfolio items...')
  const portfolioData = [
    { id: 'portfolio-01', image: gallery1Asset, altText: 'Bridal portrait', caption: '01. The Signature Look, New Delhi', displayOrder: 0, featured: true },
    { id: 'portfolio-02', image: gallery3Asset, altText: 'Bridal in motion', caption: '02. Veil in Flight', displayOrder: 1, featured: false },
    { id: 'portfolio-03', image: gallery4Asset, altText: 'Makeup closeup', caption: '03. Luminous Finish', displayOrder: 2, featured: false },
    { id: 'portfolio-04', image: gallery2Asset, altText: 'Bridal hands', caption: '04. Mehndi & Pearls', displayOrder: 3, featured: false },
    { id: 'portfolio-05', image: gallery6Asset, altText: 'Bridal Joy', caption: '05. Candid Radiance', displayOrder: 4, featured: false },
    { id: 'portfolio-06', image: gallery5Asset, altText: 'Jewelry', caption: '06. Heritage Adornments', displayOrder: 5, featured: false },
  ]
  for (const item of portfolioData) {
    await client.createOrReplace({
      _id: item.id,
      _type: 'portfolio',
      image: { _type: 'image', asset: { _type: 'reference', _ref: item.image._id } },
      altText: item.altText,
      caption: item.caption,
      featured: item.featured,
      displayOrder: item.displayOrder,
    })
  }
  console.log('✅ portfolio items created/updated')

  // ─────────────────────────────────────────────────────────────────
  // Create archive items (30 items)
  // ─────────────────────────────────────────────────────────────────
  console.log('Creating archive items...')
  for (let i = 0; i < 30; i++) {
    await client.createOrReplace({
      _id: `archive-${String(i + 1).padStart(2, '0')}`,
      _type: 'archive',
      image: { _type: 'image', asset: { _type: 'reference', _ref: archiveAssets[i]._id } },
      altText: `Archive Image ${i + 1}`,
      displayOrder: i,
    })
  }
  console.log('✅ archive items created/updated')

  // ─────────────────────────────────────────────────────────────────
  // Create beforeAfter document (singleton)
  // ─────────────────────────────────────────────────────────────────
  console.log('Creating beforeAfter document...')
  await client.createOrReplace({
    _id: 'beforeAfter',
    _type: 'beforeAfter',
    title: 'Before & After',
    beforeImage: { _type: 'image', asset: { _type: 'reference', _ref: gallery4Asset._id } },
    afterImage: { _type: 'image', asset: { _type: 'reference', _ref: gallery1Asset._id } },
  })
  console.log('✅ beforeAfter document created/updated')

  // ─────────────────────────────────────────────────────────────────
  // Create bridalMoment document (singleton)
  // ─────────────────────────────────────────────────────────────────
  console.log('Creating bridalMoment document...')
  await client.createOrReplace({
    _id: 'bridalMoment',
    _type: 'bridalMoment',
    images: [
      { _type: 'image', asset: { _type: 'reference', _ref: story1Asset._id } },
      { _type: 'image', asset: { _type: 'reference', _ref: story2Asset._id } },
      { _type: 'image', asset: { _type: 'reference', _ref: story3Asset._id } },
      { _type: 'image', asset: { _type: 'reference', _ref: story4Asset._id } },
    ],
    verses: [
      { verseNumber: 'I', verseTitle: 'The Anticipation', verseLines: ['She has', 'always known', 'this moment.'] },
      { verseNumber: 'II', verseTitle: 'The Artistry', verseLines: ['Each stroke,', 'a memory', 'being born.'] },
      { verseNumber: 'III', verseTitle: 'The Revelation', verseLines: ['The mirror reflects', 'what she', 'always was.'] },
      { verseNumber: 'IV', verseTitle: 'The Bride', verseLines: ['Unforgettable.', 'Always.'] },
    ],
  })
  console.log('✅ bridalMoment document created/updated')

  // ─────────────────────────────────────────────────────────────────
  // Create offering items (4 items)
  // ─────────────────────────────────────────────────────────────────
  console.log('Creating offering items...')
  const offeringData = [
    {
      id: 'offering-01',
      number: 1,
      name: 'Anu’s Signature Makeup',
      description: 'A bespoke bridal makeup experience created exclusively for you.\n\n✓ Personalized to your face shape & skin tone\n✓ Premium luxury products only\n✓ Soft, radiant & timeless finish\n✓ Long-lasting for weddings & events\n✓ Natural look with flawless photographs',
      image: gallery2Asset,
      ctaText: 'Request Consultation'
    },
    {
      id: 'offering-02',
      number: 2,
      name: 'Airbrush Makeup',
      description: 'A lightweight, camera-perfect finish for modern brides.\n\n✓ Ultra-light airbrush application\n✓ Sweat & humidity resistant\n✓ HD camera-ready finish\n✓ Covers imperfections naturally\n✓ Ideal for destination weddings',
      image: gallery3Asset,
      ctaText: 'Request Consultation'
    },
    {
      id: 'offering-03',
      number: 3,
      name: 'Luxe Makeup',
      description: 'Luxury artistry using internationally renowned beauty brands.\n\n✓ Dior, Charlotte Tilbury & MAC products\n✓ High-fashion radiant finish\n✓ Customized bridal styling\n✓ Long-lasting premium wear\n✓ Elegant, luxurious appearance',
      image: gallery1Asset,
      ctaText: 'Request Consultation'
    },
    {
      id: 'offering-04',
      number: 4,
      name: 'HD Makeup',
      description: 'Flawless makeup designed for high-definition photography.\n\n✓ Smooth skin-like finish\n✓ Perfect for HD cameras & videos\n✓ Soft, natural-looking coverage\n✓ Conceals fine lines & pores\n✓ Fresh look throughout the celebration',
      image: gallery4Asset,
      ctaText: 'Request Consultation'
    },
  ]
  for (const offering of offeringData) {
    await client.createOrReplace({
      _id: offering.id,
      _type: 'offering',
      number: offering.number,
      name: offering.name,
      description: offering.description,
      image: { _type: 'image', asset: { _type: 'reference', _ref: offering.image._id } },
      ctaText: offering.ctaText,
    })
  }
  console.log('✅ offering items created/updated')

  // ─────────────────────────────────────────────────────────────────
  // Create award items (3 items)
  // ─────────────────────────────────────────────────────────────────
  console.log('Creating award items...')
  const awardData = [
    { id: 'award-01', title: 'International Bridal Excellence', description: 'Recognized for exceptional bridal transformations.', location: 'Dubai', year: 2024, image: awards1Asset },
    { id: 'award-02', title: 'Global Beauty Leader', description: 'Honoured for influence in luxury bridal artistry.', location: 'London', year: 2023, image: awards2Asset },
    { id: 'award-03', title: 'Master of Bridal Artistry', description: 'Excellence in couture bridal transformations.', location: 'Mumbai', year: 2024, image: awards3Asset },
  ]
  for (const award of awardData) {
    await client.createOrReplace({
      _id: award.id,
      _type: 'award',
      title: award.title,
      description: award.description,
      location: award.location,
      year: award.year,
      image: { _type: 'image', asset: { _type: 'reference', _ref: award.image._id } },
    })
  }
  console.log('✅ award items created/updated')

  // ─────────────────────────────────────────────────────────────────
  // Create testimonial items (3 items)
  // ─────────────────────────────────────────────────────────────────
  console.log('Creating testimonial items...')
  const testimonialData = [
    { id: 'testimonial-01', quote: 'Anu didn\'t just do my makeup; she crafted a vision. I felt like I stepped out of a Vogue India editorial. Truly unforgettable.', brideName: 'Priyanka S.', brideType: 'Destination Bride', featured: true },
    { id: 'testimonial-02', quote: 'The detail, the care, the luxury experience. The AG team understands how to make a bride feel like absolute royalty.', brideName: 'Meera R.', brideType: 'Royal Palace Bride', featured: false },
    { id: 'testimonial-03', quote: 'My makeup lasted flawlessly through tears, laughter, and a night of dancing. She is an absolute master of her craft.', brideName: 'Aisha M.', brideType: 'Classic Bride', featured: false },
  ]
  for (const testimonial of testimonialData) {
    await client.createOrReplace({
      _id: testimonial.id,
      _type: 'testimonial',
      quote: testimonial.quote,
      brideName: testimonial.brideName,
      brideType: testimonial.brideType,
      featured: testimonial.featured,
    })
  }
  console.log('✅ testimonial items created/updated')

  // ─────────────────────────────────────────────────────────────────
  // Create archiveInMotion items (4 items)
  // ─────────────────────────────────────────────────────────────────
  console.log('Creating archiveInMotion items...')
  const archiveInMotionData = [
    { id: 'archiveInMotion-01', reelTitle: 'Bridal Editorial Reel 1', thumbnail: gallery1Asset, instagramUrl: 'https://www.instagram.com/reel/DXO5Qx3CgCB/', displayOrder: 0 },
    { id: 'archiveInMotion-02', reelTitle: 'Bridal Editorial Reel 2', thumbnail: gallery2Asset, instagramUrl: 'https://www.instagram.com/reel/DXQq9BiiX3u/', displayOrder: 1 },
    { id: 'archiveInMotion-03', reelTitle: 'Bridal Editorial Reel 3', thumbnail: gallery3Asset, instagramUrl: 'https://www.instagram.com/reel/DJt7CsgsvXk/', displayOrder: 2 },
    { id: 'archiveInMotion-04', reelTitle: 'Bridal Editorial Reel 4', thumbnail: gallery4Asset, instagramUrl: 'https://www.instagram.com/reel/DW_TQpfihau/', displayOrder: 3 },
  ]
  for (const item of archiveInMotionData) {
    await client.createOrReplace({
      _id: item.id,
      _type: 'archiveInMotion',
      reelTitle: item.reelTitle,
      thumbnail: { _type: 'image', asset: { _type: 'reference', _ref: item.thumbnail._id } },
      instagramUrl: item.instagramUrl,
      displayOrder: item.displayOrder,
    })
  }
  console.log('✅ archiveInMotion items created/updated')

  console.log('\n🎉 Seed process completed successfully!')
  console.log('Final document counts:')
  console.log('  - homepage: 1')
  console.log('  - siteSettings: 1')
  console.log('  - portfolio: 6')
  console.log('  - archive: 30')
  console.log('  - beforeAfter: 1')
  console.log('  - bridalMoment: 1')
  console.log('  - offering: 4')
  console.log('  - award: 3')
  console.log('  - testimonial: 3')
  console.log('  - archiveInMotion: 4')
  console.log('Check your Sanity Studio at https://www.sanity.io/manage')
}

// Run the seed
seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})