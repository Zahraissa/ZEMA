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
  BookOpen
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
import { enhancedGuidelinesService, SampleTemplate } from '@/services/enhancedGuidelinesService';
import { toast } from 'sonner';

const SamplesTemplatesManagement: React.FC = () => {
  const [samplesTemplates, setSamplesTemplates] = useState<SampleTemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<SampleTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<SampleTemplate | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSamplesTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchQuery, selectedStatus, selectedCategory, selectedComplexity, samplesTemplates]);

  const loadSamplesTemplates = async () => {
    try {
      setIsLoading(true);
      const allTemplates = await enhancedGuidelinesService.getAllSamplesTemplates();
      setSamplesTemplates(allTemplates);
      setFilteredTemplates(allTemplates);
      
      // Show info toast about demo data
      if (allTemplates.length > 0) {
        toast.info('Showing demo data - Backend endpoints will be implemented soon', {
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Failed to load samples templates:', error);
      toast.error('Failed to load samples templates');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = samplesTemplates;

    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (template.author && template.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (template.templateCategory && template.templateCategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (template.useCase && template.useCase.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(template => template.status === selectedStatus);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.templateCategory === selectedCategory);
    }

    if (selectedComplexity !== 'all') {
      filtered = filtered.filter(template => template.complexity === selectedComplexity);
    }

    setFilteredTemplates(filtered);
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;

    try {
      await enhancedGuidelinesService.deleteSampleTemplate(templateToDelete.id);
      toast.success('Sample template deleted successfully');
      loadSamplesTemplates();
    } catch (error) {
      console.error('Failed to delete sample template:', error);
      toast.error('Failed to delete sample template');
    } finally {
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
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

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'basic':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplexityText = (complexity: string) => {
    switch (complexity) {
      case 'basic':
        return 'Rahisi';
      case 'intermediate':
        return 'Wastani';
      case 'advanced':
        return 'Ngumu';
      default:
        return complexity;
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'basic':
        return <Target className="w-4 h-4" />;
      case 'intermediate':
        return <Layers className="w-4 h-4" />;
      case 'advanced':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const categories = ['all', ...Array.from(new Set(samplesTemplates.map(t => t.templateCategory)))];
  const statuses = ['all', 'active', 'draft', 'archived'];
  const complexities = ['all', 'basic', 'intermediate', 'advanced'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-normal text-gray-900">Usimamizi wa Sampuli na Vigezo</h1>
          <p className="text-gray-600">Dhibiti sampuli na vigezo vya e-Government Authority</p>
        </div>
        <Button onClick={() => navigate('/cms/add-sample-template')}>
          <Plus className="w-4 h-4 mr-2" />
          Ongeza Sampuli na Vigezo
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tafuta sampuli na vigezo..."
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
            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger>
                <SelectValue placeholder="Ugumu" />
              </SelectTrigger>
              <SelectContent>
                {complexities.map(complexity => (
                  <SelectItem key={complexity} value={complexity}>
                    {complexity === 'all' ? 'Ugumu wote' : getComplexityText(complexity)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadSamplesTemplates} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Osha upya
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Samples and Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Sampuli na Vigezo ({filteredTemplates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2">Inapakia...</span>
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jina</TableHead>
                    <TableHead>Kategoria</TableHead>
                    <TableHead>Ugumu</TableHead>
                    <TableHead>Hali</TableHead>
                    <TableHead>Mwandishi</TableHead>
                    <TableHead>Muda na Sharti</TableHead>
                    <TableHead>Vitendo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <div>
                          <div className="font-normal text-gray-900">{template.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {template.description}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            <span className="font-normal">Matumizi:</span> {template.useCase || 'Hakuna maelezo'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.templateCategory || template.category || 'Hakuna kategoria'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getComplexityColor(template.complexity)}>
                          <div className="flex items-center gap-1">
                            {getComplexityIcon(template.complexity)}
                            {getComplexityText(template.complexity)}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(template.status)}>
                          {getStatusText(template.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-normal">{template.author}</div>
                          <div className="text-gray-500">{template.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1 text-gray-900">
                            <Clock className="w-3 h-3" />
                            {template.estimatedTime || 'Hakuna muda ulioonyeshwa'}
                          </div>
                          <div className="text-gray-500">v{template.version}</div>
                          <div className="text-xs text-gray-400">
                            Sharti: {template.prerequisites && template.prerequisites.length > 0 
                              ? template.prerequisites.slice(0, 2).join(', ') + (template.prerequisites.length > 2 ? '...' : '')
                              : 'Hakuna sharti maalum'
                            }
                          </div>
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
                            <DropdownMenuItem onClick={() => navigate(`/cms/edit-sample-template/${template.id}`)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Hariri
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(template.fileUrl, '_blank')}>
                              <Eye className="w-4 h-4 mr-2" />
                              Tazama
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(template.fileUrl, '_blank')}>
                              <Download className="w-4 h-4 mr-2" />
                              Pakua
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => {
                                setTemplateToDelete(template);
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
              <FileCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-normal text-gray-900 mb-2">
                Hakuna sampuli na vigezo zinazopatikana
              </h3>
              <p className="text-gray-600 mb-4">
                Hakuna sampuli na vigezo zinazofanana na vichujio ulivyochagua.
              </p>
              <Button onClick={() => navigate('/cms/add-sample-template')}>
                <Plus className="w-4 h-4 mr-2" />
                Ongeza Sampuli na Vigezo ya Kwanza
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
              Kitendo hiki hakiwezi kurekebishwa. Hii itafuta sampuli na vigezo "{templateToDelete?.title}" 
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

export default SamplesTemplatesManagement;
