import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Building2, Users, ArrowRight, Clock, CheckCircle, Search, Shield, Award, Star, TrendingUp, Sparkles, Book, Pen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { STORAGE_BASE_URL } from '@/config';
import { useServiceQueryHook } from '@/hooks/useBillingQueryHook';
import { TServiceResponse } from '@/type/TServiceResponse';
import { useBillDetailStore } from '@/store/bill-detail-store';
import { Separator } from '@/components/ui/separator';

const Services = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { services, isLoadingServices } = useServiceQueryHook();

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/assets/service_bg_4.jpg';
    return `${STORAGE_BASE_URL}${imagePath}`;
  };

  const getServiceIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'training':
        return Book;
      case 'sponsored':
        return Pen;
      default:
        return Building2;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'training':
        return 'bg-blue-300';
      case 'sponsored':
      default:
        return 'bg-blue-400';
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
      service.serviceGroup.groupName.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { name: 'all', label: 'All Services', icon: Sparkles },
    { name: 'training', label: 'Training', icon: Book },
    { name: 'sponsor', label: 'Sponsored', icon: Building2 },
    { name: 'fixed', label: 'Fixed', icon: Users },
  ];

  const { setBillDetail } = useBillDetailStore();

  const onServiceClick = (service: TServiceResponse) => {
    const billDetail = {
      billType: service?.serviceGroup?.status,
      serviceId: service?.id ?? null,
      price: service?.serviceItemPricing?.unitPrice ?? null,
      billedDate: service?.serviceItemPricing?.effectiveFrom ?? null,
      expireDate: service?.serviceItemPricing?.effectiveTo ?? null,
    }
    setBillDetail(billDetail);
    navigate('/services/details', { state: { service: service } });
  }

  if (isLoadingServices) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50/30">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-300 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <h3 className="text-xl font-light text-blue-700 mb-2">Loading Services</h3>
            <p className="text-blue-00">Please wait while we fetch the latest services...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-300/10 via-blue-400/10 to-blue-500/10 text-white py-24 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300/10 via-blue-400/10 to-blue-500/10"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span className="text-sm font-medium text-blue-500">Discover Our Services</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-light mb-6 text-blue-300">
              <strong className='animate animate-bounce'>
                Zanzibar e-Government Services
              </strong>
            </h1>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-6 border border-blue-700/30">
                <div className="text-3xl font-light mb-1 text-blue-300">{services.length}+</div>
                <div className="text-sm text-blue-300"><strong>Services</strong></div>
              </div>
              <div className="bg-white backdrop-blur-sm rounded-2xl p-6 border border-blue-700/30">
                <div className="text-3xl font-light mb-1 text-blue-300">24/7</div>
                <div className="text-sm text-blue-300"><strong>Available</strong></div>
              </div>
              <div className="bg-white backdrop-blur-sm rounded-2xl p-6 border border-blue-700/30">
                <div className="text-3xl font-light mb-1 text-blue-300">100%</div>
                <div className="text-sm text-blue-300"><strong>Secure</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="url(#gradient)" />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(255, 255, 255)" stopOpacity="0.1" />
                <stop offset="100%" stopColor="rgb(255, 255, 255)" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
      <Separator className="" />
      {/* Search and Filter Section */}
      <section className="py-12 -mt-8 relative z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl shadow-blue-50/30 p-8 border border-blue-200/80 backdrop-blur-sm">
            {/* Search Bar */}
            <div className="relative max-w-3xl mx-auto mb-8">
              <Search className="absolute left-6 top-1/2 transform -tranblue-y-1/2 text-blue-200 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-5 border-2 border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-200/20 focus:border-blue-200 transition-all duration-300 bg-white text-blue-400 placeholder-blue-400 text-lg"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 border-2 ${selectedCategory === category.name
                      ? 'bg-blue-300 border-blue-300 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-white border-blue-200 text-blue-400/50 hover:border-blue-300/50 hover:bg-blue-50/50'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{category.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          {filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-200">
                <Search className="w-16 h-16 text-blue-200" />
              </div>
              <h3 className="text-3xl font-light text-blue-500 mb-3">No Services Found</h3>
              <p className="text-blue-300 text-lg mb-8">Try adjusting your search or browse all categories.</p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-blue-300 hover:bg-blue-400 text-white px-8 py-6 rounded-2xl text-lg shadow-lg shadow-blue-200 transition-all duration-300 transform hover:scale-105 border border-blue-300"
              >
                View All Services
              </Button>
            </div>
          ) : (
            <div className="py-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
              {filteredServices.map((service) => {
                const ServiceIcon = getServiceIcon(service.serviceGroup.groupName);
                const categoryColor = getCategoryColor(service.serviceGroup.groupName);
                return (
                  <div
                    key={service.id}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-tranblue-y-2 border border-blue-500/80 overflow-hidden backdrop-blur-sm"
                  >
                    {/* Header with Icon and Badge */}
                    <div className={`relative ${categoryColor} p-8 pb-16`}>
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>

                      <div className="relative flex items-start justify-between mb-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/20">
                          <ServiceIcon className="w-8 h-8 text-white" />
                        </div>
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-4 py-1.5 font-medium">
                          {service.serviceGroup.groupName}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-light text-white mb-2 line-clamp-2 relative z-10">
                        {service.serviceName}
                      </h3>
                      {service.serviceItemPricing?.unitPrice > 0 && (
                        <div className="text-white/90 text-lg font-medium relative z-10">
                          TZS {service.serviceItemPricing.unitPrice}/=
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 -mt-8 relative">
                      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-blue-50">
                        <p className="text-blue-500 leading-relaxed line-clamp-3 font-normal">
                          {service.serviceName}
                        </p>
                      </div>

                      {/* Features */}
                      {/* <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-500 rounded-xl p-3 border border-blue-50">
                          <Clock className="w-4 h-4 text-blue-200" />
                          <span>24/7 Access</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-500 rounded-xl p-3 border border-blue-50">
                          <Shield className="w-4 h-4 text-blue-200" />
                          <span>Secure</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-500 rounded-xl p-3 border border-blue-50">
                          <CheckCircle className="w-4 h-4 text-blue-200" />
                          <span>Verified</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-300 bg-blue-500 rounded-xl p-3 border border-blue-50">
                          <Award className="w-4 h-4 text-blue-200" />
                          <span>Certified</span>
                        </div>
                      </div> */}

                      {/* Action Button */}
                      <button
                        onClick={() => onServiceClick(service)}
                        className={`w-full ${categoryColor} hover:bg-blue-600 text-white px-6 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group border border-blue-300`}
                      >
                        <span>Explore Service</span>
                        <ArrowRight className="w-5 h-5 group-hover:tranblue-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;