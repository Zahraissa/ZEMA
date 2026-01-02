import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  AlertTriangle,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const quickLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Wasiliana Nasi", href: "/contact", icon: Phone },
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: "Simu",
      details: ["+255 770 560 345", "+255 777 123 456"]
    },
    {
      icon: Mail,
      title: "Barua Pepe",
      details: ["info@egaz.go.tz", "support@egaz.go.tz"]
    },
    {
      icon: MapPin,
      title: "Anwani",
      details: ["Ofisi ya Rais - Ikulu Zanzibar", "Zanzibar, Tanzania"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-green-400 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6">
              <AlertTriangle className="h-12 w-12" />
            </div>
            <Badge variant="secondary" className="mb-4">
              Error 404
            </Badge>
            <h1 className="text-6xl md:text-8xl font-normal mb-6">
              404
            </h1>
            <h2 className="text-2xl md:text-4xl font-normal mb-6">
              Page not available
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              This page is under maintenance or not available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate("/")}
              >
                <Home className="mr-2 h-5 w-5" />
                Home
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                 Back
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal text-gray-900 mb-4">
              Important links
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(link.href)}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                    <link.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-normal text-gray-900">{link.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NotFound;
