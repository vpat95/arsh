const fs = require('fs');
const path = require('path');

// Test the development image loading logic
const getDevImages = (category) => {
  const testImagesPath = path.join(process.cwd(), "src", "assets", "test-images");
  
  try {
    console.log('Looking for images in:', testImagesPath);
    const files = fs.readdirSync(testImagesPath);
    console.log('All files found:', files);
    
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );
    
    console.log('Image files found:', imageFiles);
    
    return imageFiles.map((file, index) => ({
      id: `dev-${index}`,
      name: file,
      url: `/src/assets/test-images/${file}`,
      category: category,
    }));
  } catch (error) {
    console.error("Error reading test images:", error);
    return [];
  }
};

console.log('Testing development image loading...');
const images = getDevImages('home');
console.log('Generated images:', images);
