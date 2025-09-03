import heic2any from 'heic2any';

export interface ConversionResult {
  file: File;
  originalType: string;
  convertedType: string;
  sizeReduction?: number; // Percentage reduction in file size
}

/**
 * Converts HEIC images to JPEG format for web compatibility
 * Silent conversion - no progress tracking or user notifications
 */
export const convertHeicToJpeg = async (file: File): Promise<ConversionResult> => {
  try {
    // Check if file is HEIC
    if (!isHeicFile(file)) {
      return {
        file,
        originalType: file.type,
        convertedType: file.type
      };
    }

    // Convert HEIC to JPEG silently
    const convertedBlob = await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.85 // Good balance of quality and file size
    }) as Blob;

    // Create new file from converted blob
    const convertedFile = new File([convertedBlob], 
      file.name.replace(/\.(heic|heif)$/i, '.jpg'), 
      { type: 'image/jpeg' }
    );

    // Calculate size reduction
    const sizeReduction = file.size > 0 
      ? ((file.size - convertedFile.size) / file.size) * 100 
      : 0;

    return {
      file: convertedFile,
      originalType: file.type,
      convertedType: 'image/jpeg',
      sizeReduction
    };

  } catch (error) {
    console.error('HEIC conversion failed:', error);
    throw new Error('Failed to convert HEIC image. Please use JPEG or PNG instead.');
  }
};

/**
 * Checks if a file is a HEIC image
 */
export const isHeicFile = (file: File): boolean => {
  const heicExtensions = ['.heic', '.heif'];
  const heicMimeTypes = ['image/heic', 'image/heif'];
  
  return (
    heicMimeTypes.includes(file.type) ||
    heicExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    )
  );
};

/**
 * Gets the appropriate file type for display
 */
export const getDisplayFileType = (file: File): string => {
  if (isHeicFile(file)) {
    return 'HEIC (will be converted to JPEG)';
  }
  return file.type || 'Unknown';
};

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validates if a file can be processed
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024; // 50MB limit
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ];

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${formatFileSize(maxSize)}.`
    };
  }

  if (!allowedTypes.includes(file.type) && !isHeicFile(file)) {
    return {
      valid: false,
      error: 'Unsupported file type. Please use JPEG, PNG, WebP, or HEIC.'
    };
  }

  return { valid: true };
};
