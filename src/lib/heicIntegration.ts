import { convertHeicToJpeg, isHeicFile } from './imageConversion';

/**
 * Simple function to process any image file, converting HEIC if needed
 * Silent conversion - no progress tracking or user notifications
 */
export const processImageFile = async (file: File): Promise<File> => {
  // If it's not a HEIC file, return as-is
  if (!isHeicFile(file)) {
    return file;
  }

  // Convert HEIC to JPEG silently
  const result = await convertHeicToJpeg(file);
  return result.file;
};

/**
 * Hook for simple integration into existing components
 * Returns a function that processes files silently
 */
export const useHeicProcessor = () => {
  const processFile = async (file: File): Promise<File> => {
    return await processImageFile(file);
  };

  const processFiles = async (files: File[]): Promise<File[]> => {
    const processedFiles: File[] = [];
    
    for (const file of files) {
      const processed = await processFile(file);
      processedFiles.push(processed);
    }
    
    return processedFiles;
  };

  return {
    processFile,
    processFiles,
    isHeicFile
  };
};

/**
 * Example of how to integrate with existing file input
 */
export const integrateWithFileInput = (
  fileInput: HTMLInputElement,
  onFileReady: (file: File) => void
) => {
  const handleChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (file) {
      try {
        const processedFile = await processImageFile(file);
        onFileReady(processedFile);
      } catch (error) {
        console.error('Failed to process image:', error);
        // Handle error appropriately
      }
    }
  };

  fileInput.addEventListener('change', handleChange);
  
  // Return cleanup function
  return () => {
    fileInput.removeEventListener('change', handleChange);
  };
};
