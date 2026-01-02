import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Lock, Brain, Code, PenTool, BarChart3, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { publicAPI } from "@/services/api";
import type { WebsiteService } from "@/services/api";

const Website = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [services, setServices] = useState<WebsiteService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Icon mapping
  const iconMap: { [key: string]: React.ReactNode } = {
    'Lock': <Lock className="h-12 w-12" />,
    'Brain': <Brain className="h-12 w-12" />,
    'Code': <Code className="h-12 w-12" />,
    'PenTool': <PenTool className="h-12 w-12" />,
    'BarChart3': <BarChart3 className="h-12 w-12" />,
    'TrendingUp': <TrendingUp className="h-12 w-12" />
  };

  // Fetch website services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await publicAPI.getActiveWebsiteServices();
        
        if (response.success) {
          setServices(response.data);
        } else {
          setError('Failed to load website services');
        }
      } catch (err) {
        console.error('Error fetching website services:', err);
        setError('Failed to load website services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16"
      style={{backgroundImage: 'url(banner.avif)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-normal mb-4">Website Services</h1>
            <nav className="flex justify-center items-center space-x-2 text-sm">
              <a href="/" className="hover:text-blue-200 transition-colors">Home</a>
              <span>/</span>
              <span>Website</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Services Flipbox Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading website services...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 mb-4">
                <Code className="h-16 w-16 mx-auto mb-2" />
                <p className="text-lg font-normal">Error loading services</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
          )}

          {/* Services Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative h-80 perspective-1000"
                  onMouseEnter={() => setHoveredCard(service.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Flip Card Container */}
                  <div className={`flip-card ${hoveredCard === service.id ? 'flipped' : ''}`}>
                    
                    {/* Front Side */}
                    <div className="flip-card-front bg-white shadow-lg p-8 flex flex-col items-center justify-center text-center">
                      <div className="text-blue-600 mb-6">
                        {iconMap[service.front_icon || 'Code'] || <Code className="h-12 w-12" />}
                      </div>
                      <h3 className="text-xl font-normal text-gray-900 mb-4">
                        {service.front_title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {service.front_description}
                      </p>
                    </div>

                    {/* Back Side */}
                    <div 
                      className="flip-card-back shadow-lg p-8 flex flex-col items-center justify-center text-center text-white"
                      style={{
                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${service.back_image ? `http://localhost:8000/storage/${service.back_image}` : '/assets/img/service/service_2_1.jpg'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <h3 className="text-xl font-normal mb-4">
                        {service.back_title}
                      </h3>
                      <p className="text-gray-200 leading-relaxed mb-6">
                        {service.back_description}
                      </p>
                      <Link
                        to={service.link || '#'}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-normal rounded-lg hover:bg-blue-700 transition-colors duration-300 group-hover:scale-105"
                      >
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Services State */}
          {!loading && !error && services.length === 0 && (
            <div className="text-center py-12">
              <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-normal text-gray-600 mb-2">No services available</h3>
              <p className="text-gray-500">Check back later for our latest services</p>
            </div>
          )}
        </div>
      </section>

      {/* Additional Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-normal text-gray-900 mb-4">
              Why Choose Our Website Services?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive website solutions that help businesses establish a strong online presence and achieve their digital goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-normal text-gray-900 mb-3">Modern Technology</h3>
              <p className="text-gray-600">
                Built with the latest technologies and frameworks for optimal performance and user experience.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-normal text-gray-900 mb-3">SEO Optimized</h3>
              <p className="text-gray-600">
                Search engine optimized to improve your website's visibility and drive more organic traffic.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-normal text-gray-900 mb-3">Secure & Reliable</h3>
              <p className="text-gray-600">
                Robust security measures and reliable hosting to keep your website safe and always accessible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Website;
