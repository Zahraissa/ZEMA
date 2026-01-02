import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  FileText,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle,
  Upload,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import { enhancedGuidelinesService, PolicyGuideline } from '@/services/enhancedGuidelinesService';
import { toast } from 'sonner';

const PolicyGuidelinesManagement: React.FC = () => {
  const [policyGuidelines, setPolicyGuidelines] = useState<PolicyGuideline[]>([]);
  const [filteredGuidelines, setFilteredGuidelines] = useState<PolicyGuideline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPolicyArea, setSelectedPolicyArea] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [guidelineToDelete, setGuidelineToDelete] = useState<PolicyGuideline | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPolicyGuidelines();
  }, []);

  useEffect(() => {
    filterPolicyGuidelines();
  }, [searchQuery, selectedStatus, selectedPolicyArea, policyGuidelines]);

  const loadPolicyGuidelines = async () => {
    try {
      setIsLoading(true);
      console.log('Starting to load policy guidelines...');
      
      // Check authentication status
      const token = localStorage.getItem('authToken');
      console.log('Auth token exists:', !!token);
      console.log('Auth token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      const allGuidelines = await enhancedGuidelinesService.getAllPolicyGuidelines();
      
      // Ensure we always have an array and log for debugging
      console.log('API Response:', allGuidelines);
      console.log('Type of response:', typeof allGuidelines);
      console.log('Is Array?', Array.isArray(allGuidelines));
      console.log('Response length:', Array.isArray(allGuidelines) ? allGuidelines.length : 'Not an array');
      
      if (Array.isArray(allGuidelines)) {
        setPolicyGuidelines(allGuidelines);
        setFilteredGuidelines(allGuidelines);
        console.log('Successfully loaded', allGuidelines.length, 'policy guidelines');
      } else {
        console.error('API returned non-array data:', allGuidelines);
        toast.error('API returned invalid data format');
        setPolicyGuidelines([]);
        setFilteredGuidelines([]);
      }
    } catch (error: any) {
      console.error('Failed to load policy guidelines:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Show more specific error message
      if (error.response?.status === 401) {
        toast.error('Unauthorized: Please log in to access policy guidelines');
        console.log('Redirecting to login...');
        navigate('/cms/login');
      } else if (error.response?.status === 404) {
        toast.error('API endpoint not found. Please check server configuration.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to load policy guidelines. Please check your connection.');
      }
      
      setPolicyGuidelines([]);
      setFilteredGuidelines([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPolicyGuidelines = () => {
    // Ensure we always work with an array
    const safeGuidelines = Array.isArray(policyGuidelines) ? policyGuidelines : [];
    let filtered = safeGuidelines;

    if (searchQuery) {
      filtered = filtered.filter(guideline =>
        guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guideline.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guideline.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guideline.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(guideline => guideline.status === selectedStatus);
    }

    if (selectedPolicyArea !== 'all') {
      filtered = filtered.filter(guideline => guideline.category === selectedPolicyArea);
    }

    setFilteredGuidelines(filtered);
  };

  const handleDelete = async () => {
    if (!guidelineToDelete) return;

    try {
      await enhancedGuidelinesService.deletePolicyGuideline(guidelineToDelete.id);
      toast.success('Policy guideline deleted successfully');
      loadPolicyGuidelines();
    } catch (error) {
      console.error('Failed to delete policy guideline:', error);
      toast.error('Failed to delete policy guideline');
    } finally {
      setDeleteDialogOpen(false);
      setGuidelineToDelete(null);
    }
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


  // Safe array operations with proper type checking
  const safePolicyGuidelines = Array.isArray(policyGuidelines) ? policyGuidelines : [];
  const policyAreas = ['all', ...Array.from(new Set(safePolicyGuidelines.map(g => g.category)))];
  const statuses = ['all', 'active', 'draft', 'archived'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Usimamizi wa Miongozo ya Sera</h1>
                <p className="text-gray-600 mt-1">Dhibiti miongozo ya sera vya e-Government Authority</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/cms/add-policy-guideline')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ongeza Miongozo ya Sera
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Jumla ya Miongozo</p>
                  <p className="text-3xl font-bold text-gray-900">{safePolicyGuidelines.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Inatumika</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {safePolicyGuidelines.filter(g => g.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Rasimu</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {safePolicyGuidelines.filter(g => g.status === 'draft').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <FileCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Zinazopatikana</p>
                  <p className="text-3xl font-bold text-gray-900">{filteredGuidelines.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-50/50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <span>Vichujio</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tafuta miongozo ya sera..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 h-12 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-500">
                  <SelectValue placeholder="Hali" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status === 'all' ? 'Hali zote' : getStatusText(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPolicyArea} onValueChange={setSelectedPolicyArea}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-500">
                  <SelectValue placeholder="Eneo la Sera" />
                </SelectTrigger>
                <SelectContent>
                  {policyAreas.map(area => (
                    <SelectItem key={area} value={area}>
                      {area === 'all' ? 'Eneo zote la sera' : area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={loadPolicyGuidelines} 
                disabled={isLoading}
                className="h-12 border-2 hover:bg-gray-50"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Osha upya
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Policy Guidelines Table */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-50/50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span>Miongozo ya Sera ({filteredGuidelines.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium">Inapakia miongozo ya sera...</p>
                </div>
              </div>
            ) : filteredGuidelines.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-gray-900">Jina la Miongozo ya Sera</TableHead>
                      <TableHead className="font-semibold text-gray-900">Maelezo Mafupi</TableHead>
                      <TableHead className="font-semibold text-gray-900">Faili</TableHead>
                      <TableHead className="font-semibold text-gray-900">Hali</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-right">Vitendo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuidelines.map((guideline) => (
                      <TableRow key={guideline.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="font-semibold text-gray-900 text-base">{guideline.title}</div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">{guideline.category}</Badge>
                              <Badge variant="outline" className="text-xs">{guideline.document_type}</Badge>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{guideline.author}</span>
                              <span>•</span>
                              <span>{guideline.department}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-700 line-clamp-3">
                              {guideline.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <span className="font-medium">v{guideline.version}</span>
                              <span>•</span>
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(guideline.date_published).toLocaleDateString('sw-TZ')}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {guideline.fileUrl ? (
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-100 rounded-lg">
                                <Upload className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm font-medium text-blue-600">Faili imewekwa</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Hakuna faili</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={`${getStatusColor(guideline.status)} font-medium flex items-center gap-1.5 w-fit`}>
                            {guideline.status === 'active' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : guideline.status === 'draft' ? (
                              <FileText className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {getStatusText(guideline.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel className="font-semibold">Vitendo</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  console.log('Edit button clicked for guideline ID:', guideline.id);
                                  console.log('Navigating to:', `/cms/edit-policy-guideline/${guideline.id}`);
                                  navigate(`/cms/edit-policy-guideline/${guideline.id}`);
                                }}
                                className="cursor-pointer"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Hariri
                              </DropdownMenuItem>
                              {guideline.fileUrl && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => window.open(guideline.fileUrl, '_blank')}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Tazama
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => window.open(guideline.fileUrl, '_blank')}
                                    className="cursor-pointer"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Pakua
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setGuidelineToDelete(guideline);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-red-600 cursor-pointer focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Futa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Hakuna miongozo ya sera zinazopatikana
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery || selectedStatus !== 'all' || selectedPolicyArea !== 'all'
                    ? 'Hakuna miongozo ya sera zinazofanana na vichujio ulivyochagua. Jaribu kubadilisha vichujio vyako.'
                    : 'Bado hujaongeza miongozo ya sera yoyote. Bofya "Ongeza Miongozo ya Sera" kuanza kuongeza miongozo mpya.'}
                </p>
                {(!searchQuery && selectedStatus === 'all' && selectedPolicyArea === 'all') && (
                  <Button 
                    onClick={() => navigate('/cms/add-policy-guideline')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ongeza Miongozo ya Sera ya Kwanza
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border-2 border-gray-200">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <AlertDialogTitle className="text-xl font-bold">Una uhakika?</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-base">
                Kitendo hiki hakiwezi kurekebishwa. Hii itafuta miongozo ya sera <span className="font-semibold text-gray-900">"{guidelineToDelete?.title}"</span> 
                {' '}na taarifa zake zote kwa kudumu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="border-2 hover:bg-gray-50">Ghairi</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete} 
                className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Futa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default PolicyGuidelinesManagement;
