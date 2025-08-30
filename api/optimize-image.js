import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, w, q, format } = req.query;
    const imageUrl = url;
    const width = parseInt(w || '800');
    const quality = parseInt(q || '80');
    const imageFormat = format || 'webp';

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Validate parameters
    if (width < 1 || width > 4000) {
      return res.status(400).json({ error: 'Width must be between 1 and 4000' });
    }

    if (quality < 1 || quality > 100) {
      return res.status(400).json({ error: 'Quality must be between 1 and 100' });
    }

    if (!['webp', 'jpeg', 'jpg', 'png'].includes(imageFormat)) {
      return res.status(400).json({ error: 'Format must be webp, jpeg, jpg, or png' });
    }

    // Determine if it's a local image or external URL
    let imageBuffer;

    if (imageUrl.startsWith('http')) {
      // External image (Google Drive)
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      imageBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      // Local image from public folder
      // Remove leading slash and construct path to public folder
      const imagePath = path.join(process.cwd(), 'public', imageUrl.replace(/^\//, ''));

      try {
        imageBuffer = await fs.readFile(imagePath);
      } catch (error) {
        console.error('Local image read error:', error);
        return res.status(404).json({ error: 'Local image not found' });
      }
    }

    // Optimize the image with automatic rotation based on EXIF orientation
    let optimizedImage;

    if (imageFormat === 'webp') {
      optimizedImage = await sharp(imageBuffer)
        .rotate() // Automatically rotate based on EXIF orientation
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({
          quality,
          effort: 6 // Higher effort for better compression
        })
        .toBuffer();
    } else if (imageFormat === 'jpeg' || imageFormat === 'jpg') {
      optimizedImage = await sharp(imageBuffer)
        .rotate() // Automatically rotate based on EXIF orientation
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({
          quality,
          progressive: true
        })
        .toBuffer();
    } else {
      optimizedImage = await sharp(imageBuffer)
        .rotate() // Automatically rotate based on EXIF orientation
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .png({
          quality,
          progressive: true
        })
        .toBuffer();
    }

    // Set appropriate headers
    res.setHeader('Content-Type', `image/${imageFormat}`);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
    res.setHeader('Vary', 'Accept'); // Vary by Accept header for format negotiation

    // Send the optimized image
    res.send(optimizedImage);

  } catch (error) {
    console.error('Image optimization error:', error);
    console.error('Error details:', {
      imageUrl: req.query.url,
      width: req.query.w,
      quality: req.query.q,
      format: req.query.format,
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    });
    res.status(500).json({ error: 'Failed to optimize image' });
  }
}
