import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageSquare,
    Users,
    Building,
    Map,
    Star,
    ExternalLink, HomeIcon
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import { contactService, ContactOffice } from "@/services/contactService";

const Contact = () => {
  const [offices, setOffices] = useState<{
    headquarters: ContactOffice[];
    regional: ContactOffice[];
    research: ContactOffice[];
  }>({
    headquarters: [],
    regional: [],
    research: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await contactService.getAllOffices();
        setOffices(response.data);
      } catch (error) {
        console.error('Error fetching contact offices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffices();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderOfficeCard = (office: ContactOffice) => (
    <Card key={office.id} className="mb-8 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <CardTitle className="flex items-center text-xl font-normal">
          <Building className="mr-3 h-6 w-6" />
          {office.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Contact Information */}
          <div className="p-6 bg-gray-50">
            <div className="space-y-4">
              <div>
                <h3 className="font-normal text-gray-900 mb-2 whitespace-pre-line">
                  {office.office_name}
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-normal text-gray-900">Location</p>
                    <p className="text-gray-600">{office.location}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Building className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-normal text-gray-900">Postal Address</p>
                    <p className="text-gray-600">{office.postal_address}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-normal text-gray-900">Email Address</p>
                    <p className="text-gray-600">{office.email}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-normal text-gray-900">Phone</p>
                    <p className="text-gray-600">{office.phone}</p>
                  </div>
                </div>

                {office.helpdesk && (
                  <div className="flex items-start">
                    <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-normal text-gray-900">Helpdesk</p>
                      <p className="text-gray-600">{office.helpdesk}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="p-6">
            <div className="mb-4">
              <h3 className="flex items-center text-lg font-normal text-gray-900 mb-2">
                <Map className="mr-2 h-5 w-5 text-blue-600" />
                LOCATION
              </h3>
            </div>

            {/* Map Embed */}
            {office.map_embed_url && (
              <div className="relative">
                <iframe
                  src={office.map_embed_url}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg shadow-md"
                ></iframe>
                
                {/* Map Info Overlay */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                  <h4 className="font-normal text-gray-900 text-sm mb-1">
                    {office.title}
                  </h4>
                  <p className="text-gray-600 text-xs mb-2">
                    {office.location}
                  </p>
                  {office.map_rating && (
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {renderStars(office.map_rating)}
                      </div>
                      <span className="text-xs text-gray-600">
                        {office.map_rating} {office.map_reviews && `(${office.map_reviews} reviews)`}
                      </span>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View larger map
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      <MapPin className="h-3 w-3 mr-1" />
                      Directions
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback if no map embed */}
            {!office.map_embed_url && (
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Map className="h-12 w-12 mx-auto mb-2" />
                  <p>Map not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <Header />

      {/* Page Header */}
        <section className="relative bg-green-500 text-white py-2 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto">

                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Contact Us</h1>
                    <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                        <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                            <HomeIcon className="w-4 h-4 text-white" />
                            <span>Home</span>
                        </a>
                        <span>/</span>
                        <span className="text-white font-medium">contact us</span>
                    </nav>

                </div>
            </div>
        </section>

      {/* Contact Offices */}
      <section className="py-12 sm:py-16 md:py-2">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading contact information...</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Headquarters */}
              {offices.headquarters.length > 0 && (
                <div>
                  {offices.headquarters.map(renderOfficeCard)}
                </div>
              )}

              {/* Regional Offices */}
              {offices.regional.length > 0 && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-3xl font-normal text-gray-900 mb-4 flex items-center">
                      <Users className="mr-3 h-8 w-8 text-blue-600" />
                      Mini Offices
                    </h2>
                  </div>
                  {offices.regional.map(renderOfficeCard)}
                </div>
              )}

              {/* Research Centers */}
              {offices.research.length > 0 && (
                <div>
                  {offices.research.map(renderOfficeCard)}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

    

      <Footer />
    </div>
  );
};

export default Contact; 