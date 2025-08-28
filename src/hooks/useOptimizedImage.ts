import { getBestFormat, getOptimizedImageUrl } from '@/lib/imageOptimization';
import { useEffect, useState } from 'react';

export const useOptimizedImage = (originalUrl: string, options: {
  width?: number;
  quality?: number;
  mobile?: boolean;
} = {}) => {
  const [optimizedUrl, setOptimizedUrl] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (originalUrl) {
      // For local images, use them directly without optimization
      if (originalUrl.includes("assets/") || originalUrl.startsWith("/src/")) {
        setOptimizedUrl(originalUrl);
        setIsLoading(false);
        return;
      }

      // For external images, use optimization
      const format = getBestFormat();
      const optimizedUrl = getOptimizedImageUrl(originalUrl, {
        ...options,
        format,
        mobile: isMobile
      });
      
      setOptimizedUrl(optimizedUrl);
      setIsLoading(false);
    }
  }, [originalUrl, isMobile, options]);

  return {
    optimizedUrl,
    isMobile,
    isLoading,
    format: getBestFormat()
  };
};
