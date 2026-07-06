import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const client = createClient({
  projectId: '9hw95g30',
  dataset: 'production',
  apiVersion: '2023-06-11',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const STABLE_IDS = new Set([
  'homepage',
  'siteSettings',
  'beforeAfter',
  'bridalMoment',
  ...Array.from({ length: 4 }, (_, i) => `offering-0${i + 1}`),
  ...Array.from({ length: 3 }, (_, i) => `award-0${i + 1}`),
  ...Array.from({ length: 3 }, (_, i) => `testimonial-0${i + 1}`),
  ...Array.from({ length: 4 }, (_, i) => `archiveInMotion-0${i + 1}`),
  ...Array.from({ length: 6 }, (_, i) => `portfolio-0${i + 1}`),
  ...Array.from({ length: 30 }, (_, i) => `archive-${String(i + 1).padStart(2, '0')}`),
]);

async function cleanDuplicates() {
  console.log('🧹 Starting cleanup of duplicate documents...');

  // Get all documents
  const allDocs = await client.fetch('*[_type in ["homepage", "siteSettings", "beforeAfter", "bridalMoment", "offering", "award", "testimonial", "archiveInMotion", "portfolio", "archive"]]{_id, _type}');
  
  console.log(`Found ${allDocs.length} total documents`);

  // Separate stable documents and others
  const docsToDelete = allDocs.filter(doc => !STABLE_IDS.has(doc._id));
  
  if (docsToDelete.length === 0) {
    console.log('✅ No duplicates found!');
    return;
  }

  console.log(`Deleting ${docsToDelete.length} duplicate documents...`);

  // Delete duplicates in transaction
  const transaction = client.transaction();
  docsToDelete.forEach(doc => {
    transaction.delete(doc._id);
  });

  await transaction.commit();
  
  console.log('🎉 Cleanup complete!');
}

cleanDuplicates().catch(err => {
  console.error('❌ Cleanup failed:', err);
  process.exit(1);
});
