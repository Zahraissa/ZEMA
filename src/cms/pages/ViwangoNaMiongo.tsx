import React, { useState, useEffect } from 'react';
import { Search, FileText, Eye, Download, ChevronDown } from 'lucide-react';
import { guidelinesService, Guideline } from '@/services/guidelinesService';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ViwangoNaMiongo: React.FC = () => {
  const [mainDocument, setMainDocument] = useState<Guideline | null>(null);
  const [relatedDocuments, setRelatedDocuments] = useState<Guideline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGuidelines();
  }, []);

  const loadGuidelines = async () => {
    try {
      setIsLoading(true);
      
      // Get main document
      const mainResponse = await fetch('/api/api/pictures/guidelines/main-document');
      const mainData = await mainResponse.json();
      if (mainData.success && mainData.data) {
        setMainDocument(mainData.data);
      }
      
      // Get related documents
      const relatedResponse = await fetch('/api/api/pictures/guidelines/related-documents');
      const relatedData = await relatedResponse.json();
      if (relatedData.success) {
        setRelatedDocuments(relatedData.data);
      }
    } catch (error) {
      console.error('Failed to load guidelines:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/api/pictures/guidelines/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        // Update the related documents with search results
        setRelatedDocuments(data.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = getDaySuffix(day);
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `Imechapishwa Tarehe: ${day}${suffix} ${month} ${year}`;
  };

  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Inapakia...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16"
        style={{backgroundImage: 'url(/banner.avif)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-normal mb-4">Viwango na Miongo</h1>
            <nav className="flex justify-center items-center space-x-2 text-sm">
              <a href="/" className="hover:text-blue-200 transition-colors">Mwanzo</a>
              <span>/</span>
              <span>Viwango na Miongo</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Main Container */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Search Bar */}
              <div className="mb-8">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Tafuta"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </form>
              </div>

              {/* Main Document Section */}
              {mainDocument && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <FileText className="w-6 h-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-normal text-gray-800">Nyaraka Mama</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Document Card */}
                    <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-normal text-gray-900 mb-2">
                        {mainDocument.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {formatDate(mainDocument.datePublished)}
                      </p>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => window.open(`/api/api/pictures/guidelines/${mainDocument.id}`, '_blank')}
                          className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Tazama
                        </button>
                        <button 
                          onClick={() => window.open(`/api/api/guidelines/${mainDocument.id}/download`, '_blank')}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Pakua
                        </button>
                      </div>
                    </div>

                    {/* Document Description Panel */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h4 className="font-normal text-gray-900 mb-3">Maelezo Ya Nyaraka</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {mainDocument.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Related Documents Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="w-6 h-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-normal text-gray-800">
                      Inayohusiana ({relatedDocuments.length})
                    </h2>
                  </div>
                  <button className="text-orange-500 hover:text-orange-600 font-normal flex items-center">
                    Tazama nyaraka zaidi <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>

                {/* Related Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedDocuments.map((document) => (
                    <div key={document.id} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-base font-normal text-gray-900 mb-2 line-clamp-2">
                        {document.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {formatDate(document.datePublished)}
                      </p>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => window.open(`/api/api/pictures/guidelines/${document.id}`, '_blank')}
                          className="flex items-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Tazama
                        </button>
                        <button 
                          onClick={() => window.open(`/api/api/pictures/guidelines/${document.id}/download`, '_blank')}
                          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Pakua
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {relatedDocuments.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Hakuna nyaraka zinazohusiana zinazopatikana</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ViwangoNaMiongo;
