require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking environment variables...');
console.log('VITE_GOOGLE_TYPE:', process.env.VITE_GOOGLE_TYPE ? '✅ Set' : '❌ Not set');
console.log('VITE_GOOGLE_PROJECT_ID:', process.env.VITE_GOOGLE_PROJECT_ID ? '✅ Set' : '❌ Not set');
console.log('VITE_GOOGLE_CLIENT_EMAIL:', process.env.VITE_GOOGLE_CLIENT_EMAIL ? '✅ Set' : '❌ Not set');
console.log('VITE_GOOGLE_DRIVE_FOLDER_ID:', process.env.VITE_GOOGLE_DRIVE_FOLDER_ID ? '✅ Set' : '❌ Not set');

if (process.env.VITE_GOOGLE_CLIENT_EMAIL) {
    console.log('📧 Client Email:', process.env.VITE_GOOGLE_CLIENT_EMAIL);
}
if (process.env.VITE_GOOGLE_DRIVE_FOLDER_ID) {
    console.log('📁 Folder ID:', process.env.VITE_GOOGLE_DRIVE_FOLDER_ID);
}
