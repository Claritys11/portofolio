'use server';

import { promises as fs } from 'fs';
import { join } from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Certificate, Post } from '@/lib/types';

// --- FILE PATHS ---
const POSTS_DATA_PATH = join(process.cwd(), 'src/data/blogs.json');
const CERTIFICATES_DATA_PATH = join(process.cwd(), 'src/lib/certificates-data.ts');

// --- POST HELPERS ---
async function readPosts(): Promise<Post[]> {
  const fileContent = await fs.readFile(POSTS_DATA_PATH, 'utf-8');
  return JSON.parse(fileContent);
}

async function writePosts(posts: Post[]): Promise<void> {
  await fs.writeFile(POSTS_DATA_PATH, JSON.stringify(posts, null, 2), 'utf-8');
}

// --- CERTIFICATE HELPERS ---
async function readCertificates(): Promise<Certificate[]> {
    try {
        const fileContent = await fs.readFile(CERTIFICATES_DATA_PATH, 'utf-8');
        const match = fileContent.match(/export const certificates: Certificate\[] = ([\s\S]*?);/);
        if (!match) return [];
        // This use of eval is not safe for production.
        return eval(match[1]);
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeCertificates(certificates: Certificate[]): Promise<void> {
    const content = `import type { Certificate } from './types';\n\nexport const certificates: Certificate[] = ${JSON.stringify(certificates, null, 2)};\n`;
    await fs.writeFile(CERTIFICATES_DATA_PATH, content, 'utf-8');
}

// --- POST ACTIONS ---
export async function createPost(data: Omit<Post, 'slug'>) {
    const posts = await readPosts();
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newPost = { ...data, slug };
    posts.unshift(newPost);
    await writePosts(posts);
    revalidatePath('/');
    return newPost;
}

export async function updatePost(slug: string, data: Partial<Post>) {
    const posts = await readPosts();
    const postIndex = posts.findIndex(p => p.slug === slug);
    if (postIndex === -1) throw new Error('Post not found');
    
    const newSlug = data.title ? data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : slug;
    posts[postIndex] = { ...posts[postIndex], ...data, slug: newSlug };

    await writePosts(posts);
    revalidatePath('/');
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/posts/${newSlug}`);
    return posts[postIndex];
}

export async function deletePost(slug: string) {
    let posts = await readPosts();
    posts = posts.filter(post => post.slug !== slug);
    await writePosts(posts);
    revalidatePath('/');
    revalidatePath(`/posts/${slug}`);
}

// --- CERTIFICATE ACTIONS ---
export async function createCertificate(data: Omit<Certificate, 'id'>) {
    const certificates = await readCertificates();
    const newCertificate = { ...data, id: Date.now().toString() };
    certificates.push(newCertificate);
    await writeCertificates(certificates);
    revalidatePath('/about');
}

export async function updateCertificate(index: number, data: Certificate) {
    const certificates = await readCertificates();
    if (index < 0 || index >= certificates.length) throw new Error('Certificate not found');
    certificates[index] = data;
    await writeCertificates(certificates);
    revalidatePath('/about');
}

export async function deleteCertificate(index: number) {
    const certificates = await readCertificates();
    if (index < 0 || index >= certificates.length) throw new Error('Certificate not found');
    certificates.splice(index, 1);
    await writeCertificates(certificates);
    revalidatePath('/about');
}

// --- AUTHENTICATION ACTION ---
export async function login(prevState: { error: string | undefined }, formData: FormData) {
    try {
      const validatedFields = z.object({ password: z.string() }).safeParse({ password: formData.get('password') });
      if (!validatedFields.success) return { error: 'Invalid input.' };
      const { password } = validatedFields.data;

      const validPasswords = [process.env.SECRET_PASSWORD, process.env.SECRET_PASSWORD_2].filter(Boolean);
  
      if (validPasswords.includes(password)) {
        (await cookies()).set('admin-auth', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24, path: '/' });
        redirect('/admin');
      } else {
        return { error: 'Incorrect secret.' };
      }
    } catch (error) {
        if (error instanceof Error && (error as any).type === 'NEXT_REDIRECT') throw error;
        console.error('Authentication error:', error);
        return { error: 'An unexpected error occurred.' };
    }
}
