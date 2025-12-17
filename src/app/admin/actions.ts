'use server';

import { kv } from '@vercel/kv';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Certificate, Post } from '@/lib/types';

// --- DATA KEYS ---
const POSTS_KEY = 'posts';
const CERTIFICATES_KEY = 'certificates';

// --- POST ACTIONS ---
export async function createPost(data: Omit<Post, 'slug'>) {
    const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newPost: Post = { ...data, slug };
    
    await kv.hset(POSTS_KEY, { [slug]: newPost });
    
    revalidatePath('/');
    return newPost;
}

export async function updatePost(slug: string, data: Partial<Post>) {
    const existingPost = await kv.hget<Post>(POSTS_KEY, slug);
    if (!existingPost) throw new Error('Post not found');

    const newSlug = data.title ? data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : slug;
    const updatedPost = { ...existingPost, ...data, slug: newSlug };

    // If the slug changed, remove the old entry
    if (slug !== newSlug) {
        await kv.hdel(POSTS_KEY, slug);
    }

    await kv.hset(POSTS_KEY, { [newSlug]: updatedPost });

    revalidatePath('/');
    revalidatePath(`/posts/${slug}`);
    revalidatePath(`/posts/${newSlug}`);
    return updatedPost;
}

export async function deletePost(slug: string) {
    await kv.hdel(POSTS_KEY, slug);
    revalidatePath('/');
    revalidatePath(`/posts/${slug}`);
}

// --- CERTIFICATE ACTIONS ---
export async function createCertificate(data: Omit<Certificate, 'id'>) {
    const id = Date.now().toString();
    const newCertificate: Certificate = { ...data, id };
    await kv.hset(CERTIFICATES_KEY, { [id]: newCertificate });
    revalidatePath('/about');
}

export async function updateCertificate(id: string, data: Certificate) {
    await kv.hset(CERTIFICATES_KEY, { [id]: data });
    revalidatePath('/about');
}

export async function deleteCertificate(id: string) {
    await kv.hdel(CERTIFICATES_KEY, id);
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
        // Use await with cookies()
        const cookieStore = await cookies();
        cookieStore.set('admin-auth', 'true', { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24, path: '/' });
        redirect('/admin');
      } else {
        return { error: 'Incorrect secret.' };
      }
    } catch (error) {
        if (error instanceof Error && 'digest' in error && typeof (error as any).digest === 'string' && (error as any).digest.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error('Authentication error:', error);
        return { error: 'An unexpected error occurred.' };
    }
}
