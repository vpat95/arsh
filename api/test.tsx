import { VercelRequest, VercelResponse } from "@vercel/node";

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Handle CORS
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
    // Simple test response
    res.status(200).json({
      success: true,
      message: "Test API endpoint working",
      timestamp: new Date().toISOString(),
      environment: {
        hasGoogleType: !!process.env.GOOGLE_TYPE,
        hasGoogleProjectId: !!process.env.GOOGLE_PROJECT_ID,
        hasGoogleClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
        hasGoogleDriveMainGallery: !!process.env.GOOGLE_DRIVE_MAIN_GALLERY,
      },
    });
  } catch (error: any) {
    console.error("Error in test API:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Unknown error",
    });
  }
};

module.exports = handler;
