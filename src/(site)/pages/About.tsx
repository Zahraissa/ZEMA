import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Award,
    Target,
    Globe,
    Shield,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Play,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Clock,
    Star,
    Building,
    Lightbulb,
    Heart,
    Zap,
    Settings,
    Headphones,
    Network,
    Eye,
    Award as AwardIcon,
    Users as UsersIcon,
    Handshake,
    Briefcase,
    GraduationCap, HomeIcon, InfoIcon
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { publicAPI, AboutContent } from "@/services/api";
import {BsInfo} from "react-icons/bs";

interface AboutData {
  heroSection: {
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
  };
  mission: {
    title: string;
    content: string;
    icon: string;
    color: string;
  };
  vision: {
    title: string;
    content: string;
    icon: string;
    color: string;
  };

  values: Array<{
    id?: number;
    title: string;
    content: string;
    icon: string;
    color: string;
  }>;
  team: {
    title: string;
    description: string;
    memberCount: number;
  };
  history: {
    title: string;
    content: string;
  };
}

const About = () => {
  const [aboutData, setAboutData] = useState<AboutData>({
    heroSection: {
      title: "About Us",
      subtitle: "Leading innovation in technology since 2019",
      description: "The Business Licensing Regulatory Council (BLRC) was established under Act No. 13 of 2013 to regulate the business licensing system and related activities in Zanzibar. Its mission is to simplify license issuance, reduce bureaucracy, harmonize licenses across authorities, and ensure efficient access for businesses.\n" +
          "\n" +
          "Previously, business licenses were governed by Act No. 3 of 1983. However, economic liberalization in the 1980s–1990s led to multiple licensing authorities, creating complexity, inefficiency, and bureaucratic challenges. A 2011 survey by MAXWELL Inc. highlighted the need for a unified regulatory body to streamline licensing and oversee licensing authorities.\n" +
          "\n" +
          "Following this, the government enacted Act No. 13 of 2013, establishing the BLRC to regulate permits, fees, and authorizations related to business. The Council’s guidelines simplify licensing procedures, provide clear complaint and appeal processes, and set principles and criteria for licensing, which all authorities must follow..",
      heroImage: "/banner.avif"
    },
    mission: {
      title: "Mission",
      content: "To promote sound and sustainable environmental management practices through provision of policy guidance, institutional strengthening and cooperation.",
      icon: "target",
      color: "from-green-500 to-emerald-500"
    },
    vision: {
      title: "Vision",
      content: "Sound environment management for sustainable economic and social benefit for present and future generations.",
      icon: "eye",
      color: "from-blue-500 to-blue-600"
    },

    values: [
      {
        title: "UADILIFU",
        content: "Tunatumika kwa uaminifu na uwazi katika huduma zote",
        icon: "shield",
        color: "from-blue-500 to-blue-600"
      },
      {
        title: "UBUNIFU",
        content: "Tunatumia ubunifu na teknolojia ya kisasa kutatua changamoto",
        icon: "lightbulb",
        color: "from-yellow-500 to-orange-500"
      },
      {
        title: "KUTHAMINI WATEJA",
        content: "Tunatoa huduma bora kwa wananchi na washirika wetu",
        icon: "users",
        color: "from-green-500 to-emerald-500"
      },
      {
        title: "KUFANYAKAZI KWA PAMOJA",
        content: "Tunafanya kazi pamoja kama timu moja kufikia malengo",
        icon: "handshake",
        color: "from-purple-500 to-pink-500"
      },
      {
        title: "USHIRIKIANO",
        content: "Tunashirikiana na wananchi na washirika wetu kwa uaminifu",
        icon: "heart",
        color: "from-red-500 to-pink-500"
      },
      {
        title: "WELEDI",
        content: "Tunatumia ujuzi na uzoefu wetu kutoa huduma bora",
        icon: "award",
        color: "from-indigo-500 to-purple-500"
      }
    ],
    team: {
      title: "Our Team",
      description: "Meet the passionate individuals who make our organization great.",
      memberCount: 25
    },
    history: {
      title: "Our Story",
      content: "Founded in 2019, we started as a government initiative with big dreams. Today, we're proud to serve citizens nationwide through innovative e-government solutions."
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicAPI.getActiveAboutContent();
      const content = response.data || [];

      // Transform API data to local state
      const transformedData = transformApiDataToLocal(content);
      setAboutData(transformedData);
    } catch (error) {
      console.error('Error fetching about content:', error);
      setError('Failed to load about content. Please try again later.');
      // Keep default data if API fails
    } finally {
      setLoading(false);
    }
  };

  const transformApiDataToLocal = (content: AboutContent[]): AboutData => {
    const data: AboutData = {
      heroSection: {
        title: "Our History",
        subtitle: "Leading innovation in technology since 2019",
        description: "The Business Licensing Regulatory Council (BLRC) was established under Act No. 13 of 2013 to regulate the business licensing system and related activities in Zanzibar. Its mission is to simplify license issuance, reduce bureaucracy, harmonize licenses across authorities, and ensure efficient access for businesses.\n" +
            "\n" +
            "Previously, business licenses were governed by Act No. 3 of 1983. However, economic liberalization in the 1980s–1990s led to multiple licensing authorities, creating complexity, inefficiency, and bureaucratic challenges. A 2011 survey by MAXWELL Inc. highlighted the need for a unified regulatory body to streamline licensing and oversee licensing authorities.\n" +
            "\n" +
            "Following this, the government enacted Act No. 13 of 2013, establishing the BLRC to regulate permits, fees, and authorizations related to business. The Council’s guidelines simplify licensing procedures, provide clear complaint and appeal processes, and set principles and criteria for licensing, which all authorities must follow.",
        heroImage: "/banner.avif"
      },
      mission: {
        title: "Mission",
        content: "Kujenga mazingira ya kisheria yanayounga mkono maendeleo ya teknolojia na uboreshaji wa huduma kwa wananchi kupitia teknolojia ya kisasa na ubunifu.",
        icon: "target",
        color: "from-green-500 to-emerald-500"
      },
      vision: {
        title: "Vision",
        content: "Kuwa kiongozi wa kimataifa katika ubunifu wa teknolojia kwa ajili ya uboreshaji wa huduma za umma na kuunda siku za kesho bora kwa wote.",
        icon: "eye",
        color: "from-blue-500 to-blue-600"
      },

      values: [],
      team: {
        title: "Our Team",
        description: "Meet the passionate individuals who make our organization great.",
        memberCount: 25
      },
      history: {
        title: "Our Story",
        content: "Founded in 2019, we started as a government initiative with big dreams. Today, we're proud to serve citizens nationwide through innovative e-government solutions."
      }
    };

    content.forEach(item => {
      const additionalData = item.additional_data || {};

      switch (item.section) {
        case 'hero':
          data.heroSection = {
            title: item.title,
            subtitle: additionalData.subtitle || data.heroSection.subtitle,
            description: item.content,
            heroImage: item.image_path || data.heroSection.heroImage
          };
          break;
        case 'mission':
          data.mission = {
            title: item.title,
            content: item.content,
            icon: additionalData.icon || 'target',
            color: additionalData.color || 'from-green-500 to-emerald-500'
          };
          break;
        case 'vision':
          data.vision = {
            title: item.title,
            content: item.content,
            icon: additionalData.icon || 'eye',
            color: additionalData.color || 'from-blue-500 to-blue-600'
          };
          break;

        case 'values':
          data.values.push({
            id: item.id,
            title: item.title,
            content: item.content,
            icon: additionalData.icon || 'star',
            color: additionalData.color || 'from-blue-500 to-blue-600'
          });
          break;
        case 'team':
          data.team = {
            title: item.title,
            description: item.content,
            memberCount: additionalData.member_count || 25
          };
          break;
        case 'history':
          data.history = {
            title: item.title,
            content: item.content
          };
          break;
      }
    });

    return data;
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      shield: Shield,
      lightbulb: Lightbulb,
      users: UsersIcon,
      handshake: Handshake,
      heart: Heart,
      award: AwardIcon,
      target: Target,
      eye: Eye,
      star: Star
    };
    return iconMap[iconName] || Star;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <Header />
          {/* Enhanced Page Header */}
          <section className="relative bg-green-500 text-white py-20 overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <div className="container mx-auto px-4 relative z-10">
                  <div className="text-center max-w-3xl mx-auto">

                      <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">INTRODUCTION</h1>
                      <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                          <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                              <HomeIcon className="w-4 h-4 text-white" />
                              <span>Home</span>
                          </a>
                          <span>/</span>
                          <span className="text-white font-medium">INTRODUCTION</span>
                      </nav>

                  </div>
              </div>
          </section>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Building className="w-6 h-6 text-green-600 animate-pulse" />
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

                      <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 drop-shadow-lg">INTRODUCTION</h1>
                      <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                          <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                              <HomeIcon className="w-4 h-4 text-white" />
                              <span>Home</span>
                          </a>
                          <span>/</span>
                          <span className="text-white font-medium">INRODUCTION</span>
                      </nav>

                  </div>
              </div>
          </section>

        {/* <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
            <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Building className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-6 font-medium">{error}</p>
            <button
              onClick={fetchAboutContent}
              className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all font-medium"
            >
              Try again
            </button>
          </div>
        </div> */}
      <section className="py-16">
  <div className="container mx-auto px-4 max-w-5xl">
    <p className="text-gray-800 text-base leading-relaxed text-justify">
     Zanzibar Environmental Management Authority by its acronym ZEMA was established under the Zanzibar Environmental Management Act, 2015 aiming at coordinating, regulating, monitoring and supervising the environmental management concerns.
    </p>

    <p className="text-gray-800 text-base leading-relaxed text-justify mt-4">
      The prime objective which was crucial for the establishment of this Authority was to bring harmony in the management and enforcement of environment in Zanzibar.The prime objective which was crucial for the establishment of this Authority was to bring harmony in the management and enforcement of environment in Zanzibar.
    </p>

    <p className="text-gray-800 text-base leading-relaxed text-justify mt-4">
      The main pre occupation of ZEMA therefore is enforcement, compliance, review and monitor all environmental activities in Zanzibar.
    </p>
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
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">About Us</h1>
              <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                  <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                      <HomeIcon className="w-4 h-4 text-white" />
                      <span>Home</span>
                  </a>
                  <span>/</span>
                  <span className="text-white font-medium">INTRODUCTION</span>
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
                  <div className="p-2 bg-green-400 rounded-lg">
                    <InfoIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-600">
                    INTRODUCTION
                  </h3>
                </div>
                <nav className="space-y-1">
                  <a href="/about" className="block text-gray-800 font-bold bg-blue-100 py-2 px-3 rounded-lg border-l-4 border-green-600">
                    Who we are
                  </a>
                  <a href="/director-general" className="block text-gray-600 hover:text-black hover:bg-blue-100 transition-all py-2 hover:px-3 rounded-lg">
                    Message Of Director General
                  </a>
                  <a href="/what-we-do" className="block text-gray-600 hover:text-black hover:bg-blue-100 transition-all py-2 hover:px-3 rounded-lg">
                    What we do
                  </a>
                </nav>
              </div>
            </div>

            {/* Enhanced Main Content Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                
                <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-500 mb-6">History</h3>
                    <div className="mb-8 rounded-xl p-6 border hover:border-green-500">
                        <div className="flex items-start space-x-4">
                            <div className="w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                <BsInfo className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">
                                    {aboutData.heroSection.title}
                                </h4>
                                <p>
                                    {aboutData.heroSection.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vision, Mission Section */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-500 mb-6">Mission And Vission</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Vision */}
                      <Card className="border-2 hover:border-green-300 hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center shadow-lg">
                                {React.createElement(getIconComponent(aboutData.vision.icon), { className: "w-7 h-7 text-white" })}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-gray-900 mb-3">{aboutData.vision.title}</h4>
                              <p className="text-gray-700 leading-relaxed">
                                {aboutData.vision.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Mission */}
                      <Card className="border-2  hover:border-green-300 hover:shadow-xl transition-all">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center shadow-lg">
                                {React.createElement(getIconComponent(aboutData.mission.icon), { className: "w-7 h-7 text-white" })}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-xl font-bold text-gray-900 mb-3">{aboutData.mission.title}</h4>
                              <p className="text-gray-700 leading-relaxed">
                                {aboutData.mission.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Core Principles Section */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-500 mb-4">Misingi Mikuu</h3>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {aboutData.values.map((value, index) => {
                        const IconComponent = getIconComponent(value.icon);
                        return (
                          <Card key={index} className="border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all group">
                            <CardContent className="p-6">
                              <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                  <div className="w-14 h-14 bg-green-400 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <IconComponent className="w-7 h-7 text-white" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-3">
                                    <Badge className="bg-green-300 text-white font-bold shadow-lg">
                                      {index + 1}
                                    </Badge>
                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                      {value.title}
                                    </h4>
                                  </div>
                                  <p className="text-gray-700 leading-relaxed">
                                    {value.content}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

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

export default About;

