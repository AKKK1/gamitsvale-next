import { v2 as cloudinary } from 'cloudinary';

// ✅ ფუნქციაში კითხულობს — dotenv უკვე გაშვებულია
const getConfig = () => ({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(base64: string, folder: string): Promise<string> {
  // ყოველ გამოძახებაზე config განახლდება
  cloudinary.config(getConfig());

  const result = await cloudinary.uploader.upload(base64, {
    folder: `gamitsvale/${folder}`,
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });
  return result.secure_url;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    cloudinary.config(getConfig());
    const parts = url.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const folder = parts[parts.length - 2];
    const public_id = `gamitsvale/${folder}/${filename}`;
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.error('Cloudinary delete error:', err);
  }
}