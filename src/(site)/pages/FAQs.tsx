import React, { useState, useEffect } from 'react';
import { Search, Phone, MessageCircle, ChevronDown, ChevronUp, Badge } from 'lucide-react';
import { faqService, FAQ } from '@/services/faqService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFAQs();
  }, []);



  const loadFAQs = async () => {
    try {
      const activeFAQs = await faqService.getActiveFAQs();
      
      // Ensure we always set an array
      const faqsArray = Array.isArray(activeFAQs) ? activeFAQs : [];
      setFaqs(faqsArray);
      if (faqsArray.length > 0) {
        setActiveAccordion(faqsArray[0].id);
      }
    } catch (error) {
      console.error('Failed to load FAQs:', error);
      setFaqs([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFAQs = Array.isArray(faqs) ? faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const toggleAccordion = (id: number) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Page Header */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16"
      style={{backgroundImage: 'url(banner.avif)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-normal mb-4">FAQs</h1>
            <nav className="flex justify-center items-center space-x-2 text-sm">
              <a href="/" className="hover:text-blue-200 transition-colors">Home</a>
              <span>/</span>
              <span>FAQs</span>
            </nav>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Left Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-normal text-gray-900">
                        Frequently asked<br />questions
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-6">
                    There are many variations of passages the majority have suffered alteration in some believable.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-normal"
                  >
                    Contact
                  </a>
                </div>
              </div>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-2xl font-normal text-gray-900 mb-6">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="border border-gray-200 rounded-lg p-4">
                              <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        filteredFAQs.map((faq) => (
                          <div
                            key={faq.id}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <button
                              onClick={() => toggleAccordion(faq.id)}
                              className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                            >
                              <h4 className="font-normal text-gray-900 pr-4">{faq.question}</h4>
                              {activeAccordion === faq.id ? (
                                <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                              )}
                            </button>
                            {activeAccordion === faq.id && (
                              <div className="px-6 py-4 bg-white border-t border-gray-200">
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    {!isLoading && filteredFAQs.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No FAQs found matching your search.</p>
                      </div>
                    )}
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

export default FAQPage;
