
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Force the use of the Node.js runtime
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  console.log('Image upload API route started.'); // Initial log

  const data = await req.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = join(process.cwd(), 'public/uploads');
  const filename = `${Date.now()}-${file.name}`;
  const path = join(uploadDir, filename);

  try {
    // Ensure the uploads directory exists
    await mkdir(uploadDir, { recursive: true });

    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);

    // Use the NEXT_PUBLIC_SITE_URL environment variable
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://${req.nextUrl.host}`;
    const url = `${siteUrl}/uploads/${filename}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Error saving file:', error);
    // Provide a more specific error response
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: `Error saving file: ${errorMessage}` }, { status: 500 });
  }
}
