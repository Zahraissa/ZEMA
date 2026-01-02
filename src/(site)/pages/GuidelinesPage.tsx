import React, { useState, useEffect } from 'react';
import { Search, FileText, Eye, Download, ChevronDown, Calendar, Tag, Star, TrendingUp, Sparkles, FileCheck, ArrowRight, Shield, Award, BookOpen } from 'lucide-react';
import { publicAPI, Guide } from '@/services/api';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { STORAGE_BASE_URL } from "@/config";
import Swal from 'sweetalert2';

const GuidelinesPage: React.FC = () => {
  const [mainDocument, setMainDocument] = useState<Guide | null>(null);
  const [relatedDocuments, setRelatedDocuments] = useState<Guide[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGuidelines();
  }, []);

  const loadGuidelines = async () => {
    try {
      setIsLoading(true);
      
      // Get main document and related documents separately
      const [mainDocResponse, relatedDocsResponse] = await Promise.all([
        publicAPI.getMainDocument(),
        publicAPI.getRelatedDocuments()
      ]);
      
      if (mainDocResponse.success && mainDocResponse.data) {
        setMainDocument(mainDocResponse.data);
      }
      
      if (relatedDocsResponse.success) {
        setRelatedDocuments(relatedDocsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load guidelines:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load guidelines. Please try again later.',
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
      // If search is empty, reload all guidelines
      loadGuidelines();
      return;
    }
    
    try {
      setIsLoading(true);
      const searchResponse = await publicAPI.searchGuidelines(searchQuery);
      if (searchResponse.success) {
        const searchResults = searchResponse.data;
        
        // Update the related documents with search results
        setRelatedDocuments(searchResults);
        
        // Clear main document for search results
        setMainDocument(null);
      }
    } catch (error) {
      console.error('Search failed:', error);
      Swal.fire({
        title: 'Search Error',
        text: 'Failed to search guidelines. Please try again.',
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

  const handleDownload = async (guide: Guide) => {
    try {
      // Check if file is available (either file_path or file_url)
      const hasFile = (guide.file_name && guide.file_path) || guide.file_url;
      
      if (!hasFile) {
        Swal.fire({
          title: 'File Not Available',
          text: 'PDF file not available for download',
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

      // Try API download first (only if file_path exists)
      if (guide.file_path) {
        try {
          const blob = await publicAPI.downloadGuideline(guide.id);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = guide.file_name || 'document.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // Success message
          Swal.fire({
            title: 'Download Started!',
            text: `"${guide.file_name || 'document.pdf'}" is being downloaded`,
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
          a.download = guide.file_name || 'document.pdf';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Success message
          Swal.fire({
            title: 'Download Started!',
            text: `"${guide.file_name || 'document.pdf'}" is being downloaded`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        }
      } else if (guide.file_url) {
        // Handle external file URLs
        const fileUrl = guide.file_url.startsWith('http') ? guide.file_url : `${STORAGE_BASE_URL}${guide.file_url}`;
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = guide.file_name || 'document.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Success message
        Swal.fire({
          title: 'Download Started!',
          text: `"${guide.file_name || 'document.pdf'}" is being downloaded`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error downloading guide:', error);
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
      // Check if file is available (either file_path or file_url)
      const hasFile = (guide.file_name && guide.file_path) || guide.file_url;
      
      if (!hasFile) {
        Swal.fire({
          title: 'File Not Available',
          text: 'PDF file not available for viewing',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      // Determine the file URL for viewing
      let fileUrl: string;
      
      if (guide.file_path) {
        // Use stored file path - construct direct URL
        fileUrl = `${STORAGE_BASE_URL}${guide.file_path}`;
      } else if (guide.file_url) {
        // Use external file URL
        fileUrl = guide.file_url.startsWith('http') ? guide.file_url : `${STORAGE_BASE_URL}${guide.file_url}`;
      } else {
        throw new Error('No file path available');
      }

      // Open PDF directly in new tab for faster loading
      window.open(fileUrl, '_blank');

    } catch (error) {
      console.error('Error opening PDF:', error);
      Swal.fire({
        title: 'View Failed',
        text: 'Failed to open the PDF file. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-blue-50/30">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Inapakia miogozo ya kisera...</p>
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
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Miogozo ya Kisera za e-Government</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Miogozo ya <span className="text-yellow-300">Kisera</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Pata miogozo na miongozo bora zaidi kwa ajili ya miradi yako ya e-Government
            </p>
            <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
              <a href="/" className="hover:text-white transition-colors">Mwanzo</a>
              <span>/</span>
              <span className="text-white font-medium">Miogozo ya Kisera</span>
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
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{relatedDocuments.length + (mainDocument ? 1 : 0)}</p>
                    <p className="text-sm text-gray-600">Jumla ya Miogozo</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mainDocument ? 1 : 0}</p>
                    <p className="text-sm text-gray-600">Nyaraka Mama</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
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
                        placeholder="Tafuta miogozo ya kisera... (Andika jina, kategoria, au maelezo)"
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
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Nyaraka Mama</h2>
                      <p className="text-sm text-gray-600">Nyaraka kuu ya miogozo ya kisera</p>
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
                          {mainDocument.description || 'Hakuna maelezo ya nyaraka hii. Nyaraka hii ina miogozo muhimu ya kisera kwa ajili ya miradi ya e-Government.'}
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
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Miogozo Ya Kisera 
                      </h2>
                      <p className="text-sm text-gray-600">
                        {relatedDocuments.length} miogozo zilizopatikana
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
                      <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Hakuna Miogozo Zinazopatikana
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {searchQuery 
                        ? `Hakuna miogozo zinazofanana na "${searchQuery}". Jaribu kutafuta kwa maneno mengine.`
                        : 'Bado hakuna miogozo ya kisera zimewekwa. Tafadhali rudi baadaye.'}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          loadGuidelines();
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium"
                      >
                        <ArrowRight className="w-5 h-5" />
                        Onyesha Miogozo Zote
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
    </div>
  ); 
};

export default GuidelinesPage;
