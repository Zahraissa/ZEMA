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
  FileCode,
  Clock,
  Target,
  Layers,
  BookOpen,
  Shield,
  CheckCircle
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
import { enhancedGuidelinesService, GuidelineStandard } from '@/services/enhancedGuidelinesService';
import { toast } from 'sonner';

const ViwangoNaMiongozoManagement: React.FC = () => {
  const [standards, setStandards] = useState<GuidelineStandard[]>([]);
  const [filteredStandards, setFilteredStandards] = useState<GuidelineStandard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStandardType, setSelectedStandardType] = useState('all');
  const [selectedMaturityLevel, setSelectedMaturityLevel] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [standardToDelete, setStandardToDelete] = useState<GuidelineStandard | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadStandards();
  }, []);

  useEffect(() => {
    filterStandards();
  }, [searchQuery, selectedStatus, selectedCategory, selectedStandardType, selectedMaturityLevel, standards]);

  const loadStandards = async () => {
    try {
      setIsLoading(true);
      const allStandards = await enhancedGuidelinesService.getAllGuidelinesStandards();
      setStandards(allStandards);
      setFilteredStandards(allStandards);
      
      // Data loaded successfully
      if (allStandards.length > 0) {
        toast.success('Standards loaded successfully', {
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Failed to load standards:', error);
      toast.error('Failed to load standards');
    } finally {
      setIsLoading(false);
    }
  };

  const filterStandards = () => {
    let filtered = standards;

    if (searchQuery) {
      filtered = filtered.filter(standard =>
        standard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (standard.description && standard.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (standard.author && standard.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (standard.standard_type && standard.standard_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (standard.maturity_level && standard.maturity_level.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(standard => standard.status === selectedStatus);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(standard => standard.category === selectedCategory);
    }

    if (selectedStandardType !== 'all') {
      filtered = filtered.filter(standard => standard.standard_type === selectedStandardType);
    }

    if (selectedMaturityLevel !== 'all') {
      filtered = filtered.filter(standard => standard.maturity_level === selectedMaturityLevel);
    }

    setFilteredStandards(filtered);
  };

  const handleDelete = async () => {
    if (!standardToDelete) return;

    try {
      await enhancedGuidelinesService.deleteStandard(standardToDelete.id);
      setStandards(standards.filter(s => s.id !== standardToDelete.id));
      setFilteredStandards(filteredStandards.filter(s => s.id !== standardToDelete.id));
      toast.success('Standard deleted successfully');
    } catch (error) {
      console.error('Failed to delete standard:', error);
      toast.error('Failed to delete standard');
    } finally {
      setDeleteDialogOpen(false);
      setStandardToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aktifu';
      case 'draft': return 'Rasimu';
      case 'archived': return 'Imekusanywa';
      default: return status;
    }
  };

  const getMaturityColor = (maturity: string) => {
    switch (maturity?.toLowerCase()) {
      case 'established': return 'bg-green-100 text-green-800 border-green-200';
      case 'pilot': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'development': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'proposed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMaturityIcon = (maturity: string) => {
    switch (maturity?.toLowerCase()) {
      case 'established': return <CheckCircle className="w-3 h-3" />;
      case 'pilot': return <Target className="w-3 h-3" />;
      case 'development': return <Layers className="w-3 h-3" />;
      case 'proposed': return <FileText className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const getMaturityText = (maturity: string) => {
    switch (maturity?.toLowerCase()) {
      case 'established': return 'Imethibitishwa';
      case 'pilot': return 'Majaribio';
      case 'development': return 'Inaendelea';
      case 'proposed': return 'Imependekezwa';
      default: return maturity || 'Hakuna maelezo';
    }
  };

  const getStandardTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'technical standard': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'framework': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'guideline': return 'bg-green-100 text-green-800 border-green-200';
      case 'policy': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStandardTypeText = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'technical standard': return 'Kiwango cha Kiufundi';
      case 'framework': return 'Mfumo';
      case 'guideline': return 'Mwongozo';
      case 'policy': return 'Sera';
      default: return type || 'Hakuna maelezo';
    }
  };

  const categories = ['all', ...Array.from(new Set(standards.map(s => s.category).filter(Boolean)))];
  const standardTypes = ['all', ...Array.from(new Set(standards.map(s => s.standard_type).filter(Boolean)))];
  const maturityLevels = ['all', ...Array.from(new Set(standards.map(s => s.maturity_level).filter(Boolean)))];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading standards...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-gray-900">Viwango na Miongozo</h1>
          <p className="text-gray-600">Manage standards and guidelines for government services</p>
        </div>
        <Button onClick={() => navigate('/cms/add-standard')}>
          <Plus className="w-4 h-4 mr-2" />
          Ongeza Kiwango
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-normal text-gray-600">Jumla ya Viwango</p>
                <p className="text-2xl font-normal text-gray-900">{standards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-normal text-gray-600">Viwango Vya Aktifu</p>
                <p className="text-2xl font-normal text-gray-900">
                  {standards.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-normal text-gray-600">Rasimu</p>
                <p className="text-2xl font-normal text-gray-900">
                  {standards.filter(s => s.status === 'draft').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-normal text-gray-600">Viwango Vya Juu</p>
                <p className="text-2xl font-normal text-gray-900">
                  {standards.filter(s => s.featured).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filti na Utafutaji</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-normal">Tafuta</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tafuta viwango..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-normal">Hali</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chagua hali" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Zote</SelectItem>
                  <SelectItem value="active">Aktifu</SelectItem>
                  <SelectItem value="draft">Rasimu</SelectItem>
                  <SelectItem value="archived">Imekusanywa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-normal">Kategoria</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Chagua kategoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Zote</SelectItem>
                  {categories.filter(c => c !== 'all').map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-normal">Aina ya Kiwango</label>
              <Select value={selectedStandardType} onValueChange={setSelectedStandardType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chagua aina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Zote</SelectItem>
                  {standardTypes.filter(t => t !== 'all').map(type => (
                    <SelectItem key={type} value={type}>{getStandardTypeText(type)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-normal">Kiwango cha Ukuaji</label>
              <Select value={selectedMaturityLevel} onValueChange={setSelectedMaturityLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Chagua kiwango" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Zote</SelectItem>
                  {maturityLevels.filter(m => m !== 'all').map(level => (
                    <SelectItem key={level} value={level}>{getMaturityText(level)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standards Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Viwango na Miongozo ({filteredStandards.length})</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={loadStandards}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Ongeza Upya
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStandards.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-normal text-gray-900 mb-2">Hakuna viwango</h3>
              <p className="text-gray-500 mb-4">Hakuna viwango vilivyopatikana kwa kigezo ulichochagua.</p>
              <Button onClick={() => navigate('/cms/add-standard')}>
                <Plus className="w-4 h-4 mr-2" />
                Ongeza Kiwango cha Kwanza
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kiwango</TableHead>
                    <TableHead>Kategoria</TableHead>
                    <TableHead>Aina</TableHead>
                    <TableHead>Kiwango cha Ukuaji</TableHead>
                    <TableHead>Hali</TableHead>
                    <TableHead>Mwandishi</TableHead>
                    <TableHead>Tarehe</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStandards.map((standard) => (
                    <TableRow key={standard.id}>
                      <TableCell>
                        <div>
                          <div className="font-normal text-gray-900">{standard.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {standard.description}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            <span className="font-normal">Toleo:</span> v{standard.version}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{standard.category || 'Hakuna kategoria'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStandardTypeColor(standard.standard_type)}>
                          <div className="flex items-center gap-1">
                            {getStandardTypeText(standard.standard_type)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getMaturityColor(standard.maturity_level)}>
                          <div className="flex items-center gap-1">
                            {getMaturityIcon(standard.maturity_level)}
                            {getMaturityText(standard.maturity_level)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(standard.status)}>
                          {getStatusText(standard.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-normal">{standard.author || 'Hakuna mwandishi'}</div>
                          <div className="text-gray-500">{standard.department || 'Hakuna idara'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-gray-900">
                            <Calendar className="w-3 h-3" />
                            {new Date(standard.date_published).toLocaleDateString('sw-TZ')}
                          </div>
                          <div className="text-gray-500">v{standard.version}</div>
                          {standard.tags && standard.tags.length > 0 && (
                            <div className="text-xs text-gray-400">
                              <span className="font-normal">Vitambulisho:</span> {standard.tags.slice(0, 2).join(', ')}
                              {standard.tags.length > 2 && '...'}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Vitendo</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate(`/cms/edit-standard/${standard.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Hariri
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(standard.fileUrl, '_blank')}>
                              <Eye className="w-4 h-4 mr-2" />
                              Angalia
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(standard.fileUrl, '_blank')}>
                              <Download className="w-4 h-4 mr-2" />
                              Pakua
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setStandardToDelete(standard);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-red-600"
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
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Thibitisha Ufutaji</AlertDialogTitle>
            <AlertDialogDescription>
              Je, una uhakika unataka kufuta kiwango "{standardToDelete?.title}"? 
              Kitendo hiki hakiwezi kubatilishwa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Ghairi</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Futa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ViwangoNaMiongozoManagement;
