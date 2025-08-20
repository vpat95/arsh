require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing private key format...');

const privateKey = process.env.VITE_GOOGLE_PRIVATE_KEY;
console.log('Private key length:', privateKey ? privateKey.length : 'undefined');
console.log('Contains \\n:', privateKey ? privateKey.includes('\\n') : 'undefined');

const fixedKey = privateKey ? privateKey.replace(/\\n/g, "\n") : null;
console.log('Fixed key length:', fixedKey ? fixedKey.length : 'undefined');
console.log('Fixed key starts with:', fixedKey ? fixedKey.substring(0, 50) + '...' : 'undefined');
console.log('Fixed key ends with:', fixedKey ? '...' + fixedKey.substring(fixedKey.length - 50) : 'undefined');

// Check if it's a valid PEM format
if (fixedKey) {
    console.log('Is valid PEM format:', fixedKey.startsWith('-----BEGIN PRIVATE KEY-----') && fixedKey.endsWith('-----END PRIVATE KEY-----'));
}
