import { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Handle CORS - specifically allow arshcontractors.com
  const allowedOrigins = [
    "https://www.arshcontractors.com",
    "https://arshcontractors.com",
    "https://arsh-theta.vercel.app",
  ];

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

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
    // Use the main gallery folder ID
    const mainGalleryFolderId = process.env.GOOGLE_DRIVE_MAIN_GALLERY;

    if (!mainGalleryFolderId) {
      console.error("GOOGLE_DRIVE_MAIN_GALLERY environment variable not set");
      return res.status(500).json({
        error: "Gallery configuration error",
        images: [],
        total: 0,
      });
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

    // Query for images in the main gallery folder (excluding HEIC)
    const query = `'${mainGalleryFolderId}' in parents and mimeType contains 'image/' and not mimeType contains 'heic' and trashed = false`;

    const response = await drive.files.list({
      q: query,
      fields:
        "files(id, name, parents, webContentLink, createdTime, modifiedTime)",
      orderBy: "createdTime desc",
      pageSize: 20, // Limit to 20 images for homepage
    });

    const files = response.data.files || [];
    console.log(`Found ${files.length} images in main gallery`);

    const images = files.map((file) => ({
      id: file.id,
      name: file.name,
      url: `https://arsh-theta.vercel.app/api/image/${file.id}`,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
    }));

    res.status(200).json({
      success: true,
      message: "Gallery home endpoint working",
      images,
      total: images.length,
    });
  } catch (error: any) {
    console.error("Error in gallery home API:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Unknown error",
      images: [],
      total: 0,
    });
  }
};

module.exports = handler;
