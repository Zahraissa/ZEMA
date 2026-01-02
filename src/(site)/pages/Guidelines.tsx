import React, { useState, useEffect } from 'react';
import {
    FileText,
    Download,
    Calendar,
    User,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    BookOpen,
    Shield,
    Award,
    CheckCircle,
    AlertCircle,
    Info,
    Clock,
    Tag,
    ArrowRight,
    MessageCircle, HomeIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { guidelinesService, Guideline } from "@/services/guidelinesService";



const Guidelines: React.FC = () => {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [filteredGuidelines, setFilteredGuidelines] = useState<Guideline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Sample data - in real implementation, this would come from your API
  const sampleGuidelines: Guideline[] = [
    {
      id: 1,
      title: "Miongozo ya Usalama wa Mtandao wa Serikali",
      description: "Miongozo kamili ya usalama wa mtandao kwa ajili ya mifumo ya e-Government na huduma za kidijitali.",
      category: "Usalama wa Mtandao",
      documentType: "Miongozo",
      version: "2.1",
      datePublished: "2024-01-15",
      lastUpdated: "2024-03-20",
      status: "active",
      fileUrl: "/documents/cybersecurity-guidelines.pdf",
      tags: ["usalama", "mtandao", "e-government"],
      author: "Idara ya Usalama wa Mtandao",
      department: "eGAZ"
    },
    {
      id: 2,
      title: "Viwango vya Ubunifu wa Programu",
      description: "Viwango na miongozo ya ubunifu wa programu za kidijitali kwa ajili ya huduma za umma.",
      category: "Ubunifu wa Programu",
      documentType: "Viwango",
      version: "1.5",
      datePublished: "2023-11-10",
      lastUpdated: "2024-02-15",
      status: "active",
      fileUrl: "/documents/software-development-standards.pdf",
      tags: ["ubunifu", "programu", "viwango"],
      author: "Idara ya Teknolojia",
      department: "eGAZ"
    },
    {
      id: 3,
      title: "Miongozo ya Usimamizi wa Data",
      description: "Miongozo ya usimamizi wa data na faragha ya taarifa za wananchi katika mifumo ya e-Government.",
      category: "Usimamizi wa Data",
      documentType: "Miongozo",
      version: "1.2",
      datePublished: "2024-02-01",
      lastUpdated: "2024-02-01",
      status: "active",
      fileUrl: "/documents/data-management-guidelines.pdf",
      tags: ["data", "faragha", "usimamizi"],
      author: "Idara ya Data na Analytics",
      department: "eGAZ"
    },
    {
      id: 4,
      title: "Viwango vya Ufikiaji wa Huduma za Kidijitali",
      description: "Viwango vya ufikiaji na uwezo wa kutumia huduma za kidijitali kwa watu wenye ulemavu.",
      category: "Ufikiaji",
      documentType: "Viwango",
      version: "1.0",
      datePublished: "2023-09-20",
      lastUpdated: "2024-01-10",
      status: "active",
      fileUrl: "/documents/accessibility-standards.pdf",
      tags: ["ufikiaji", "ulemavu", "huduma"],
      author: "Idara ya Huduma za Umma",
      department: "eGAZ"
    },
    {
      id: 5,
      title: "Miongozo ya Usimamizi wa Miradi ya Teknolojia",
      description: "Miongozo kamili ya usimamizi wa miradi ya teknolojia na uboreshaji wa huduma za kidijitali.",
      category: "Usimamizi wa Miradi",
      documentType: "Miongozo",
      version: "2.0",
      datePublished: "2023-12-05",
      lastUpdated: "2024-03-01",
      status: "active",
      fileUrl: "/documents/project-management-guidelines.pdf",
      tags: ["usimamizi", "miradi", "teknolojia"],
      author: "Idara ya Miradi",
      department: "eGAZ"
    },
    {
      id: 6,
      title: "Viwango vya Usalama wa Taarifa",
      description: "Viwango vya usalama wa taarifa na miongozo ya ulinzi wa data muhimu za serikali.",
      category: "Usalama wa Taarifa",
      documentType: "Viwango",
      version: "1.8",
      datePublished: "2024-01-20",
      lastUpdated: "2024-02-28",
      status: "active",
      fileUrl: "/documents/information-security-standards.pdf",
      tags: ["usalama", "taarifa", "ulinzi"],
      author: "Idara ya Usalama",
      department: "eGAZ"
    }
  ];

  useEffect(() => {
    loadGuidelines();
  }, []);

  const loadGuidelines = async () => {
    try {
      setIsLoading(true);
      const activeGuidelines = await guidelinesService.getActiveGuidelines();
      setGuidelines(activeGuidelines);
      setFilteredGuidelines(activeGuidelines);
    } catch (error) {
      console.error('Failed to load guidelines:', error);
      // Fallback to sample data if API fails
      setGuidelines(sampleGuidelines);
      setFilteredGuidelines(sampleGuidelines);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    filterGuidelines();
  }, [searchQuery, selectedCategory, selectedStatus, selectedType, guidelines]);

  const filterGuidelines = () => {
    let filtered = guidelines;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(guideline =>
        guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guideline.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guideline.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(guideline => guideline.category === selectedCategory);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(guideline => guideline.status === selectedStatus);
    }

    // Filter by document type
    if (selectedType !== 'all') {
      filtered = filtered.filter(guideline => guideline.documentType === selectedType);
    }

    setFilteredGuidelines(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Inatumika';
      case 'draft':
        return 'Rasimu';
      case 'archived':
        return 'Iliyohifadhiwa';
      default:
        return status;
    }
  };

  const categories = ['all', ...Array.from(new Set(guidelines.map(g => g.category)))];
  const documentTypes = ['all', ...Array.from(new Set(guidelines.map(g => g.documentType)))];
  const statuses = ['all', 'active', 'draft', 'archived'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
        <section className="relative bg-green-500 text-white py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto">

                    <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Guidlines</h1>
                    <nav className="flex justify-center items-center space-x-2 text-sm text-blue-100">
                        <a href="/" className="flex items-center gap-1 hover:text-white transition-colors">
                            <HomeIcon className="w-4 h-4 text-white" />
                            <span>Home</span>
                        </a>
                        <span>/</span>
                        <span className="text-white font-medium">guidlines</span>
                    </nav>

                </div>
            </div>
        </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
              {/* Additional Information Section */}
              <div className="mt-16 grid lg:grid-cols-1 gap-8">
                  {/* Statistics */}
                      <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                              {/* Total Guidelines */}
                              <Card className="text-center">
                                  <CardContent className="pt-6">
                                      <div className="text-2xl font-normal text-blue-600">
                                          {guidelines.length}
                                      </div>
                                      <p className="text-sm text-gray-600">
                                          Guidlines
                                      </p>
                                  </CardContent>
                              </Card>

                              {/* Active Guidelines */}
                              <Card className="text-center">
                                  <CardContent className="pt-6">
                                      <div className="text-2xl font-normal text-green-600">
                                          {guidelines.filter(g => g.status === "active").length}
                                      </div>
                                      <p className="text-sm text-gray-600">
                                          Active
                                      </p>
                                  </CardContent>
                              </Card>

                              {/* Categories */}
                              <Card className="text-center">
                                  <CardContent className="pt-6">
                                      <div className="text-2xl font-normal text-purple-600">
                                          {Array.from(new Set(guidelines.map(g => g.category))).length}
                                      </div>
                                      <p className="text-sm text-gray-600">
                                          Not Active
                                      </p>
                                  </CardContent>
                              </Card>

                          </div>
                      </CardContent>
              </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="grid lg:grid-cols-3 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search for guidelines..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === 'all' ? 'All categories' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/*/!* Status Filter *!/*/}
                {/*<div>*/}
                {/*  <Select value={selectedStatus} onValueChange={setSelectedStatus}>*/}
                {/*    <SelectTrigger>*/}
                {/*      <SelectValue placeholder="Hali" />*/}
                {/*    </SelectTrigger>*/}
                {/*    <SelectContent>*/}
                {/*      {statuses.map(status => (*/}
                {/*        <SelectItem key={status} value={status}>*/}
                {/*          {status === 'all' ? 'Hali zote' : getStatusText(status)}*/}
                {/*        </SelectItem>*/}
                {/*      ))}*/}
                {/*    </SelectContent>*/}
                {/*  </Select>*/}
                {/*</div>*/}
              </div>
            </div>

            {/* Guidelines Grid */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredGuidelines.length > 0 ? (
                filteredGuidelines.map((guideline) => (
                  <Card key={guideline.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <Badge variant="outline" className={getStatusColor(guideline.status)}>
                            {getStatusText(guideline.status)}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          v{guideline.version}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-normal text-gray-900 mb-2">
                        {guideline.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(guideline.datePublished).toLocaleDateString('sw-TZ')}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{guideline.author}</span>
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {guideline.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {guideline.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {guideline.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{guideline.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        {guideline.fileUrl && (
                          <Button size="sm" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-normal text-gray-900 mb-2">
                    No guidlines available at the moment
                  </h3>
                  <p className="text-gray-600">
                    Try to change another filters
                  </p>
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

export default Guidelines;
