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
  // Handle CORS - essential for mobile compatibility
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { category } = req.query;
  const categoryStr = Array.isArray(category) ? category[0] : category || "all";

  // Debug: Log the request
  console.log("API Request:", {
    method: req.method,
    url: req.url,
    category: categoryStr,
    hasGoogleType: !!process.env.GOOGLE_TYPE,
    hasGoogleProjectId: !!process.env.GOOGLE_PROJECT_ID,
    hasGoogleClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
    hasGoogleDriveMainGallery: !!process.env.GOOGLE_DRIVE_MAIN_GALLERY,
    hasKitchenProjects: !!process.env.GOOGLE_DRIVE_KITCHEN_PROJECTS,
    hasBathroomProjects: !!process.env.GOOGLE_DRIVE_BATHROOM_PROJECTS,
    hasExteriorProjects: !!process.env.GOOGLE_DRIVE_EXTERIOR_PROJECTS,
    hasCommercialProjects: !!process.env.GOOGLE_DRIVE_COMMERCIAL_PROJECTS,
    hasHandymanProjects: !!process.env.GOOGLE_DRIVE_HANDYMAN_PROJECTS,
    hasFlooringProjects: !!process.env.GOOGLE_DRIVE_FLOORING_PROJECTS,
  });

  try {
    const folderIds = FOLDER_MAP[categoryStr];
    console.log("Folder IDs for category:", categoryStr, ":", folderIds);

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

    // Query for images in specified folders (excluding HEIC)
    const folderQuery = folderIds
      .filter(Boolean)
      .map((id) => `'${id}' in parents`)
      .join(" or ");

    const query = `(${folderQuery}) and mimeType contains 'image/' and not mimeType contains 'heic' and trashed = false`;

    const response = await drive.files.list({
      q: query,
      fields: "files(id, name, parents, webContentLink)",
    });

    const files = response.data.files || [];
    console.log("Found files:", files.length);
    console.log("Sample file:", files[0]);
    console.log("Query used:", query);
    console.log("Folder IDs being searched:", folderIds);

    const images = files.map((file) => ({
      id: file.id,
      name: file.name,
      url: `https://arsh-theta.vercel.app/api/image/${file.id}`,
      category: categoryStr,
    }));

    console.log("Generated images:", images.length);
    console.log("Sample image URL:", images[0]?.url);

    res.status(200).json({ images, category: categoryStr });
  } catch (error: any) {
    console.error(`Error in ${categoryStr} gallery API:`, error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Unknown error",
      images: [],
      category: categoryStr,
    });
  }
}
