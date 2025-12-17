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

// --- CERTIFICATE DATA HELPERS ---
async function readCertificatesFile(): Promise<Certificate[]> {
    try {
        const fileContent = await fs.readFile(CERTIFICATES_DATA_PATH, 'utf-8');
        const match = fileContent.match(/export const certificates: Certificate\[] = ([\s\S]*?);/);
        if (!match) return [];
        return eval(match[1]);
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeCertificatesFile(certificates: Certificate[]): Promise<void> {
    const fileContent = `import type { Certificate } from './types';\n\nexport const certificates: Certificate[] = ${JSON.stringify(certificates, null, 2)};\n`;
    await fs.writeFile(CERTIFICATES_DATA_PATH, fileContent, 'utf-8');
    revalidatePath('/about');
    revalidatePath('/admin/certificates');
}

// --- POST DATA HELPERS ---
async function readPostsFile(): Promise<Post[]> {
    const fileContent = await fs.readFile(POSTS_DATA_PATH, 'utf-8');
    return JSON.parse(fileContent);
}

async function writePostsFile(posts: Post[]): Promise<void> {
    await fs.writeFile(POSTS_DATA_PATH, JSON.stringify(posts, null, 2), 'utf-8');
    revalidatePath('/');
    revalidatePath('/archives');
}

// --- CERTIFICATE ACTIONS ---
export async function createCertificate(data: Omit<Certificate, 'id'>) {
    const certificates = await readCertificatesFile();
    const newCertificate = { ...data, id: Date.now().toString() };
    certificates.push(newCertificate);
    await writeCertificatesFile(certificates);
    return newCertificate;
}

export async function updateCertificate(index: number, data: Certificate) {
    const certificates = await readCertificatesFile();
    if (index < 0 || index >= certificates.length) throw new Error('Certificate not found');
    certificates[index] = data;
    await writeCertificatesFile(certificates);
    return data;
}

export async function deleteCertificate(index: number) {
    const certificates = await readCertificatesFile();
    if (index < 0 || index >= certificates.length) throw new Error('Certificate not found');
    const deleted = certificates.splice(index, 1);
    await writeCertificatesFile(certificates);
    return deleted[0];
}

// --- POST ACTIONS ---
export async function deletePost(slug: string) {
    try {
        const posts = await readPostsFile();
        const updatedPosts = posts.filter(post => post.slug !== slug);
        if (posts.length === updatedPosts.length) {
            return { success: false, message: 'Post not found.' };
        }
        await writePostsFile(updatedPosts);
        return { success: true, message: 'Post deleted successfully.' };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, message: 'An error occurred while deleting the post.' };
    }
}


// --- AUTHENTICATION ACTION ---
export async function authenticate(prevState: { error: string | undefined }, formData: FormData) {
    try {
      const validatedFields = z.object({ password: z.string() }).safeParse({
        password: formData.get('password'),
      });
  
      if (!validatedFields.success) {
        return { error: 'Invalid input.' };
      }
  
      const { password } = validatedFields.data;
      
      // --- Start Debugging Lines ---
      console.log("Attempting login...");
      console.log("Password from form:", password);
      console.log("SECRET_PASSWORD from env:", process.env.SECRET_PASSWORD);
      console.log("SECRET_PASSWORD_2 from env:", process.env.SECRET_PASSWORD_2);
      // --- End Debugging Lines ---

      const validPasswords = [process.env.SECRET_PASSWORD, process.env.SECRET_PASSWORD_2].filter(Boolean);
  
      if (validPasswords.includes(password)) {
        (await cookies()).set('admin-auth', 'true', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 1 day
          path: '/',
        });
        redirect('/admin');
      } else {
        return { error: 'Incorrect secret.' };
      }
    } catch (error) {
        if (error instanceof Error && (error as any).type === 'NEXT_REDIRECT') {
            throw error;
        }
        console.error('Authentication error:', error);
        return { error: 'An unexpected error occurred.' };
    }
}
