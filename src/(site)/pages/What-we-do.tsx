import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Settings,
    Network,
    Users,
    Shield,
    GraduationCap,
    Search,
    Megaphone,
    Building,
    Globe,
    CheckCircle,
    ArrowRight,
    Award,
    Briefcase, HomeIcon, InfoIcon
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import api from "@/services/api";

interface AuthorityFunction {
  id: number;
  title: string;
  description: string;
  icon?: string;
  order: number;
  status: string;
  additional_data?: any;
}

const WhatWeDo = () => {
  const [functions, setFunctions] = useState<AuthorityFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuthorityFunctions();
  }, []);

  const fetchAuthorityFunctions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/authority-functions/active');
      if (response.data.success) {
        setFunctions(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching authority functions:', err);
      setError('Failed to load authority functions');
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'settings': Settings,
      'network': Network,
      'users': Users,
      'shield': Shield,
      'graduation-cap': GraduationCap,
      'search': Search,
      'megaphone': Megaphone,
      'building': Building,
      'globe': Globe,
      'check-circle': CheckCircle
    };
    
    return iconMap[iconName] || Settings;
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

                      <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">Mission & Vission</h1>
                      <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                          <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                              <HomeIcon className="w-4 h-4 text-white" />
                              <span>Home</span>
                          </a>
                          <span>/</span>
                          <span className="text-white font-medium">Mission & Vission</span>
                      </nav>

                  </div>
              </div>
          </section>

          <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 font-medium">Inapakia majukumu ya mamlaka...</p>
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

                      <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">Mission & Vission</h1>
                      <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                          <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                              <HomeIcon className="w-4 h-4 text-white" />
                              <span>Home</span>
                          </a>
                          <span>/</span>
                          <span className="text-white font-medium">Mission & Vission</span>
                      </nav>

                  </div>
              </div>
          </section>

          {/* <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
            <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-6 font-medium">{error}</p>
            <button 
              onClick={fetchAuthorityFunctions}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all font-medium"
            >
              Jaribu tena
            </button>
          </div>
        </div> */}
        <section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

      {/* IMAGE SIDE */}
      <div className="order-1 lg:order-2 flex justify-center">
        <img
          src="/img/MissionVission.jpg"
          alt="Mission and Vision"
          className="w-full max-w-md object-cover"
          style={{
            boxShadow:
              "0px 0px 5px 2px blue, 0px 0px 15px 10px #FFD700",
          }}
        />
      </div>

      {/* TEXT SIDE */}
      <div className="order-2 lg:order-1">
        <p className="text-black-700 leading-relaxed font-serif text-justify mb-6">
          ZEMA supports the overall objective of the Zanzibar Environmental
          Policy (ZEP). The ZEP intends to pave the way for the protection,
          conservation, restoration and management of Zanzibar’s environmental
          resources, such that their capacity to sustain development and
          maintain the rich environmental endowment for the present and future
          generations is not impaired.
        </p>

        <p className="text-black-800 text-justify mb-4">
          <span className="font-serif text-green-700">Our Vision:</span>{" "}
          Sound environment management for sustainable economic and social
          benefit for present and future generations.
        </p>

        <p className="text-black-800 text-justify">
          <span className="font-serif text-green-700">Our Mission:</span>{" "}
          To promote sound and sustainable environmental management practices
          through provision of policy guidance, institutional strengthening and
          cooperation.
        </p>
      </div>

    </div>
  </div>
</section>


        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Enhanced Page Header */}
        <section className="relative bg-blue-500 text-white py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto">

                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Mission & Vission</h1>
                    <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                        <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                            <HomeIcon className="w-4 h-4 text-white" />
                            <span>Home</span>
                        </a>
                        <span>/</span>
                        <span className="text-white font-medium">Mission & Vission</span>
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
                          <a href="/about" className="block text-gray-600 hover:text-black hover:bg-blue-100 transition-all py-2 hover:px-3 rounded-lg">
                              Who we are
                          </a>
                          <a href="/director-general" className="block text-gray-600 hover:text-black hover:bg-green-100 transition-all py-2 hover:px-3 rounded-lg">
                              Message Of Director General
                          </a>
                          <a href="/what-we-do" className="block text-gray-700 font-bold bg-green-100 py-2 px-3 rounded-lg border-l-4 border-green-600">
                              What we do
                          </a>
                      </nav>
                  </div>
              </div>

            {/* Enhanced Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-400 rounded-xl">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-500">
                        Majukumu ya Mamlaka
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Majukumu {functions.length} ya Mamlaka
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 pl-8">
                  <div className="mb-3">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Kwa mujibu wa Sheria Na. 1 ya Mwaka 2024, majukumu ya eGAZ ni pamoja na:
                    </p>
                  </div>

                  {functions.length > 0 ? (
                    <div className="space-y-6">
                      {functions.map((func, index) => {
                        const IconComponent = getIconComponent(func.icon || 'settings');
                        return (
                          <Card key={func.id} className="border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all group">
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="w-14 h-14 bg-blue-300 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <IconComponent className="w-7 h-7 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <Badge className="bg-blue-500 text-white font-bold shadow-lg">
                                      {index + 1}
                                    </Badge>
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                      {func.title}
                                    </h3>
                                  </div>
                                  <p className="text-gray-700 leading-relaxed text-lg">
                                    {func.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <Briefcase className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Hakuna Majukumu ya Mamlaka</h3>
                      <p className="text-gray-600">Majukumu ya mamlaka yataonekana hapa hivi karibuni.</p>
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

export default WhatWeDo;

