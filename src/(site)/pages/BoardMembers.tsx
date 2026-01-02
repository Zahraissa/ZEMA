import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award } from "lucide-react";
import api from "@/services/api";
import { STORAGE_BASE_URL } from "@/config";

// Add styles for line-clamp utility
const lineClampStyles = `
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

interface BoardMember {
  id: number;
  name: string;
  position: string;
  image_path?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_instagram?: string;
  status: string;
  order: number;
}

const BoardMembers = () => {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/band-members/active');
      if (response.data.success) {
        setMembers(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching board members:', err);
      setError('Failed to load board members');
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

  const handleImageError = (memberId: number) => {
    setImageErrors(prev => new Set(prev).add(memberId));
  };

  const isImageError = (memberId: number) => {
    return imageErrors.has(memberId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <Header />
          {/* Enhanced Page Header */}
          <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <div className="container mx-auto px-4 relative z-10">
                  <div className="text-center max-w-3xl mx-auto">

                      <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Bodi ya Wakurugenzi</h1>
                      <p className="text-xl text-blue-100 mb-6">Wanachama wa Bodi ya Wakurugenzi ya e-Government Authority</p>
                      <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                          <a href="/" className="hover:text-white transition-colors">Mwanzo</a>
                          <span>/</span>
                          <span className="text-white font-medium">Bodi ya Wakurugenzi</span>
                      </nav>
                  </div>
              </div>
          </section>

          <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600 animate-pulse" />
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
          <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <div className="container mx-auto px-4 relative z-10">
                  <div className="text-center max-w-3xl mx-auto">

                      <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Bodi ya Wakurugenzi</h1>
                      <p className="text-xl text-blue-100 mb-6">Wanachama wa Bodi ya Wakurugenzi ya e-Government Authority</p>
                      <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                          <a href="/" className="hover:text-white transition-colors">Mwanzo</a>
                          <span>/</span>
                          <span className="text-white font-medium">Bodi ya Wakurugenzi</span>
                      </nav>
                  </div>
              </div>
          </section>

          <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
            <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-6 font-medium">{error}</p>
            <button 
              onClick={fetchMembers}
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
      <style>{lineClampStyles}</style>
      <Header />

      {/* Enhanced Page Header */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Bodi ya Wakurugenzi</h1>
            <p className="text-xl text-blue-100 mb-6">Wanachama wa Bodi ya Wakurugenzi ya e-Government Authority</p>
            <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
              <a href="/" className="hover:text-white transition-colors">Mwanzo</a>
              <span>/</span>
              <span className="text-white font-medium">Bodi ya Wakurugenzi</span>
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
                <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-blue-600">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    KUHUSU SISI
                  </h3>
                </div>
                <nav className="space-y-1">
                  <a href="/about" className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all py-2 px-3 rounded-lg">
                    Sisi ni nani?
                  </a>
                  <a href="/director-general" className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all py-2 px-3 rounded-lg">
                    Ujumbe wa Mkurugenzi Mtendaji
                  </a>
                  <a href="/board-members" className="block text-blue-600 font-bold bg-blue-50 py-2 px-3 rounded-lg border-l-4 border-blue-600">
                    Bodi ya Wakurugenzi
                  </a>
                  <a href="/what-we-do" className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all py-2 px-3 rounded-lg">
                    Majukumu ya Mamlaka
                  </a>
                </nav>
              </div>
            </div>

            {/* Enhanced Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 border-b border-gray-100 p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Bodi ya Wakurugenzi
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Wanachama {members.length} wa Bodi
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-50/30 rounded-xl p-6 border border-blue-100">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Bodi ya Wakurugenzi ya eGAZ inaongoza na kusimamia shughuli za Mamlaka kwa mujibu wa Sheria na Kanuni zilizowekwa.
                    </p>
                  </div>

                  {members.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {members.map((member, index) => (
                        <Card key={member.id} className="border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all group">
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                              {/* Enhanced Image */}
                              <div className="relative mb-4">
                                <div className="w-48 h-56 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden relative shadow-lg group-hover:shadow-xl transition-shadow">
                                  <img 
                                    src={isImageError(member.id) ? '/placeholder.svg' : getImageUrl(member.image_path)} 
                                    alt={member.name}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={() => handleImageError(member.id)}
                                    loading="lazy"
                                  />
                                </div>
                                <div className="absolute -top-2 -right-2">
                                  <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-lg">
                                    {index + 1}
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Member Info */}
                              <div className="w-full">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                  {member.name}
                                </h3>
                                <div className="flex items-center justify-center gap-2 mb-4">
                                  <Award className="w-4 h-4 text-blue-600" />
                                  <p className="text-blue-600 font-semibold">{member.position}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Users className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Hakuna Bodi ya Wakurugenzi</h3>
                      <p className="text-gray-600">Bodi ya Wakurugenzi watakuwa hapa hivi karibuni.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BoardMembers;
