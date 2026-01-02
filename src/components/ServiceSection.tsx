import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { publicAPI, Service } from "@/services/api";
import "swiper/css";
import "tailwindcss/tailwind.css";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { STORAGE_BASE_URL } from "@/config";

const datas= {
    sw: {
        heading: "OUR SERVICES",
    },
    en:{
        heading: "HUDUMA ZETU"
    }
}
const ServiceSection = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.getActiveServices();
      if (response.success) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (imagePath) {
      return `${STORAGE_BASE_URL}${imagePath}`;
    }
    // Fallback to a default image if no image is provided
    return "/assets/service_bg_4.jpg";
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 border-opacity-50"></div>
            <span className="ml-3 text-gray-600">Loading services...</span>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between -mx-4 mb-8 sm:mb-12">
            <div className="w-full lg:w-7/12 px-4 mb-6 lg:mb-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-gray-900">
                    OUR SERVICES
                </h2>
            </div>
        </div>
          <div className="flex flex-col p-4 items-center mb-8 sm:mb-12">

              <p className="text-center text-gray-600 animate-fade-in text-sm sm:text-base max-w-xl">
                  Theres no services at the moment or network error encountered.
              </p>
          </div>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden py-8 sm:py-12 md:py-16"
      id="service-sec"
      style={{
        backgroundImage: "url(/assets/service_bg_4.jpg)",
        backgroundSize: "cover",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between -mx-4 mb-8 sm:mb-12">
          <div className="w-full lg:w-7/12 px-4 mb-6 lg:mb-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-gray-900">
                OUR SERVICES
            </h2>
          </div>
        </div>

        <Swiper
          spaceBetween={16}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 16 },
            480: { slidesPerView: 1, spaceBetween: 20 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
            1536: { slidesPerView: 4, spaceBetween: 30 },
          }}
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
        >
          {services.map((service, index) => (
            <SwiperSlide key={service.id}>
              <div className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100">
                {/* Image */}
                <div className="overflow-hidden rounded-t-xl relative">
                  <img
                    src={getImageUrl(service.image_path)}
                    alt={service.name}
                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/img/service/service_3_1.jpg";
                    }}
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-normal text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    <Link to="/services">{service.name}</Link>
                  </h3>

                  <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Price */}
                  {service.price && (
                    <div className="flex justify-end mb-4">
                      <span className="text-sm sm:text-base font-normal text-green-600 bg-green-100 px-2 py-1 rounded-lg shadow-sm">
                        {service.price}
                      </span>
                    </div>
                  )}

                  {/* Button */}
                  <Link
                    to={`/services/${service.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-400 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm sm:text-base font-normal group-hover:shadow-lg"
                    onClick={() => {
                      console.log('Tazama Huduma clicked for service:', service.id, service.name);
                    }}
                  >
                    see more
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ServiceSection;
