import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';

interface GalleryLightboxProps {
  images: Array<{
    id: number;
    src: string;
    alt: string;
    title?: string;
    description?: string;
  }>;
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  images,
  isOpen,
  currentIndex,
  onClose,
  onNavigate
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const currentImage = images[currentIndex];

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [currentIndex, isOpen]);

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onNavigate(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onNavigate(newIndex);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, isOpen]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentImage.src;
    link.download = currentImage.alt || 'gallery-image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentImage.title || 'Gallery Image',
          text: currentImage.description || 'Check out this image from our gallery',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
      >
        <ChevronLeft className="h-12 w-12" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
      >
        <ChevronRight className="h-12 w-12" />
      </button>

      {/* Main Image Container */}
      <div className="relative max-w-6xl max-h-full mx-4">
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}
          
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className={`max-w-full max-h-[80vh] object-contain transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>

        {/* Image Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              {currentImage.title && (
                <h3 className="text-xl font-normal mb-2">{currentImage.title}</h3>
              )}
              {currentImage.description && (
                <p className="text-gray-300">{currentImage.description}</p>
              )}
              <p className="text-sm text-gray-400 mt-2">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="text-white hover:text-gray-300 transition-colors"
                title="Share"
              >
                <Share2 className="h-6 w-6" />
              </button>
              <button
                onClick={handleDownload}
                className="text-white hover:text-gray-300 transition-colors"
                title="Download"
              >
                <Download className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onNavigate(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-white scale-110'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryLightbox;
