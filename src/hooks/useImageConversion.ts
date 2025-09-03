import {
    ConversionResult,
    convertHeicToJpeg,
    validateImageFile
} from '@/lib/imageConversion';
import { useCallback, useState } from 'react';

interface UseImageConversionReturn {
  isConverting: boolean;
  convertImage: (file: File) => Promise<ConversionResult>;
  resetConversion: () => void;
  validateFile: (file: File) => { valid: boolean; error?: string };
}

export const useImageConversion = (): UseImageConversionReturn => {
  const [isConverting, setIsConverting] = useState(false);

  const convertImage = useCallback(async (file: File): Promise<ConversionResult> => {
    setIsConverting(true);
    
    try {
      const result = await convertHeicToJpeg(file);
      return result;
    } finally {
      setIsConverting(false);
    }
  }, []);

  const resetConversion = useCallback(() => {
    setIsConverting(false);
  }, []);

  const validateFile = useCallback((file: File) => {
    return validateImageFile(file);
  }, []);

  return {
    isConverting,
    convertImage,
    resetConversion,
    validateFile
  };
};
