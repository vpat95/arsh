import { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

// Map categories to folder IDs
const FOLDER_MAP = {
  // Homepage gallery (main gallery only)
  home: [process.env.GOOGLE_DRIVE_MAIN_GALLERY],

  // Projects page (all categories)
  all: [
    process.env.GOOGLE_DRIVE_KITCHEN_PROJECTS,
    process.env.GOOGLE_DRIVE_BATHROOM_PROJECTS,
    process.env.GOOGLE_DRIVE_EXTERIOR_PROJECTS,
    process.env.GOOGLE_DRIVE_INTERIOR_PROJECTS,
    process.env.GOOGLE_DRIVE_HANDYMAN_PROJECTS,
    process.env.GOOGLE_DRIVE_FLOORING_PROJECTS,
    process.env.GOOGLE_DRIVE_COMMERCIAL_PROJECTS,
  ],
  kitchen: [process.env.GOOGLE_DRIVE_KITCHEN_PROJECTS],
  bathroom: [process.env.GOOGLE_DRIVE_BATHROOM_PROJECTS],
  exterior: [process.env.GOOGLE_DRIVE_EXTERIOR_PROJECTS],
  interior: [process.env.GOOGLE_DRIVE_INTERIOR_PROJECTS],
  handyman: [process.env.GOOGLE_DRIVE_HANDYMAN_PROJECTS],
  flooring: [process.env.GOOGLE_DRIVE_FLOORING_PROJECTS],
  commercial: [process.env.GOOGLE_DRIVE_COMMERCIAL_PROJECTS],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { category } = req.query;
    const categoryStr = Array.isArray(category)
      ? category[0]
      : category || "all";

    const folderIds = FOLDER_MAP[categoryStr as keyof typeof FOLDER_MAP];

    if (!folderIds || folderIds.length === 0) {
      return res.status(400).json({ error: "Invalid category" });
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

    // Query for images in specified folders
    const folderQuery = folderIds
      .filter(Boolean)
      .map((id) => `'${id}' in parents`)
      .join(" or ");
    const query = `(${folderQuery}) and mimeType contains 'image/' and trashed = false`;

    const response = await drive.files.list({
      q: query,
      fields: "files(id, name, parents)",
    });

    const files = response.data.files || [];
    const images = files.map((file) => ({
      id: file.id,
      name: file.name,
      url: `https://drive.google.com/uc?id=${file.id}`,
      category: categoryStr,
    }));

    res.status(200).json({ images, category: categoryStr });
  } catch (err: any) {
    console.error("Error fetching gallery:", err.message);
    res.status(500).json({ error: "Failed to fetch images" });
  }
}
