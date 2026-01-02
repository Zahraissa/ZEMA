import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  CheckCircle,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  Shield,
  Award,
  Star,
  FileText,
  Users,
  Zap,
  TrendingUp,
  Target,
  Headphones,
  MessageCircle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFieldByServiceIdQueryHook } from '@/hooks/useBillingQueryHook';
import { TServiceResponse } from '@/type/TServiceResponse';
import OrderTrack from './service-component/OrderTrack';
import ApplicationForm from './service-component/ApplicationForm';
import { useBillDetailStore } from '@/store/bill-detail-store';

const ServiceDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const service = (location.state as { service?: TServiceResponse } | null)?.service;
  const { billDetail: { serviceId } } = useBillDetailStore();
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!serviceId) {
      navigate('/services');
    }
  }, [serviceId, navigate]);

  const { field: fields, isLoadingField } = useFieldByServiceIdQueryHook(serviceId);

  const handleInputChange = (fieldId: number, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  if (isLoadingField) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50/30">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <h3 className="text-xl font-light text-blue-500 mb-2">Loading Service Details</h3>
            <p className="text-blue-400">Please wait while we fetch the service information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50/30">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-200">
              <Briefcase className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-2xl font-light text-blue-500 mb-2">Service Not Found</h3>
            <p className="text-blue-400 mb-6">The service you're looking for could not be found.</p>
            <Link
              to="/services"
              className="inline-flex items-center bg-blue-500 hover:bg-blue-500 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 border border-blue-500"
            >
              Back to Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50/30">
      <Header />

      {/* Hero Header */}
      <section className="relative bg-gradient-to-br from-blue-300/10 via-blue-400/10 to-blue-500/10 text-white py-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300/20 via-blue-400/30 to-blue-500/20"></div>

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            {/* <nav className="flex items-center space-x-2 text-sm mb-8 text-blue-200">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/services" className="hover:text-white transition-colors">Services</Link>
              <span>/</span>
              <span className="text-white">{service.serviceName}</span>
            </nav> */}

            {/* Service Header */}
            <div className="flex items-start gap-6">
              <div className="w-20 h-20  backdrop-blur-sm rounded-3xl flex items-center justify-center flex-shrink-0 border border-white/20">
                <Briefcase className="w-10 h-10 text-blue-800/70" />
              </div>

              <div className="flex-1">
                <Badge className="bg-white backdrop-blur-sm text-blue-300 border border-blue-700/30 px-4 py-1.5 mb-4 font-medium">
                  <strong>{service.serviceGroup.groupName}</strong>
                </Badge>
                <h1 className="text-4xl md:text-5xl font-light mb-4 text-blue-500/70">{service.serviceName}</h1>
                <p className="text-xl text-blue-600/50 leading-relaxed">
                <strong>
                  Professional government service with fast processing and secure handling
                </strong>
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 text-center border border-blue-500/70">
                <Clock className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                <div className="text-sm text-blue-300"><strong>Processing</strong></div>
                <div className="text-lg font-light text-white">24-48h</div>
              </div>
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 text-center border border-blue-500/70">
                <Shield className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                <div className="text-sm text-blue-300"><strong>Security</strong></div>
                <div className="text-lg font-light text-white">100%</div>
              </div>
              <div className="bg-white backdrop-blur-sm rounded-2xl p-4 text-center border border-blue-500/70">
                <Award className="w-6 h-6 mx-auto mb-2 text-blue-300" />
                <div className="text-sm text-blue-300"><strong>Success Rate</strong></div>
                <div className="text-lg font-light text-white">99.8%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 80L60 70C120 60 240 40 360 30C480 20 600 20 720 26.7C840 33.3 960 46.7 1080 50C1200 53.3 1320 46.7 1380 43.3L1440 40V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="rgb(255 255 255)" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 -mt-4 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Description Card */}
              <div className="bg-white rounded-3xl shadow-lg border border-blue-200/80 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-light text-blue-500">About This Service</h2>
                </div>

                <p className="text-blue-500 leading-relaxed text-lg mb-6">
                  {service.description}
                </p>

                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-xl font-light text-blue-500 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    Why Choose This Service?
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-500">Fast and efficient digital processing system</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-500">Expert guidance throughout the entire process</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-500">Secure document handling and data protection</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Application Form */}
              {Array.isArray(fields) && fields.length > 0 && (
                <div className="bg-white rounded-3xl shadow-lg border border-blue-200/80 p-8 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-3xl font-light text-blue-500">Application Form</h2>
                  </div>
                  <ApplicationForm fields={fields} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Pricing Card */}
              {service.serviceItemPricing?.unitPrice && (
                <div className="bg-gradient-to-br from-blue-500 to-blue-500 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden border border-blue-500/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="w-5 h-5 text-blue-200" />
                      <span className="text-sm font-medium">Premium Service</span>
                    </div>

                    <div className="mb-6">
                      <div className="text-5xl font-light mb-2">TZS {service.serviceItemPricing.unitPrice}/=</div>
                      <p className="text-blue-200">One-time payment</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 text-blue-200" />
                        <span className="text-sm">Fast approval process</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 text-blue-200" />
                        <span className="text-sm">Expert consultation included</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 flex-shrink-0 text-blue-200" />
                        <span className="text-sm">Priority support access</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Track Application */}
              <OrderTrack />

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-500 text-white rounded-3xl shadow-lg p-8 text-center relative overflow-hidden border border-blue-400/30">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-light mb-3">Need Help?</h3>
                  <p className="text-blue-200 mb-6">
                    Contact us for expert assistance
                  </p>

                  <a
                    href="mailto:info@egaz.go.tz"
                    className="inline-block bg-white text-blue-500 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 mb-4 border border-white"
                  >
                    Email Support
                  </a>
                </div>
              </div>

              {/* Phone Contact */}
              <div className="bg-white rounded-3xl shadow-lg border border-blue-200/80 p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-blue-500">Have Questions?</p>
                    <a
                      href="tel:0900020003"
                      className="text-xl font-light text-blue-500 hover:text-blue-500 transition-colors"
                    >
                      0900 02 0003
                    </a>
                  </div>
                </div>
                <p className="text-sm text-blue-500">
                  Free consultation available Monday - Friday, 8AM - 5PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetails;