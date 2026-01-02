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
  RefreshCw,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  List,
  Sparkles,
  TrendingUp,
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
import { managementAPI, publicAPI, Guide } from '@/services/api';
import Swal from 'sweetalert2';
import { STORAGE_BASE_URL } from '@/config';

const ManageOrodha: React.FC = () => {
  const [orodha, setOrodha] = useState<Guide[]>([]);
  const [filteredOrodha, setFilteredOrodha] = useState<Guide[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orodhaToDelete, setOrodhaToDelete] = useState<Guide | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrodha();
  }, []);

  useEffect(() => {
    filterOrodha();
  }, [searchQuery, selectedStatus, orodha]);

  const loadOrodha = async () => {
    try {
      setIsLoading(true);
      
      // Fetch guides filtered by "Orodha ya Viwango na Miongozo" category
      const params: any = {
        category: 'Orodha ya Viwango na Miongozo'
      };
      
      const response = await managementAPI.getGuides(params);
      console.log('Orodha response:', response);
      
      // Handle paginated response
      const guides: Guide[] = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.data || []);
      setOrodha(guides);
      setFilteredOrodha(guides);
      
    } catch (error: any) {
      console.error('Failed to load orodha:', error);
      
      // Check if it's an authentication error (401)
      if (error.response?.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Makosa ya Uthibitishaji',
          text: 'Huna ruhusa ya kufikia. Tafadhali ingia tena.',
          confirmButtonColor: '#3085d6'
        });
        return;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Makosa',
        text: 'Imeshindwa kupakia orodha. Tafadhali jaribu tena.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrodha = () => {
    let filtered = orodha;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.author && item.author.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    setFilteredOrodha(filtered);
  };

  const handleDelete = async () => {
    if (!orodhaToDelete) return;

    try {
      await managementAPI.deleteGuide(orodhaToDelete.id);
      
      Swal.fire({
        icon: 'success',
        title: 'Imefanikiwa!',
        text: 'Orodha imefutwa kwa mafanikio.',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true
      });
      
      loadOrodha();
    } catch (error: any) {
      console.error('Failed to delete orodha:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Makosa',
        text: 'Imeshindwa kufuta orodha. Tafadhali jaribu tena.',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setDeleteDialogOpen(false);
      setOrodhaToDelete(null);
    }
  };

  const handleDownload = async (guide: Guide) => {
    try {
      if (!guide.file_name || !guide.file_path) {
        Swal.fire({
          icon: 'warning',
          title: 'Faili Haipatikani',
          text: 'Faili ya orodha haipatikani kwa kupakua.',
          confirmButtonColor: '#3085d6'
        });
        return;
      }

      // Show loading
      Swal.fire({
        title: 'Inapakua...',
        text: 'Tafadhali subiri, faili inapakuliwa',
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
        
        Swal.fire({
          icon: 'success',
          title: 'Imepakuliwa!',
          text: `"${guide.file_name}" inapakuliwa`,
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
        
        Swal.fire({
          icon: 'success',
          title: 'Imepakuliwa!',
          text: `"${guide.file_name}" inapakuliwa`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error downloading orodha:', error);
      Swal.fire({
        icon: 'error',
        title: 'Imeshindwa Kupakua',
        text: 'Imeshindwa kupakua faili. Tafadhali jaribu tena baadae.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleView = (guide: Guide) => {
    if (!guide.file_path || !guide.file_name) {
      Swal.fire({
        icon: 'warning',
        title: 'Faili Haipatikani',
        text: 'Faili ya orodha haipatikani kwa kutazama.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Open file in new tab
    const fileUrl = `${STORAGE_BASE_URL}${guide.file_path}`;
    window.open(fileUrl, '_blank');
  };

  const handleToggleStatus = async (guide: Guide) => {
    try {
      const newStatus = guide.status === 'active' ? 'inactive' : 'active';
      await managementAPI.updateGuideStatus(guide.id, newStatus);
      
      Swal.fire({
        icon: 'success',
        title: 'Imefanikiwa!',
        text: `Hali ya orodha imebadilishwa kuwa "${newStatus === 'active' ? 'Aktifu' : 'Haijaamilishwa'}"`,
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true
      });
      
      loadOrodha();
    } catch (error: any) {
      console.error('Failed to update status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Makosa',
        text: 'Imeshindwa kubadilisha hali. Tafadhali jaribu tena.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktifu';
      case 'inactive':
        return 'Haijaamilishwa';
      case 'draft':
        return 'Rasimu';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('sw-TZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const statuses = ['all', 'active', 'inactive', 'draft'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                <List className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Usimamizi wa Orodha</h1>
                <p className="text-gray-600 mt-1">Dhibiti orodha zote za e-Government Authority</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate('/cms/add-orodha')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Ongeza Orodha
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Jumla ya Orodha</p>
                  <p className="text-3xl font-bold text-gray-900">{orodha.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Orodha za Aktifu</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {orodha.filter(o => o.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl">
                  <XCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Haijaamilishwa</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {orodha.filter(o => o.status === 'inactive').length}
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
                  <p className="text-3xl font-bold text-gray-900">{filteredOrodha.length}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Tafuta orodha..."
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
              <Button 
                variant="outline" 
                onClick={loadOrodha} 
                disabled={isLoading}
                className="h-12 border-2 hover:bg-gray-50"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Osha upya
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orodha Table */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-50/50 border-b border-gray-100">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="p-2 bg-purple-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span>Orodha ({filteredOrodha.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium">Inapakia orodha...</p>
                </div>
              </div>
            ) : filteredOrodha.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-gray-900">Jina la Hati</TableHead>
                      <TableHead className="font-semibold text-gray-900">Hali</TableHead>
                      <TableHead className="font-semibold text-gray-900">Faili</TableHead>
                      <TableHead className="font-semibold text-gray-900">Tarehe</TableHead>
                      <TableHead className="font-semibold text-gray-900 text-right">Vitendo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrodha.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="py-4">
                          <div>
                            <div className="font-semibold text-gray-900 text-base">{item.title}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className={`${getStatusColor(item.status)} font-medium flex items-center gap-1.5 w-fit`}>
                            {item.status === 'active' ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {getStatusText(item.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          {item.file_name ? (
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-100 rounded-lg">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900 block">{item.file_name}</span>
                                {item.file_size && (
                                  <span className="text-xs text-gray-500">
                                    {(Number(item.file_size) / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Hakuna faili</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {formatDate(item.created_at)}
                          </div>
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
                                onClick={() => navigate(`/cms/edit-orodha/${item.id}`)}
                                className="cursor-pointer"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Hariri
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleView(item)}
                                className="cursor-pointer"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Tazama
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDownload(item)}
                                className="cursor-pointer"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Pakua
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleToggleStatus(item)}
                                className="cursor-pointer"
                              >
                                {item.status === 'active' ? (
                                  <>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Fanya Haijaamilishwa
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Fanya Aktifu
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setOrodhaToDelete(item);
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
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Hakuna orodha zinazopatikana
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchQuery || selectedStatus !== 'all' 
                    ? 'Hakuna orodha zinazofanana na vichujio ulivyochagua. Jaribu kubadilisha vichujio vyako.'
                    : 'Bado hujaongeza orodha yoyote. Bofya "Ongeza Orodha" kuanza kuongeza orodha mpya.'}
                </p>
                {(!searchQuery && selectedStatus === 'all') && (
                  <Button 
                    onClick={() => navigate('/cms/add-orodha')}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ongeza Orodha ya Kwanza
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
                Kitendo hiki hakiwezi kurekebishwa. Hii itafuta orodha <span className="font-semibold text-gray-900">"{orodhaToDelete?.title}"</span> 
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

export default ManageOrodha;

