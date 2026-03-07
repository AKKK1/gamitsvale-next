import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const FOLDER_LIMITS: Record<string, number> = {
  listings: 5,
  offers: 2,
  avatars: 1,
};

export async function POST(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { images, folder = 'listings' } = await request.json();

  if (!images || !Array.isArray(images)) {
    return NextResponse.json({ error: 'No images provided' }, { status: 400 });
  }

  const limit = FOLDER_LIMITS[folder] || 5;
  const toUpload = images.slice(0, limit);

  try {
    const urls = await Promise.all(
      toUpload.map((base64: string) =>
        cloudinary.uploader.upload(base64, {
          folder: `gamitsvale/${folder}`,
          transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        }).then(r => r.secure_url)
      )
    );
    return NextResponse.json({ urls });
  } catch (err) {
    console.error('Cloudinary error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}