import { VercelRequest, VercelResponse } from "@vercel/node";
import sharp from "sharp";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { url, w = 800, q = 80, format = "webp" } = req.query;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    // Fetch the image
    const imageResponse = await fetch(url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Process the image
    let processedImage = sharp(imageBuffer).resize(parseInt(w as string));

    // Apply format conversion
    switch (format) {
      case "webp":
        processedImage = processedImage.webp({ quality: parseInt(q as string) });
        break;
      case "jpeg":
        processedImage = processedImage.jpeg({ quality: parseInt(q as string) });
        break;
      case "png":
        processedImage = processedImage.png({ quality: parseInt(q as string) });
        break;
      default:
        processedImage = processedImage.webp({ quality: parseInt(q as string) });
    }

    const optimizedBuffer = await processedImage.toBuffer();

    // Set cache headers
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Content-Type", `image/${format === "webp" ? "webp" : format}`);
    res.setHeader("Content-Length", optimizedBuffer.length.toString());

    res.status(200).send(optimizedBuffer);
  } catch (error: any) {
    console.error("Error optimizing image:", error);
    res.status(500).json({
      error: "Failed to optimize image",
      message: error.message,
    });
  }
}
