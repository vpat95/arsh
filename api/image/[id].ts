import { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

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
    const { id } = req.query;
    
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Image ID is required" });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.GOOGLE_TYPE,
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")
          .replace(/^"|"$/g, "")
          .trim(),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // Get the file metadata
    const file = await drive.files.get({
      fileId: id,
      fields: "id, name, mimeType, size",
    });

    if (!file.data) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Get the file content
    const response = await drive.files.get({
      fileId: id,
      alt: "media",
    }, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data as ArrayBuffer);

    // Set appropriate headers
    res.setHeader("Content-Type", file.data.mimeType || "image/jpeg");
    res.setHeader("Content-Length", buffer.length.toString());
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Send the image
    res.status(200).send(buffer);

  } catch (error: any) {
    console.error("Error serving image:", error);
    
    if (error.code === 404) {
      return res.status(404).json({ error: "Image not found" });
    }
    
    res.status(500).json({
      error: "Failed to serve image",
      message: error.message,
    });
  }
}
