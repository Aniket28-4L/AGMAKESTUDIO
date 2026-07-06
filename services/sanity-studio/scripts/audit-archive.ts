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

async function auditArchive() {
  console.log('🔍 Starting archive audit...');

  // Step 4: Count archive documents
  const archiveCount = await client.fetch('count(*[_type == "archive"])');
  console.log('\n📊 Archive count:', archiveCount);

  // Step 5: Get first 5 archive docs
  const firstFive = await client.fetch('*[_type == "archive"][0...5]');
  console.log('\n📄 First 5 archive documents:', JSON.stringify(firstFive, null, 2));

  console.log('\n✅ Archive audit complete!');
}

auditArchive().catch(err => {
  console.error('❌ Audit failed:', err);
  process.exit(1);
});
