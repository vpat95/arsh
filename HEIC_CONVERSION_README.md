# HEIC Image Conversion System

This system automatically converts HEIC images from iPhones and other devices to web-compatible JPEG format on the client side. **Silent conversion - no user notifications or progress tracking.**

## 🚀 Features

- **Automatic HEIC Detection**: Identifies HEIC/HEIF files automatically
- **Silent Conversion**: Converts images in the browser without user interruptions
- **Error Handling**: Graceful fallbacks and user-friendly error messages
- **Drag & Drop Support**: Modern file upload interface
- **File Validation**: Size and type validation with helpful error messages
- **Responsive Design**: Works on all devices and screen sizes

## 📦 Installation

The required dependencies are already installed:

```bash
npm install heic2any
```

## 🎯 Quick Start

### 1. Basic Usage

```tsx
import { processImageFile } from '@/lib/heicIntegration';

const handleFileUpload = async (file: File) => {
  try {
    const processedFile = await processImageFile(file);
    // processedFile is now a JPEG and ready for upload
    console.log('File ready:', processedFile);
  } catch (error) {
    console.error('Conversion failed:', error);
  }
};
```

### 2. Using the Hook

```tsx
import { useHeicProcessor } from '@/lib/heicIntegration';

const MyComponent = () => {
  const { processFile, isHeicFile } = useHeicProcessor();

  const handleFileSelect = async (file: File) => {
    if (isHeicFile(file)) {
      console.log('HEIC file detected, converting silently...');
    }
    
    const processedFile = await processFile(file);
    // Use processedFile...
  };

  return (
    <input 
      type="file" 
      accept="image/*,.heic,.heif" 
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
      }}
    />
  );
};
```

## 🧩 Components

### ImageUploadWithConversion

A complete upload component with drag & drop support:

```tsx
import ImageUploadWithConversion from '@/components/ImageUploadWithConversion';

const MyPage = () => {
  const handleImageReady = (file: File) => {
    console.log('Image ready:', file);
    // Upload to server or process further
  };

  return (
    <ImageUploadWithConversion onImageReady={handleImageReady} />
  );
};
```

## 🔧 Configuration

### Quality Settings

Adjust JPEG quality in `src/lib/imageConversion.ts`:

```tsx
const convertedBlob = await heic2any({
  blob: file,
  toType: 'image/jpeg',
  quality: 0.85 // Adjust from 0.1 to 1.0
});
```

### File Size Limits

Modify the maximum file size in `validateImageFile`:

```tsx
const maxSize = 50 * 1024 * 1024; // 50MB limit
```

### Supported Formats

Add or remove supported formats in `validateImageFile`:

```tsx
const allowedTypes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif'
];
```

## 📱 Browser Support

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile browsers**: ✅ Full support

## ⚡ Performance Considerations

### File Size Impact
- **Small HEIC files (< 5MB)**: Convert in ~1-3 seconds
- **Medium HEIC files (5-20MB)**: Convert in ~3-8 seconds
- **Large HEIC files (20MB+)**: Convert in ~8-15 seconds

### Device Performance
- **Modern devices**: Fast conversion, minimal impact
- **Older devices**: Slower conversion, may cause brief UI freezing
- **Mobile devices**: Higher battery usage during conversion

### Memory Usage
- **Temporary memory**: ~2x file size during conversion
- **Cleanup**: Automatic memory cleanup after conversion

## 🚨 Error Handling

The system handles various error scenarios:

```tsx
try {
  const processedFile = await processImageFile(file);
} catch (error) {
  if (error.message.includes('Failed to convert HEIC')) {
    // Show user-friendly error message
    showError('Please use JPEG or PNG instead');
  } else {
    // Handle other errors
    showError('Upload failed. Please try again.');
  }
}
```

## 🔄 Integration Examples

### With Form Upload

```tsx
const handleFormSubmit = async (formData: FormData) => {
  const fileInput = document.getElementById('image') as HTMLInputElement;
  const file = fileInput.files?.[0];
  
  if (file) {
    const processedFile = await processImageFile(file);
    formData.set('image', processedFile);
    
    // Submit form with converted file
    await submitForm(formData);
  }
};
```

### With Drag & Drop

```tsx
const handleDrop = async (e: React.DragEvent) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  
  if (file) {
    const processedFile = await processImageFile(file);
    setSelectedFile(processedFile);
  }
};
```

### With Multiple Files

```tsx
const handleMultipleFiles = async (files: FileList) => {
  const { processFiles } = useHeicProcessor();
  
  const fileArray = Array.from(files);
  const processedFiles = await processFiles(fileArray);
  
  // All files are now web-compatible
  uploadMultipleFiles(processedFiles);
};
```

## 🧪 Testing

### Demo Page

Visit `/heic-demo` to test the conversion system with sample HEIC files.

### Test Files

You can test with:
- HEIC files from iPhones
- HEIF files from other devices
- Regular JPEG/PNG files (should pass through unchanged)

## 🐛 Troubleshooting

### Common Issues

1. **Conversion fails**: Check file size and browser compatibility
2. **Slow conversion**: Large files take longer on older devices
3. **Memory errors**: Very large files may exceed browser memory limits
4. **Browser freezing**: Consider adding a loading state for large files

### Debug Mode

Enable debug logging in the browser console:

```tsx
// Add to your component for debugging
useEffect(() => {
  console.log('HEIC conversion system loaded');
}, []);
```

## 📈 Future Enhancements

- **Batch processing**: Convert multiple HEIC files simultaneously
- **Format options**: Support for WebP and AVIF output
- **Compression settings**: User-configurable quality settings
- **Background processing**: Web Worker support for better performance
- **Caching**: Cache converted files to avoid re-conversion

## 🤝 Contributing

To add new features or fix issues:

1. Update the conversion logic in `src/lib/imageConversion.ts`
2. Modify the UI components as needed
3. Update this documentation
4. Test with various file types and sizes

## 📄 License

This system is part of your project and follows the same license terms.
