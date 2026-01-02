import React, { useState, useEffect } from 'react';
import { Search, FileText, Eye, Download, ChevronDown, Calendar, Tag, Star, TrendingUp, Sparkles, FileCheck, ArrowRight, Filter } from 'lucide-react';
import { publicAPI, Guide } from '@/services/api';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PDFViewer from "@/components/PDFViewer";
import { STORAGE_BASE_URL } from "@/config";
import Swal from 'sweetalert2';

const SampleTemplatesPage: React.FC = () => {
  const [mainDocument, setMainDocument] = useState<Guide | null>(null);
  const [relatedDocuments, setRelatedDocuments] = useState<Guide[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<{ filePath: string; fileName: string } | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await publicAPI.getActiveGuides();
      
      if (response.success && response.data) {
        const guides = response.data;
        
        // Find guides with category "Sample Templates" or similar
        const templateGuides = guides.filter(guide => 
          guide.category.toLowerCase().includes('template') || 
          guide.category.toLowerCase().includes('sample') ||
          guide.title.toLowerCase().includes('template') ||
          guide.title.toLowerCase().includes('sample') ||
          guide.title.toLowerCase().includes('fomu') ||
          guide.title.toLowerCase().includes('mfano')
        );
        
        if (templateGuides.length > 0) {
          // Set the first featured guide as main document, or first guide if none featured
          const featuredGuide = templateGuides.find(g => g.featured) || templateGuides[0];
          setMainDocument(featuredGuide);
          
          // Set the rest as related documents
          const related = templateGuides.filter(g => g.id !== featuredGuide.id);
          setRelatedDocuments(related);
        } else {
          // If no specific template guides, use all guides as fallback
          if (guides.length > 0) {
            const featuredGuide = guides.find(g => g.featured) || guides[0];
            setMainDocument(featuredGuide);
            const related = guides.filter(g => g.id !== featuredGuide.id);
            setRelatedDocuments(related);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load templates. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // If search is empty, reload all templates
      loadTemplates();
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await publicAPI.getActiveGuides();
      
      if (response.success && response.data) {
        const guides = response.data;
        const filteredGuides = guides.filter(guide => 
          guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        // Update related documents with search results
        setRelatedDocuments(filteredGuides);
        
        // Keep main document if it matches search, otherwise clear it
        if (mainDocument && 
            (mainDocument.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             mainDocument.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             mainDocument.category.toLowerCase().includes(searchQuery.toLowerCase()))) {
          // Keep current main document
        } else {
          setMainDocument(null);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
      Swal.fire({
        title: 'Search Error',
        text: 'Failed to search templates. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
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

  const handleDownload = async (guide: Guide) => {
    try {
      if (!guide.file_name || !guide.file_path) {
        Swal.fire({
          title: 'File Not Available',
          text: 'Template file not available for download',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      // Show loading
      Swal.fire({
        title: 'Downloading...',
        text: 'Please wait while we prepare your file',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Try API download first
      try {
        const blob = await publicAPI.downloadGuide(guide.id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = guide.file_name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Success message
        Swal.fire({
          title: 'Download Started!',
          text: `"${guide.file_name}" is being downloaded`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (apiError) {
        console.warn('API download failed, trying direct file access:', apiError);
        
        // Fallback: try direct file access
        const fileUrl = `${STORAGE_BASE_URL}${guide.file_path}`;
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = guide.file_name;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Success message
        Swal.fire({
          title: 'Download Started!',
          text: `"${guide.file_name}" is being downloaded`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      Swal.fire({
        title: 'Download Failed',
        text: 'Failed to download the file. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleView = (guide: Guide) => {
    try {
      if (!guide.file_path || !guide.file_name) {
        Swal.fire({
          title: 'File Not Available',
          text: 'Template file not available for viewing',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      // Show loading message
      Swal.fire({
        title: 'Opening Template...',
        text: 'Please wait while we load the document',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Set the PDF for viewing
      setSelectedPdf({
        filePath: guide.file_path,
        fileName: guide.file_name
      });

      // Close the loading message after a short delay
      setTimeout(() => {
        Swal.close();
      }, 1000);

    } catch (error) {
      console.error('Error opening template:', error);
      Swal.fire({
        title: 'View Failed',
        text: 'Failed to open the template file. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-blue-50/30">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Inapakia mifumo na mfano...</p>
            <p className="text-gray-500 text-sm mt-2">Tafadhali subiri kidogo</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-blue-50/30">
      <Header />
      
      {/* Enhanced Page Header */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Mifumo na Mfano za Kujenga</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Mifumo na <span className="text-yellow-300">Mfano</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Pata mifumo na mfano bora zaidi kwa ajili ya miradi yako ya e-Government
            </p>
            <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
              <a href="/" className="hover:text-white transition-colors">Mwanzo</a>
              <span>/</span>
              <span className="text-white font-medium">Mifumo na Mfano</span>
            </nav>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20 -mt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{relatedDocuments.length + (mainDocument ? 1 : 0)}</p>
                    <p className="text-sm text-gray-600">Jumla ya Mifumo</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Star className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mainDocument ? 1 : 0}</p>
                    <p className="text-sm text-gray-600">Mifumo Maalum</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">100%</p>
                    <p className="text-sm text-gray-600">Bure na Wazi</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Container */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
              {/* Enhanced Search Bar */}
              <div className="mb-10">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-white rounded-2xl border-2 border-gray-200 focus-within:border-blue-500 transition-colors">
                    <div className="flex items-center">
                      <Search className="absolute left-6 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Tafuta mifumo na mfano... (Andika jina, kategoria, au maelezo)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 text-lg rounded-2xl focus:outline-none focus:ring-0"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
                      >
                        Tafuta
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Enhanced Main Document Section */}
              {mainDocument && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Mfano Maalum</h2>
                      <p className="text-sm text-gray-600">Mfano bora unaopendekezwa</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Enhanced Main Document Card */}
                    <div className="lg:col-span-2 group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                      <div className="relative bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-300 transition-all shadow-lg hover:shadow-2xl">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              {mainDocument.featured && (
                                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                                  <Star className="w-3 h-3 fill-current" />
                                  Maalum
                                </span>
                              )}
                              {mainDocument.category && (
                                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                                  <Tag className="w-3 h-3" />
                                  {mainDocument.category}
                                </span>
                              )}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                              {mainDocument.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(mainDocument.created_at)}
                              </div>
                              {mainDocument.view_count > 0 && (
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {mainDocument.view_count} tazama
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button 
                            onClick={() => handleView(mainDocument)}
                            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all font-medium group/btn"
                          >
                            <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                            Tazama
                          </button>
                          <button 
                            onClick={() => handleDownload(mainDocument)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium group/btn"
                          >
                            <Download className="w-5 h-5 group-hover/btn:animate-bounce" />
                            Pakua
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Description Panel */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-100 rounded-2xl transform rotate-1"></div>
                      <div className="relative bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-lg h-full">
                        <div className="flex items-center gap-2 mb-4">
                          <FileCheck className="w-5 h-5 text-blue-600" />
                          <h4 className="font-bold text-gray-900">Maelezo</h4>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-4">
                          {mainDocument.description || 'Hakuna maelezo ya mfano huu. Mfano huu unaweza kukusaidia kujenga miradi yako ya e-Government kwa urahisi na haraka.'}
                        </p>
                        {mainDocument.download_count > 0 && (
                          <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Download className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">{mainDocument.download_count} watumiaji wamepakua</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Related Documents Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Mifumo Inayohusiana
                      </h2>
                      <p className="text-sm text-gray-600">
                        {relatedDocuments.length} mifumo zilizopatikana
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Related Documents Grid */}
                {relatedDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relatedDocuments.map((document, index) => (
                      <div 
                        key={document.id} 
                        className="group relative bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 transition-all shadow-md hover:shadow-xl overflow-hidden"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-blue-500/5 transition-all"></div>
                        
                        <div className="relative p-6">
                          {/* Category Badge */}
                          {document.category && (
                            <div className="mb-3">
                              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                                <Tag className="w-3 h-3" />
                                {document.category}
                              </span>
                            </div>
                          )}
                          
                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {document.title}
                          </h3>
                          
                          {/* Date and Stats */}
                          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(document.created_at)}
                            </div>
                            {document.view_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {document.view_count}
                              </div>
                            )}
                          </div>
                          
                          {/* Description */}
                          {document.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {document.description}
                            </p>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-4 border-t border-gray-100">
                            <button 
                              onClick={() => handleView(document)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all text-sm font-medium group/btn"
                            >
                              <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                              Tazama
                            </button>
                            <button 
                              onClick={() => handleDownload(document)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg text-sm font-medium group/btn"
                            >
                              <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                              Pakua
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Enhanced Empty State */
                  <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                      <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Hakuna Mifumo Zinazopatikana
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {searchQuery 
                        ? `Hakuna mifumo zinazofanana na "${searchQuery}". Jaribu kutafuta kwa maneno mengine.`
                        : 'Bado hakuna mifumo na mfano zimewekwa. Tafadhali rudi baadaye.'}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          loadTemplates();
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium"
                      >
                        <ArrowRight className="w-5 h-5" />
                        Onyesha Mifumo Zote
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <PDFViewer
          filePath={selectedPdf.filePath}
          fileName={selectedPdf.fileName}
          isOpen={!!selectedPdf}
          onClose={() => setSelectedPdf(null)}
          onDownload={() => {
            if (selectedPdf) {
              const guide = mainDocument || relatedDocuments.find(doc => doc.file_path === selectedPdf.filePath);
              if (guide) {
                handleDownload(guide);
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default SampleTemplatesPage;
