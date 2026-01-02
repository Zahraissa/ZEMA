import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, ArrowRight } from "lucide-react";
import leaderPortrait from "@/assets/leader-portrait.jpg";
import viongozi from "@/assets/voingozi.jpg";
import wavuvi from "@/assets/wavuvi.jpg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState, useEffect } from "react";
import { publicAPI, Slider } from "@/services/api";
import { STORAGE_BASE_URL } from "@/config";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchSliders();
  }, []);

  // Refresh sliders when page becomes visible (e.g., after returning from CMS)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('HeroSection: Page became visible, refreshing sliders')
        fetchSliders(true) // Force refresh with cache busting
      }
    }
    
    const handleFocus = () => {
      console.log('HeroSection: Window focused, refreshing sliders')
      fetchSliders(true) // Force refresh with cache busting
    }
    
    // Also listen for storage events (when data changes in another tab/window)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'slidersUpdated' || e.key === null) {
        console.log('HeroSection: Storage event detected, refreshing sliders')
        fetchSliders(true)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const fetchSliders = async (forceRefresh = false) => {
    try {
      const response = await publicAPI.getActiveSliders();
      console.log('Slider API Response:', response);
      if (response.success) {
        console.log('Sliders data:', response.data);
        console.log('Number of active sliders:', response.data?.length || 0);
        
        // Always update sliders, even if empty
        setSliders(response.data || []);
        
        if (forceRefresh) {
          console.log('HeroSection: Force refresh completed, sliders updated');
          // Force a re-render by updating state multiple times with fresh data
          setTimeout(() => {
            setSliders([...response.data || []]);
          }, 100);
          setTimeout(() => {
            setSliders([...response.data || []]);
          }, 300);
          setTimeout(() => {
            setSliders([...response.data || []]);
          }, 500);
        }
      } else {
        console.warn('Slider API returned unsuccessful response:', response);
        setSliders([]);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
      setSliders([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback data if API fails or no sliders
  const fallbackSliders = [
    {
      id: 1,
      title: "Pongezi Kwa Makamu wa Pili wa Rais wa Serikali ya Mapinduzi ya Zanzibar",
      description:
        " Pongezi Kwa Mhe. Hemed Suleiman Abdulla kuchaguliwa tena Makamu wa Pili wa Rais wa Serikali ya Mapinduzi ya Zanzibar.",
      year: "2025-2030",
      badge: "Pongezi Kwa Mhe. Hemed Suleiman Abdulla",
      button_text: "Soma Zaidi",
      button_link: "/news",
      has_video: true,
      order: 1,
      status: "active",
      is_active: true,
      created_at: "",
      updated_at: "",
      image_path: wavuvi,
    },
    {
      id: 2,
      title: "Pongezi Kwa Makamu wa Pili wa Rais wa Serikali ya Mapinduzi ya Zanzibar",
      description:
        "Pongezi Kwa Mhe. Hemed Suleiman Abdulla kuchaguliwa tena Makamu wa Pili wa Rais wa Serikali ya Mapinduzi ya Zanzibar.",
      year: "2025-2030",
      badge: "Pongezi Kwa Mhe. Hemed Suleiman Abdulla",
      button_text: "Jifunze Zaidi",
      button_link: "#",
      has_video: false,
      order: 2,
      status: "active",
      is_active: true,
      created_at: "",
      updated_at: "",
      image_path: viongozi,
    },
  ];

  const displaySliders = sliders.length > 0 ? sliders : fallbackSliders;

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) {
      console.log('No image path provided, using fallback image');
      return viongozi;
    }
    
    // Add ultra-aggressive cache-busting parameters to force refresh
    const timestamp = new Date().getTime();
    const random = Math.random();
    const fullUrl = `${STORAGE_BASE_URL}${imagePath}?t=${timestamp}&v=${random}&refresh=true&nocache=${Date.now()}&force=${Math.random()}&bust=${Date.now()}&cache=${Math.random()}`;
    console.log('Constructed image URL:', fullUrl);
    return fullUrl;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, slide: Slider) => {
    console.error('Image failed to load:', e.currentTarget.src);
    console.log('Slide data:', slide);
    // Fallback to leader portrait if image fails to load
    e.currentTarget.src = wavuvi;
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>, slide: Slider) => {
    console.log('Image loaded successfully:', e.currentTarget.src);
    console.log('Slide:', slide.title);
  };

  if (loading) {
    return (
      <section className="relative bg-gradient-hero min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  return (
    <section
      className="relative bg-gradient-hero min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden"
      style={{ backgroundImage: "url(Zanzibar.jpg)" }}
    >

      {/* Enhanced Animated Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0 bg-repeat animate-float-slow"
          style={{
            backgroundImage: `url(voingozi.jpg)`,
          }}
        ></div>
      </div>

      {/* Enhanced Animated Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 via-green-700/50 to-white/30 animate-gradient-shift"></div>

      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 relative z-10">
        <Carousel
          className="w-full group"
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          onMouseEnter={() => setShowArrows(true)}
          onMouseLeave={() => setShowArrows(false)}
        >
          <CarouselContent>
            {displaySliders.map((slide, index) => (
              <CarouselItem key={slide.id || index}>
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Content */}
                  <div
                    className={`text-center lg:text-left order-2 lg:order-1 transition-all duration-1500 ease-out ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    }`}
                  >
                    {/*<div className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-normal text-white mb-4 sm:mb-6 animate-float-gentle backdrop-blur-sm">*/}
                    {/*  <span className="flex h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full bg-white mr-2 animate-ping-slow"></span>*/}
                    {/*  {slide.badge}*/}
                    {/*</div>*/}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-white mb-4 sm:mb-6 leading-tight animate-slide-in-left gradient-text">
                      {slide.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-slide-in-left-delay">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-slide-in-left-delay-2">
                      {slide.button_text && (
                        <Button
                          size="lg"
                          className="bg-black text-white hover:bg-gray-800 shadow-xl transition-all duration-700 transform hover:scale-110 hover:rotate-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 animate-float-gentle hover:shadow-2xl"
                          onClick={() => {
                            if (slide.button_link) {
                              window.location.href = slide.button_link;
                            }
                          }}
                        >
                          {slide.button_text}
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 animate-bounce-slow" />
                        </Button>
                      )}
                      {slide.has_video && (
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-orange bg-orange text-white hover:bg-white hover:text-blue-600 shadow-xl transition-all duration-700 transform hover:scale-110 hover:-rotate-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm hover:shadow-2xl"
                        >
                          <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-pulse-slow" />
                          Tazama Video
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Leader Image */}
                  <div
                    className={`relative order-1 lg:order-2 transition-all duration-1500 ease-out delay-500 ${
                      isVisible
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-12"
                    }`}
                  >
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                      <img
                        src={getImageUrl(slide.image_path)}
                        alt={slide.title}
                        className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] object-cover"
                        onError={(e) => handleImageError(e, slide)}
                        onLoad={(e) => handleImageLoad(e, slide)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-blue-700/15 to-white/10"></div>
                    </div>

                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className={`left-2 sm:left-4 text-white bg-blue-900/80 border-white/30 hover:bg-blue-800 hover:text-white shadow-xl h-8 w-8 sm:h-10 sm:w-10 backdrop-blur-sm transition-all duration-300 ${
              showArrows
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          />
          <CarouselNext
            className={`right-2 sm:right-4 text-white bg-blue-900/80 border-white/30 hover:bg-blue-800 hover:text-white shadow-xl h-8 w-8 sm:h-10 sm:w-10 backdrop-blur-sm transition-all duration-300 ${
              showArrows
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}

          />
        </Carousel>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-float-gentle">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/40 rounded-full flex justify-center animate-pulse-slow backdrop-blur-sm">
          <div className="w-1 h-2 sm:h-3 bg-white/80 rounded-full mt-1 sm:mt-2 animate-ping-slow"></div>
        </div>
        <div className="text-white text-xs mt-2 animate-pulse-slow font-normal">
          Scroll Down
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

