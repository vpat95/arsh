import { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import { google } from "googleapis";
import path from "path";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { id } = req.query;
    const fileId = Array.isArray(id) ? id[0] : id;

    if (!fileId) {
      return res.status(400).json({ error: "File ID is required" });
    }

    // Check if we're in development mode
    const isDevMode =
      !process.env.GOOGLE_TYPE || process.env.NODE_ENV === "development";

    if (isDevMode && fileId.startsWith("dev-")) {
      // Serve local test images in development
      const testImagesPath = path.join(
        process.cwd(),
        "src",
        "assets",
        "test-images"
      );
      const files = fs.readdirSync(testImagesPath);
      const imageFiles = files.filter((file) =>
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
      );

      const index = parseInt(fileId.replace("dev-", ""));
      if (index >= 0 && index < imageFiles.length) {
        const imagePath = path.join(testImagesPath, imageFiles[index]);
        const imageBuffer = fs.readFileSync(imagePath);

        // Determine MIME type from file extension
        const ext = path.extname(imageFiles[index]).toLowerCase();
        const mimeType =
          {
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
            ".gif": "image/gif",
            ".webp": "image/webp",
          }[ext] || "image/jpeg";

        res.setHeader("Content-Type", mimeType);
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.send(imageBuffer);
        return;
      }
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

    // Get the file metadata first to check the MIME type
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: "mimeType,name",
    });

    // Get the file content
    const file = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      {
        responseType: "stream",
      }
    );

    // Set appropriate headers based on MIME type
    const mimeType = fileMetadata.data.mimeType || "image/jpeg";
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Cache-Control", "public, max-age=3600");

    // Pipe the image stream to the response
    file.data.pipe(res);
  } catch (err: any) {
    console.error("Error fetching image:", err.message);
    res.status(500).json({ error: "Failed to fetch image" });
  }
}
