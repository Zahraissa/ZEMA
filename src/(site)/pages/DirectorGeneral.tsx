import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import {Award, User, MessageSquare, Building, HomeIcon, InfoIcon, BadgeCheck} from "lucide-react";
import api from "@/services/api";
import { STORAGE_BASE_URL } from "@/config";

interface DirectorGeneral {
  id: number;
  name: string;
  title: string;
  message: string;
  image_path?: string;
  additional_data?: any;
  status: string;
  order: number;
}

const DirectorGeneral = () => {
  const [director, setDirector] = useState<DirectorGeneral | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchDirectorGeneral();
  }, []);

  const fetchDirectorGeneral = async () => {
    try {
      setLoading(true);
      const response = await api.get('/director-general/active');
      if (response.data.success) {
        setDirector(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching director general:', err);
      setError('Failed to load director general message');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return '/placeholder.svg';
    
    // If the image path already includes http/https, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If the image path starts with storage/, remove it to avoid double paths
    const cleanPath = imagePath.startsWith('storage/') ? imagePath.substring(8) : imagePath;
    
    // Use the API base URL from config
    return `${STORAGE_BASE_URL}${cleanPath}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <Header />
          {/* Enhanced Page Header */}
          <section className="relative bg-green-500 text-white py-2 overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <div className="container mx-auto px-4 relative z-10">
                  <div className="text-center max-w-3xl mx-auto">

                      <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">DierectorGeneral</h1>
                      <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                          <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                              <HomeIcon className="w-4 h-4 text-white" />
                              <span>Home</span>
                          </a>
                          <span>/</span>
                          <span className="text-white font-medium">message of Director general</span>
                      </nav>

                  </div>
              </div>
          </section>

          <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="w-6 h-6 text-green-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">Fetching data...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <Header />
          {/* Enhanced Page Header */}
          <section className="relative bg-green-500 text-white py-2 overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <div className="container mx-auto px-4 relative z-10">
                  <div className="text-center max-w-3xl mx-auto">

                      <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">DierectorGeneral</h1>
                      <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                          <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                              <HomeIcon className="w-4 h-4 text-white" />
                              <span>Home</span>
                          </a>
                          <span>/</span>
                          <span className="text-white font-medium">message of Director general</span>
                      </nav>

                  </div>
              </div>
          </section>

          <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
            <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-6 font-medium">{error}</p>
            <button 
              onClick={fetchDirectorGeneral}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all font-medium"
            >
              Try again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Enhanced Page Header */}
        <section className="relative bg-green-500 text-white py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto">

                    <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">FUNCTION OF THE ZEMA</h1>
                    <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                        <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                            <HomeIcon className="w-4 h-4 text-white" />
                            <span>Home</span>
                        </a>
                        <span>/</span>
                        <span className="text-white font-medium">message of Director general</span>
                    </nav>

                </div>
            </div>
        </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Enhanced Sidebar Navigation */}
              <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 sticky top-8 hover:shadow-xl transition-shadow">
                      <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-green-600">
                          <div className="p-2 bg-green-400 rounded-lg">
                              <InfoIcon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-600">
                              ABOUT US
                          </h3>
                      </div>
                      <nav className="space-y-1">
                          <a href="/about" className="block text-gray-600 hover:text-black hover:bg-green-100 transition-all py-2 hover:px-3 rounded-lg">
                              Who we are
                          </a>
                          <a href="/director-general" className="block text-gray-700 font-bold bg-green-100 py-2 px-3 rounded-lg border-l-4 border-green-600">
                              Message Of Director General
                          </a>
                          <a href="/what-we-do" className="block text-gray-600 hover:text-black hover:bg-green-100 transition-all py-2 hover:px-3 rounded-lg">
                              What we do
                          </a>
                      </nav>
                  </div>
              </div>

            {/* Enhanced Main Content Area */}
            <div className="lg:col-span-3">
              {director ? (
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-400 rounded-xl">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-600">
                          Message Of Director General
                        </h2>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      
                      {/* Enhanced Portrait Image */}
                      <div className="md:col-span-1">
                        <div className="relative">
                          <div className="w-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden relative shadow-lg">
                            <img 
                              src={imageError ? '/placeholder.svg' : getImageUrl(director.image_path)} 
                              alt={director.name}
                              className="w-full h-auto object-cover"
                              onError={handleImageError}
                              loading="lazy"
                            />
                          </div>
                        </div>
                        {/* Enhanced Name and Position card */}
                        <div className="mt-6">
                          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-6 text-center">
                              
                              <h3 className="text-xl font-bold text-gray-500 mb-2">
                                {director.name}
                              </h3>
                              <div className="flex items-center justify-center gap-2">
                                <BadgeCheck  className="w-5 h-5 text-green-700" />
                                <p className="text-green-500 font-semibold">
                                  {director.title}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Enhanced Content */}
                      <div className="md:col-span-2">
                        <div className="prose prose-lg max-w-none">
                          <div className="whitespace-pre-line text-gray-700 leading-relaxed text-lg text-justify">
                            {director.message}
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t-2 border-gray-100">
                          <div className="flex items-center gap-2 text-gray-600">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            <p className="font-medium italic">Ujumbe wa Mkurugenzi Mtendaji</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12">
                  <div className="text-center py-16">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <User className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Hakuna Ujumbe wa Mkurugenzi</h3>
                    <p className="text-gray-600">Ujumbe wa Mkurugenzi Mtendaji utakuwa hapa hivi karibuni.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DirectorGeneral;
