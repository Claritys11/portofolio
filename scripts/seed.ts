require('dotenv').config({ path: '.env.development.local' });

import { kv } from '@vercel/kv';
import { certificates as certificatesData } from '../src/lib/certificates-data';
import postsData from '../src/data/blogs.json';
import type { Post, Certificate } from '../src/lib/types';

const POSTS_KEY = 'posts';
const CERTIFICATES_KEY = 'certificates';

async function seedPosts() {
  console.log('Seeding posts...');
  const posts = postsData as Omit<Post, 'slug'>[];
  const postPromises = posts.map(post => {
    const slug = post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const postWithSlug: Post = { ...post, slug };
    console.log(`  -> Adding post: ${postWithSlug.title}`);
    return kv.hset(POSTS_KEY, { [slug]: postWithSlug });
  });

  await Promise.all(postPromises);
  console.log('Posts seeded successfully!\n');
}

async function seedCertificates() {
  console.log('Seeding certificates...');
  const certs = certificatesData as Omit<Certificate, 'id'>[];
  const certificatePromises = certs.map(cert => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2);
    const certWithId: Certificate = { ...cert, id };
    console.log(`  -> Adding certificate: ${certWithId.title}`);
    return kv.hset(CERTIFICATES_KEY, { [id]: certWithId });
  });

  await Promise.all(certificatePromises);
  console.log('Certificates seeded successfully!\n');
}

async function main() {
  console.log('Clearing existing KV data...');
  await kv.del(POSTS_KEY, CERTIFICATES_KEY);
  console.log('KV data cleared.\n');

  await seedPosts();
  await seedCertificates();

  console.log('All data has been seeded to Vercel KV.');
  console.log('You can now remove the old data files: src/data/blogs.json and src/lib/certificates-data.ts');
}

main().catch(err => {
  console.error('An error occurred during seeding:', err);
  process.exit(1);
});
