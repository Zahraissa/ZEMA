import React, { useState, useEffect, useRef } from 'react';
import { Play, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  description?: string;
  onClose?: () => void;
  size?: 'large' | 'small';
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  youtubeId, 
  title, 
  thumbnailUrl, 
  description,
  onClose,
  size = 'large'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create intersection observer for both large and small videos
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Auto-play main video when it becomes visible
          if (size === 'large' && !isPlaying) {
            setIsPlaying(true);
          }
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the video is visible
        rootMargin: '0px 0px -50px 0px' // Start a bit before the video is fully in view
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    // For main video, also check if autoplay was blocked
    if (size === 'large') {
      const checkAutoplayBlocked = setTimeout(() => {
        if (!isPlaying) {
          setAutoplayBlocked(true);
        }
      }, 3000); // Give more time for intersection observer to trigger
      
      // Fallback: if autoplay is blocked, try again after user interaction
      const handleUserInteraction = () => {
        if (!isPlaying) {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        }
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      };
      
      document.addEventListener('click', handleUserInteraction);
      document.addEventListener('keydown', handleUserInteraction);
      
      return () => {
        clearTimeout(checkAutoplayBlocked);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
        if (videoRef.current) {
          observer.unobserve(videoRef.current);
        }
      };
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [size, isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
    onClose?.();
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };



  if (!isPlaying) {
    if (size === 'small') {
      return (
        <>
          <div ref={videoRef} className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <div className="relative flex-shrink-0 w-20 h-12 bg-gray-200 rounded overflow-hidden">
              <img 
                src={thumbnailUrl || '/placeholder-video.jpg'} 
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-video.jpg';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <Button
                  onClick={handlePlay}
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto w-auto bg-transparent hover:bg-transparent"
                >
                  <Play className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-normal text-gray-900 line-clamp-2">
                {title}
              </h3>
              {description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
            <DialogContent className="max-w-4xl p-0">
              <div className="relative aspect-video">
                                 <Button
                   onClick={handleClose}
                   variant="ghost"
                   size="sm"
                   className="absolute top-2 right-2 z-10 bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
                 >
                   <X className="w-4 h-4" />
                 </Button>
                <iframe
                  key={`${youtubeId}-${isMuted}`}
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1`}
                  title={title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </DialogContent>
          </Dialog>
        </>
      );
    }

    return (
      <div ref={videoRef} className="relative bg-gray-200 rounded-lg overflow-hidden aspect-video cursor-pointer group">
        <img 
          src={thumbnailUrl || '/placeholder-video.jpg'} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-video.jpg';
          }}
        />
                 <div className="absolute inset-0 flex items-center justify-center">
           {autoplayBlocked ? (
             <Button
               onClick={handlePlay}
               className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
             >
               <Play className="w-8 h-8 text-white ml-1" />
             </Button>
           ) : isVisible ? (
             <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
               <Play className="w-8 h-8 text-white ml-1" />
             </div>
           ) : (
             <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center">
               <Play className="w-8 h-8 text-white ml-1" />
             </div>
           )}
         </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white text-sm font-normal bg-black bg-opacity-50 p-2 rounded">
            {title}
          </h3>
        </div>
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          {isVisible ? 'Auto-playing' : 'Will auto-play when visible'}
        </div>
      </div>
    );
  }

  return (
    <div ref={videoRef} className="relative bg-black rounded-lg overflow-hidden aspect-video">
       <div className="absolute top-2 right-2 z-10 flex space-x-2">
         <Button
           onClick={handleToggleMute}
           variant="ghost"
           size="sm"
           className="bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
         >
           {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
         </Button>
         <Button
           onClick={handleClose}
           variant="ghost"
           size="sm"
           className="bg-black bg-opacity-50 text-white hover:bg-black hover:bg-opacity-70"
         >
           <X className="w-4 h-4" />
         </Button>
       </div>
      <iframe
        key={`${youtubeId}-${isMuted}`}
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1`}
        title={title}
        className="w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;
