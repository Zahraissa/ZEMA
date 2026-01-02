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
  RefreshCw
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
import { guidelinesService, Guideline } from '@/services/guidelinesService';
import { toast } from 'sonner';

const GuidelinesManagement: React.FC = () => {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [filteredGuidelines, setFilteredGuidelines] = useState<Guideline[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [guidelineToDelete, setGuidelineToDelete] = useState<Guideline | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadGuidelines();
  }, []);

  useEffect(() => {
    filterGuidelines();
  }, [searchQuery, selectedStatus, selectedCategory, guidelines]);

  const loadGuidelines = async () => {
    try {
      setIsLoading(true);
      const allGuidelines = await guidelinesService.getAllGuidelines();
      setGuidelines(allGuidelines);
      setFilteredGuidelines(allGuidelines);
    } catch (error) {
      console.error('Failed to load guidelines:', error);
      toast.error('Failed to load guidelines');
    } finally {
      setIsLoading(false);
    }
  };

  const filterGuidelines = () => {
    let filtered = guidelines;

    if (searchQuery) {
      filtered = filtered.filter(guideline =>
        guideline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guideline.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guideline.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(guideline => guideline.status === selectedStatus);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(guideline => guideline.category === selectedCategory);
    }

    setFilteredGuidelines(filtered);
  };

  const handleDelete = async () => {
    if (!guidelineToDelete) return;

    try {
      await guidelinesService.deleteGuideline(guidelineToDelete.id);
      toast.success('Guideline deleted successfully');
      loadGuidelines();
    } catch (error) {
      console.error('Failed to delete guideline:', error);
      toast.error('Failed to delete guideline');
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

  const categories = ['all', ...Array.from(new Set(guidelines.map(g => g.category)))];
  const statuses = ['all', 'active', 'draft', 'archived'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-normal text-gray-900">Usimamizi wa Miongozo na Viwango</h1>
          <p className="text-gray-600">Dhibiti miongozo na viwango vya e-Government Authority</p>
        </div>
        <Button onClick={() => navigate('/cms/add-guideline')}>
          <Plus className="w-4 h-4 mr-2" />
          Ongeza Miongozo
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Vichujio</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tafuta miongozo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Kategoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'Kategoria zote' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadGuidelines} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Osha upya
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guidelines Table */}
      <Card>
        <CardHeader>
          <CardTitle>Miongozo na Viwango ({filteredGuidelines.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2">Inapakia...</span>
            </div>
          ) : filteredGuidelines.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jina</TableHead>
                    <TableHead>Kategoria</TableHead>
                    <TableHead>Aina</TableHead>
                    <TableHead>Hali</TableHead>
                    <TableHead>Mwandishi</TableHead>
                    <TableHead>Tarehe</TableHead>
                    <TableHead>Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGuidelines.map((guideline) => (
                    <TableRow key={guideline.id}>
                      <TableCell>
                        <div>
                          <div className="font-normal text-gray-900">{guideline.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {guideline.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{guideline.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{guideline.documentType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(guideline.status)}>
                          {getStatusText(guideline.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-normal">{guideline.author}</div>
                          <div className="text-gray-500">{guideline.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(guideline.datePublished).toLocaleDateString('sw-TZ')}</div>
                          <div className="text-gray-500">v{guideline.version}</div>
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
                            <DropdownMenuItem onClick={() => navigate(`/cms/edit-guideline/${guideline.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Hariri
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(guideline.fileUrl, '_blank')}>
                              <Eye className="w-4 h-4 mr-2" />
                              Tazama
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(guideline.fileUrl, '_blank')}>
                              <Download className="w-4 h-4 mr-2" />
                              Pakua
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setGuidelineToDelete(guideline);
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
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-normal text-gray-900 mb-2">
                Hakuna miongozo zinazopatikana
              </h3>
              <p className="text-gray-600 mb-4">
                Hakuna miongozo zinazofanana na vichujio ulivyochagua.
              </p>
              <Button onClick={() => navigate('/cms/add-guideline')}>
                <Plus className="w-4 h-4 mr-2" />
                Ongeza Miongozo ya Kwanza
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Una uhakika?</AlertDialogTitle>
            <AlertDialogDescription>
              Kitendo hiki hakiwezi kurekebishwa. Hii itafuta miongozo "{guidelineToDelete?.title}" 
              na taarifa zake zote kwa kudumu.
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

export default GuidelinesManagement;
