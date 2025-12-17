'use server';

import { promises as fs } from 'fs';
import { join } from 'path';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Certificate, Post } from '@/lib/types';

// --- DATA FILE PATHS ---
const CERTIFICATES_DATA_PATH = join(process.cwd(), 'src/lib/certificates-data.ts');
const POSTS_DATA_PATH = join(process.cwd(), 'src/data/blogs.json');

// --- DATA HELPERS ---
async function readData<T>(path: string): Promise<T[]> {
    try {
        const fileContent = await fs.readFile(path, 'utf-8');
        if (path.endsWith('.ts')) {
            const match = fileContent.match(/export const [a-zA-Z]+: [a-zA-Z]+<[a-zA-Z]+>\[] = ([\s\S]*?);/);
            if (!match) return [];
            // In a real app, this would be a proper parser or a different data source.
            return eval(match[1]);
        }
        return JSON.parse(fileContent);
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writePostsFile(posts: Post[]): Promise<void> {
    await fs.writeFile(POSTS_DATA_PATH, JSON.stringify(posts, null, 2), 'utf-8');
    revalidatePath('/');
    revalidatePath('/archives');
}

async function writeCertificatesFile(certificates: Certificate[]): Promise<void> {
    const fileContent = `import type { Certificate } from '../types';\n\nexport const certificates: Certificate[] = ${JSON.stringify(certificates, null, 2)};\n`;
    await fs.writeFile(CERTIFICATES_DATA_PATH, fileContent, 'utf-8');
    revalidatePath('/about');
    revalidatePath('/admin/certificates');
}

// --- POST ACTIONS ---
export async function createPost(data: Omit<Post, 'slug'>) {
    const posts = await readData<Post>(POSTS_DATA_PATH);
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newPost = { ...data, slug };
    posts.unshift(newPost);
    await writePostsFile(posts);
    revalidatePath('/');
    revalidatePath('/archives');
    return newPost;
}

export async function updatePost(slug: string, data: Partial<Post>) {
    const posts = await readData<Post>(POSTS_DATA_PATH);
    const postIndex = posts.findIndex(p => p.slug === slug);
    if (postIndex === -1) throw new Error('Post not found');
    
    const newSlug = data.title ? data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : slug;
    posts[postIndex] = { ...posts[postIndex], ...data, slug: newSlug };

    await writePostsFile(posts);
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/posts/${newSlug}`);
    revalidatePath('/');

    return posts[postIndex];
}

export async function deletePost(slug: string) {
    const posts = await readData<Post>(POSTS_DATA_PATH);
    const updatedPosts = posts.filter(post => post.slug !== slug);
    if (posts.length === updatedPosts.length) {
        return { success: false, message: 'Post not found.' };
    }
    await writePostsFile(updatedPosts);
    revalidatePath(`/posts/${slug}`);
    revalidatePath('/');
    return { success: true, message: 'Post deleted successfully.' };
}

// --- CERTIFICATE ACTIONS ---
export async function createCertificate(data: Omit<Certificate, 'id'>) {
    const certificates = await readData<Certificate>(CERTIFICATES_DATA_PATH);
    const newCertificate = { ...data, id: Date.now().toString() };
    certificates.push(newCertificate);
    await writeCertificatesFile(certificates);
    return newCertificate;
}

export async function updateCertificate(index: number, data: Certificate) {
    const certificates = await readData<Certificate>(CERTIFICATES_DATA_PATH);
    if (index < 0 || index >= certificates.length) throw new Error('Certificate not found');
    certificates[index] = data;
    await writeCertificatesFile(certificates);
    return data;
}

export async function deleteCertificate(index: number) {
    const certificates = await readData<Certificate>(CERTIFICATES_DATA_PATH);
    if (index < 0 || index >= certificates.length) throw new Error('Certificate not found');
    certificates.splice(index, 1);
    await writeCertificatesFile(certificates);
}

// --- AUTHENTICATION ACTION ---
export async function login(prevState: { error: string | undefined }, formData: FormData) {
    try {
      const validatedFields = z.object({ password: z.string() }).safeParse({ password: formData.get('password') });
      if (!validatedFields.success) return { error: 'Invalid input.' };
      const { password } = validatedFields.data;
      
      // --- Debugging Lines ---
      console.log("Attempting login...");
      console.log("Password from form:", password);
      console.log("SECRET_PASSWORD from env:", process.env.SECRET_PASSWORD);
      console.log("SECRET_PASSWORD_2 from env:", process.env.SECRET_PASSWORD_2);
      // --- End Debugging Lines ---

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
