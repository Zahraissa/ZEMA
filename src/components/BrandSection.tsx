import React, { useEffect, useState } from "react";
import { publicAPI } from "@/services/api";
import type { Brand } from "@/services/api";
import { STORAGE_BASE_URL } from "@/config";

const BrandArea = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await publicAPI.getActiveBrands();
        if (response.success) {
          setBrands(response.data);
        }
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <section className="overflow-hidden py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section title */}
              <h2 className="text-3xl font-normal text-gray-900 mb-8 text-center">
                E-Services
              </h2>

              {/* Brands grid */}
             <div className="flex animate-scroll">
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand.id}-${index}`}
                className="flex-shrink-0 flex justify-center items-center mx-6"
              >
                <a 
                  href={brand.website_url || "#"} 
                  target={brand.website_url ? "_blank" : "_self"}
                  rel={brand.website_url ? "noopener noreferrer" : ""}
                  className="block"
                >
                  {brand.logo_path ? (
                    <img
                      src={`${STORAGE_BASE_URL}${brand.logo_path}`}
                      alt={brand.name}
                      className="h-20 w-40 object-contain transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="h-20 w-40 flex items-center justify-center bg-white rounded-lg shadow-sm border">
                      <span className="text-gray-600 font-normal text-center px-2">
                        {brand.name}
                      </span>
                    </div>
                  )}
                </a>
              </div>
            ))}
          </div>

            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          width: max-content;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default BrandArea;
