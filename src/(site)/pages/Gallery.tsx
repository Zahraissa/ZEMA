import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {ChevronRight, Play, Image as ImageIcon, Filter, Search, HomeIcon} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryLightbox from "@/components/GalleryLightbox";
import { publicAPI } from "@/services/api";
import type { Gallery } from "@/services/api";
import { STORAGE_BASE_URL } from "@/config";

const Gallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [galleryItems, setGalleryItems] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery data
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(true);
        const [galleryResponse, categoriesResponse] = await Promise.all([
          publicAPI.getActiveGallery(),
          publicAPI.getGalleryCategories()
        ]);

        if (galleryResponse.success) {
          // Filter out any items with null or undefined titles to prevent errors
          const validGalleryItems = galleryResponse.data.filter(item => 
            item && item.title !== null && item.title !== undefined
          );
          setGalleryItems(validGalleryItems);
        }

        if (categoriesResponse.success) {
          const categoryData = categoriesResponse.data.map(cat => ({
            id: cat,
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            count: galleryResponse.success ? galleryResponse.data.filter(item => item.category === cat).length : 0
          }));
          
          setCategories([
            { id: 'all', name: 'All Categories', count: galleryResponse.success ? galleryResponse.data.length : 0 },
            ...categoryData
          ]);
        }
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setError('Failed to load gallery data');
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = (item.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (item.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const navigateLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
        <section className="relative bg-green-500 text-white py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto">

                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Gallery</h1>
                    <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                        <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                            <HomeIcon className="w-4 h-4 text-white" />
                            <span>Home</span>
                        </a>
                        <span>/</span>
                        <span className="text-white font-medium">Gallery</span>
                    </nav>

                </div>
            </div>
        </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-50" id="gallery-page">
        <div className="container mx-auto px-4">
      
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent search-input"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-normal transition-colors category-filter ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading gallery...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <ImageIcon className="h-16 w-16 mx-auto mb-2" />
                <p className="text-lg font-normal">Error loading gallery</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="gallery-item group">
                    <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                      <a 
                        href={item.image_path ? `${STORAGE_BASE_URL}${item.image_path}` : "#"} 
                        title={item.title}
                        onClick={(e) => {
                          e.preventDefault();
                          openLightbox(index);
                        }}
                        className="block relative"
                      >
                        <img 
                          src={item.image_path ? `${STORAGE_BASE_URL}${item.image_path}` : "/assets/placeholder.jpg"} 
                          alt={item.alt_text || item.title || 'Gallery image'}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/assets/placeholder.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ImageIcon className="h-12 w-12 text-white" />
                          </div>
                        </div>
                      </a>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <h4 className="text-xl font-normal text-gray-900 mb-2">
                        {item.title || 'Untitled'}
                      </h4>
                      <p className="text-gray-600">
                        {item.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* No Results */}
              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-normal text-gray-600 mb-2">No images found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <GalleryLightbox
        images={filteredItems.map((item, index) => ({
          id: item.id,
          src: item.image_path ? `${STORAGE_BASE_URL}${item.image_path}` : "/assets/placeholder.jpg",
          alt: item.alt_text || item.title || 'Gallery image',
          title: item.title || 'Untitled',
          description: item.description || 'No description available'
        }))}
        isOpen={selectedImageIndex !== null}
        currentIndex={selectedImageIndex || 0}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />

      <Footer />
    </div>
  );
};

export default Gallery; 