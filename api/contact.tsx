import { VercelRequest, VercelResponse } from "@vercel/node";

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

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { firstName, lastName, email, phone, projectDetails } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        error: "Missing required fields: firstName, lastName, email, phone",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // For now, we'll use a simple email service
    // You can replace this with Resend, SendGrid, or any other email service
    const emailContent = `
New Estimate Request from Arsh Contractors Website

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}
Project Details: ${projectDetails || "No details provided"}

Submitted on: ${new Date().toLocaleString()}
    `;

    // Log the email content (for development)
    console.log("Email content:", emailContent);

    // TODO: Replace with actual email service
    // Example with Resend:
    // const { Resend } = require('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: 'your-email@example.com',
    //   subject: 'New Estimate Request - Arsh Contractors',
    //   text: emailContent,
    // });

    // For now, we'll just return success
    // In production, you should implement actual email sending
    res.status(200).json({
      success: true,
      message:
        "Estimate request submitted successfully! We'll contact you soon.",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    res.status(500).json({
      error: "Failed to submit estimate request. Please try again.",
    });
  }
}
