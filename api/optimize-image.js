import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');
        const width = parseInt(searchParams.get('w') || '800');
        const quality = parseInt(searchParams.get('q') || '80');
        const format = searchParams.get('format') || 'webp';

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
        }

        // Validate parameters
        if (width < 1 || width > 4000) {
            return NextResponse.json({ error: 'Width must be between 1 and 4000' }, { status: 400 });
        }

        if (quality < 1 || quality > 100) {
            return NextResponse.json({ error: 'Quality must be between 1 and 100' }, { status: 400 });
        }

        if (!['webp', 'jpeg', 'jpg', 'png'].includes(format)) {
            return NextResponse.json({ error: 'Format must be webp, jpeg, jpg, or png' }, { status: 400 });
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
                return NextResponse.json({ error: 'Local image not found' }, { status: 404 });
            }
        }

        // Optimize the image
        let optimizedImage;

        if (format === 'webp') {
            optimizedImage = await sharp(imageBuffer)
                .resize(width, null, {
                    withoutEnlargement: true,
                    fit: 'inside'
                })
                .webp({
                    quality,
                    effort: 6 // Higher effort for better compression
                })
                .toBuffer();
        } else if (format === 'jpeg' || format === 'jpg') {
            optimizedImage = await sharp(imageBuffer)
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

        // Return optimized image with appropriate headers
        const response = new NextResponse(optimizedImage);
        response.headers.set('Content-Type', `image/${format}`);
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable'); // Cache for 1 year
        response.headers.set('Vary', 'Accept'); // Vary by Accept header for format negotiation

        return response;

    } catch (error) {
        console.error('Image optimization error:', error);
        console.error('Error details:', {
            imageUrl,
            width,
            quality,
            format,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        return NextResponse.json(
            { error: 'Failed to optimize image' },
            { status: 500 }
        );
    }
}
