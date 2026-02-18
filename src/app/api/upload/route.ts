import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const BUCKET_NAME = 'liting-art-gallery-images';
const PUBLIC_BASE = `https://storage.googleapis.com/${BUCKET_NAME}`;

// Initialize GCS client — on Cloud Run uses the attached service account automatically
const storage = new Storage();
const bucket = storage.bucket(BUCKET_NAME);

async function uploadBuffer(buffer: Buffer, destPath: string): Promise<string> {
  const file = bucket.file(destPath);
  await file.save(buffer, {
    contentType: 'image/jpeg',
    metadata: { cacheControl: 'public, max-age=31536000' },
  });
  return `${PUBLIC_BASE}/${destPath}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const ts = formData.get('timestamp') as string;
    const base = `artworks/${ts}`;

    const phoneFile = formData.get('phone') as File | null;
    const padFile = formData.get('pad') as File | null;
    const originalFile = formData.get('original') as File | null;

    if (!phoneFile || !padFile || !originalFile) {
      return NextResponse.json({ error: 'Missing file(s)' }, { status: 400 });
    }

    const [phoneBuf, padBuf, originalBuf] = await Promise.all([
      phoneFile.arrayBuffer().then((b) => Buffer.from(b)),
      padFile.arrayBuffer().then((b) => Buffer.from(b)),
      originalFile.arrayBuffer().then((b) => Buffer.from(b)),
    ]);

    const [imageUrlPhone, imageUrlPad, imageUrl] = await Promise.all([
      uploadBuffer(phoneBuf, `${base}/phone.jpg`),
      uploadBuffer(padBuf, `${base}/pad.jpg`),
      uploadBuffer(originalBuf, `${base}/original.jpg`),
    ]);

    return NextResponse.json({ imageUrl, imageUrlPad, imageUrlPhone });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
