import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useImageConversion } from "@/hooks/useImageConversion";
import {
  formatFileSize,
  getDisplayFileType,
  isHeicFile,
} from "@/lib/imageConversion";
import {
  AlertCircle,
  FileImage,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";

interface ImageUploadWithConversionProps {
  onImageReady?: (file: File) => void;
  className?: string;
}

const ImageUploadWithConversion = ({
  onImageReady,
  className = "",
}: ImageUploadWithConversionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isConverting, convertImage, resetConversion, validateFile } =
    useImageConversion();

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    setSelectedFile(file);

    // If it's a HEIC file, convert it silently
    if (isHeicFile(file)) {
      try {
        const result = await convertImage(file);
        setSelectedFile(result.file);
        onImageReady?.(result.file);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Conversion failed");
        setSelectedFile(null);
      }
    } else {
      // Non-HEIC file, ready to use
      onImageReady?.(file);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setError(null);
    resetConversion();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ImageIcon className="w-5 h-5" />
            <span>Image Upload with HEIC Support</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Drag & Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your image here, or{" "}
                    <button
                      type="button"
                      onClick={openFileDialog}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Supports JPEG, PNG, WebP, and HEIC files
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    HEIC files will be automatically converted to JPEG
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <FileImage className="w-12 h-12 text-green-500 mx-auto" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedFile.name}
                  </h4>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Badge variant="outline">
                      {getDisplayFileType(selectedFile)}
                    </Badge>
                    <Badge variant="secondary">
                      {formatFileSize(selectedFile.size)}
                    </Badge>
                  </div>
                  <Button
                    onClick={resetSelection}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Choose Different File
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* File Info */}
          {selectedFile && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h5 className="font-medium text-gray-900">File Information</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Name:</span>
                  <p className="font-medium">{selectedFile.name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Size:</span>
                  <p className="font-medium">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium">
                    {getDisplayFileType(selectedFile)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p className="font-medium">
                    {isConverting ? "Converting..." : "Ready"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ImageUploadWithConversion;
