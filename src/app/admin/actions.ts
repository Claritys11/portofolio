'use server';

import { promises as fs } from 'fs';
import { join } from 'path';
import { revalidatePath } from 'next/cache';
import type { Certificate } from '@/lib/types';

const dataFilePath = join(process.cwd(), 'src/lib/certificates-data.ts');

async function readCertificatesFile(): Promise<Certificate[]> {
    try {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        // This is a simplified parser. It assumes the array is exported as `certificates`.
        const match = fileContent.match(/export const certificates: Certificate\[] = ([\s\S]*?);/);
        if (!match) {
            console.error("Could not find certificates array in the data file.");
            return [];
        }
        // WARNING: Using eval is a security risk, but for this prototype it's the simplest way to parse the object literal.
        // A real implementation should use a proper data store like a JSON file or a database.
        return eval(match[1]);
    } catch (error) {
        console.error('Error reading certificates data:', error);
        // If the file doesn't exist or is empty, return an empty array.
        if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: unknown }).code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

async function writeCertificatesFile(certificates: Certificate[]): Promise<void> {
    const fileContent = `import type { Certificate } from './types';\n\nexport const certificates: Certificate[] = ${JSON.stringify(certificates, null, 2)};\n`;
    await fs.writeFile(dataFilePath, fileContent, 'utf-8');
    revalidatePath('/about');
    revalidatePath('/admin/certificates');
}

export async function createCertificate(data: Omit<Certificate, 'id'>) {
    const certificates = await readCertificatesFile();
    const newCertificate = { ...data };
    certificates.push(newCertificate);
    await writeCertificatesFile(certificates);
    return newCertificate;
}

// The `index` parameter is used for simplicity. In a real app, you'd use a unique ID.
export async function updateCertificate(index: number, data: Certificate) {
    const certificates = await readCertificatesFile();
    if (index < 0 || index >= certificates.length) {
        throw new Error('Certificate not found');
    }
    certificates[index] = data;
    await writeCertificatesFile(certificates);
    return data;
}

// The `index` parameter is used for simplicity. In a real app, you'd use a unique ID.
export async function deleteCertificate(index: number) {
    const certificates = await readCertificatesFile();
    if (index < 0 || index >= certificates.length) {
        throw new Error('Certificate not found');
    }
    const deleted = certificates.splice(index, 1);
    await writeCertificatesFile(certificates);
    return deleted[0];
}

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
        cookies().set('admin-auth', 'true', {
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
      if (error instanceof AuthError) {
        return { error: 'Authentication failed.' };
      }
      return { error: 'An unexpected error occurred.' };
    }
  }
