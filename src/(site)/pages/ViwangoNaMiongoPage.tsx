import React, { useState, useEffect } from 'react';
import { Search, FileText, Eye, Download, Calendar, ArrowRight, Target, Award, Layers, CheckCircle } from 'lucide-react';
import { publicAPI, GuidelineStandard, GroupWithStandards } from '@/services/api';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { STORAGE_BASE_URL } from "@/config";
import Swal from 'sweetalert2';

const ViwangoNaMiongoPage: React.FC = () => {
  const [groups, setGroups] = useState<GroupWithStandards[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGroupsWithStandards();
  }, []);

  const loadGroupsWithStandards = async () => {
    try {
      setIsLoading(true);
      
      // Get groups with their standards organized
      const response = await publicAPI.getGroupsWithStandards();
      
      if (response.success && response.data) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Failed to load groups with standards:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load standards. Please try again later.',
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
      // If search is empty, reload all groups
      loadGroupsWithStandards();
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await publicAPI.searchStandards(searchQuery);
      
      if (response.success && response.data) {
        const searchResults = response.data;
        
        // Group search results by group_id
        const groupedResults = searchResults.reduce((acc: { [key: number]: GroupWithStandards }, standard) => {
          if (!acc[standard.group_id]) {
            acc[standard.group_id] = {
              id: standard.group_id,
              name: `Group ${standard.group_id}`, // Fallback name
              description: '',
              order: 0,
              main_document: null,
              related_documents: [],
              total_documents: 0
            };
          }
          
          // Set first result as main document, rest as related
          if (!acc[standard.group_id].main_document) {
            acc[standard.group_id].main_document = standard;
          } else {
            acc[standard.group_id].related_documents.push(standard);
          }
          acc[standard.group_id].total_documents++;
          
          return acc;
        }, {});
        
        setGroups(Object.values(groupedResults));
      }
    } catch (error) {
      console.error('Search failed:', error);
      Swal.fire({
        title: 'Search Error',
        text: 'Failed to search standards. Please try again.',
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

  const formatPublishedDate = (dateString: string) => {
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

  const handleDownload = async (standard: GuidelineStandard) => {
    try {
      // Check if file is available (either file_path or fileUrl)
      const hasFile = (standard.file_name && standard.file_path) || standard.fileUrl;
      
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

      try {
        // Try using the download API endpoint first
        const blob = await publicAPI.downloadStandard(standard.id);
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = standard.file_name || 'document.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        // Success message
        Swal.fire({
          title: 'Download Started!',
          text: `"${standard.file_name || 'document.pdf'}" is being downloaded`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (apiError) {
        // Fallback to direct file access if API download fails
        console.warn('API download failed, trying direct access:', apiError);
        
        if (standard.file_path && standard.file_path.length > 0 && standard.file_path !== '0') {
          // Clean the file path and construct URL using STORAGE_BASE_URL (/api/api/pictures/)
          const cleanPath = standard.file_path.startsWith('pictures/') 
            ? standard.file_path.replace('pictures/', '') 
            : standard.file_path;
          
          // Ensure cleanPath is valid
          if (!cleanPath || cleanPath.length === 0 || cleanPath === '0' || /^\d+$/.test(cleanPath)) {
            throw new Error(`Invalid file path: ${standard.file_path}`);
          }
          
          const fileUrl = `${STORAGE_BASE_URL}${cleanPath}`;
          const a = document.createElement('a');
          a.href = fileUrl;
          a.download = standard.file_name || 'document.pdf';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Success message
          Swal.fire({
            title: 'Download Started!',
            text: `"${standard.file_name || 'document.pdf'}" is being downloaded`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else if (standard.fileUrl && standard.fileUrl.includes('/api/api/pictures/')) {
          // Handle external file URLs that use correct path
          const fileUrl = standard.fileUrl.startsWith('http') ? standard.fileUrl : `${STORAGE_BASE_URL}${standard.fileUrl}`;
          const a = document.createElement('a');
          a.href = fileUrl;
          a.download = standard.file_name || 'document.pdf';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Success message
          Swal.fire({
            title: 'Download Started!',
            text: `"${standard.file_name || 'document.pdf'}" is being downloaded`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error('No file available');
        }
      }
    } catch (error: any) {
      console.error('Error downloading standard:', error);
      Swal.fire({
        title: 'Download Failed',
        text: error.message || 'Failed to download the file. Please try again later.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleView = (standard: GuidelineStandard) => {
    try {
      // Check if file is available (either file_path or fileUrl)
      const hasFile = (standard.file_name && standard.file_path) || standard.fileUrl;
      
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
      
      // Prefer fileUrl from backend if it's a valid HTTP URL with correct path
      if (standard.fileUrl && standard.fileUrl.startsWith('http') && standard.fileUrl.includes('/api/api/pictures/')) {
        fileUrl = standard.fileUrl;
      } else if (standard.file_path && standard.file_path.length > 0 && standard.file_path !== '0') {
        // Use stored file path - construct URL using STORAGE_BASE_URL (/api/api/pictures/)
        // Remove 'storage/' prefix if present
        const cleanPath = standard.file_path.startsWith('storage/') 
          ? standard.file_path.replace('storage/', '') 
          : standard.file_path;
        
        // Ensure cleanPath is valid (not empty, not '0', not just a number)
        if (!cleanPath || cleanPath.length === 0 || cleanPath === '0' || /^\d+$/.test(cleanPath)) {
          throw new Error(`Invalid file path: ${standard.file_path}`);
        }
        
        fileUrl = `${STORAGE_BASE_URL}${cleanPath}`;
      } else if (standard.fileUrl) {
        // Use external file URL
        fileUrl = standard.fileUrl.startsWith('http') ? standard.fileUrl : `${STORAGE_BASE_URL}${standard.fileUrl}`;
      } else {
        throw new Error('No file path available');
      }
      
      // Validate URL - ensure it uses /api/api/pictures/ not /storage/
      if (!fileUrl || fileUrl.includes('/storage/') || fileUrl.includes('/storage/0')) {
        console.error('Invalid file URL:', { fileUrl, file_path: standard.file_path, fileUrl_attr: standard.fileUrl });
        throw new Error(`Invalid file URL. Must use /api/api/pictures/ path but got: ${fileUrl}`);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-blue-50/30">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Inapakia viwango na miongo...</p>
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
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">Viwango na Miongozo za e-Government</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Viwango na <span className="text-yellow-300">Miongozo</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Pata viwango na miongozo bora zaidi kwa ajili ya miradi yako ya e-Government
            </p>
            <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
              <a href="/" className="hover:text-white transition-colors">Mwanzo</a>
              <span>/</span>
              <span className="text-white font-medium">Viwango na Miongo</span>
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
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
                    <p className="text-sm text-gray-600">Makundi ya Viwango</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{groups.reduce((sum, g) => sum + (g.main_document ? 1 : 0), 0)}</p>
                    <p className="text-sm text-gray-600">Nyaraka Mama</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{groups.reduce((sum, g) => sum + g.total_documents, 0)}</p>
                    <p className="text-sm text-gray-600">Jumla ya Viwango</p>
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
                        placeholder="Tafuta viwango na miongo... (Andika jina, aina, au maelezo)"
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

              {/* Groups with Standards - Hierarchical Structure */}
              {groups.length > 0 ? (
                <div className="space-y-16">
                  {groups.map((group, groupIndex) => (
                    <div key={group.id} className="space-y-8">
                      {/* Main Document Section */}
                      {group.main_document && (
                        <div>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                              <Award className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900">Nyaraka Mama</h2>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Document Card - Left Side */}
                            <div className="lg:col-span-2">
                              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                  {group.main_document.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                  {formatPublishedDate(group.main_document.date_published)}
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  <button 
                                    onClick={() => handleView(group.main_document!)}
                                    className="flex items-center gap-2 px-6 py-2.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Tazama
                                  </button>
                                  <button 
                                    onClick={() => handleDownload(group.main_document!)}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium"
                                  >
                                    <Download className="w-4 h-4" />
                                    Pakua
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Description Panel - Right Side */}
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                              <h4 className="font-bold text-gray-900 mb-3">Maelezo Ya Nyaraka</h4>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {group.main_document.description || 'Hakuna maelezo ya nyaraka hii. Nyaraka hii ina viwango na miongozo muhimu kwa ajili ya miradi ya e-Government.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Related Documents Section */}
                      {group.related_documents.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-6">
                            Inayohusiana ({group.related_documents.length}) <span className="text-sm font-normal text-gray-600">Tazama nyaraka zaidi ↓</span>
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {group.related_documents.map((document) => (
                              <div 
                                key={document.id} 
                                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                                  {document.title}
                                </h4>
                                <p className="text-sm text-gray-600 mb-4">
                                  {formatPublishedDate(document.date_published)}
                                </p>
                                <div className="flex gap-2 pt-4 border-t border-gray-100">
                                  <button 
                                    onClick={() => handleView(document)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                                  >
                                    <Eye className="w-4 h-4" />
                                    Tazama
                                  </button>
                                  <button 
                                    onClick={() => handleDownload(document)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                                  >
                                    <Download className="w-4 h-4" />
                                    Pakua
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                    <Target className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Hakuna Viwango Zinazopatikana
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {searchQuery 
                      ? `Hakuna viwango zinazofanana na "${searchQuery}". Jaribu kutafuta kwa maneno mengine.`
                      : 'Bado hakuna viwango na miongo zimewekwa. Tafadhali rudi baadaye.'}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        loadGroupsWithStandards();
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-medium"
                    >
                      <ArrowRight className="w-5 h-5" />
                      Onyesha Viwango Zote
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default ViwangoNaMiongoPage;
