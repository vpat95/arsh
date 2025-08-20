const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function testGalleryAPI() {
  try {
    console.log('🔍 Testing Google Drive API connection...');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: process.env.VITE_GOOGLE_TYPE,
        project_id: process.env.VITE_GOOGLE_PROJECT_ID,
        private_key_id: process.env.VITE_GOOGLE_PROJECT_KEY_ID,
        private_key: process.env.VITE_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n").replace(/^"|"$/g, "").trim(),
        client_email: process.env.VITE_GOOGLE_CLIENT_EMAIL,
        client_id: process.env.VITE_GOOGLE_CLIENT_ID,
        universe_domain: process.env.VITE_GOOGLE_UNIVERSE_DOMAIN,
      },
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });
    const folderId = process.env.VITE_GOOGLE_DRIVE_FOLDER_ID;

    console.log('📁 Folder ID:', folderId);
    console.log('🔑 Client Email:', process.env.VITE_GOOGLE_CLIENT_EMAIL);

    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "files(id, name)",
    });

    const files = response.data.files || [];
    console.log('✅ Success! Found', files.length, 'images:');

    files.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name} (ID: ${file.id})`);
    });

    const images = files.map((file) => ({
      id: file.id,
      name: file.name,
      url: `https://drive.google.com/uc?id=${file.id}`,
    }));

    console.log('\n📋 API Response:');
    console.log(JSON.stringify({ images }, null, 2));

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Full error:', err);
  }
}

testGalleryAPI();
