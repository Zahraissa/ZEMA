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
  Building,
  FolderOpen,
  Layers,
  Target,
  Settings,
  ChevronDown,
  ChevronRight
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useNavigate } from 'react-router-dom';
import { enhancedGuidelinesService, GuidelineStandard, GuidelinesGroup } from '@/services/enhancedGuidelinesService';
import { toast } from 'sonner';

const GuidelinesStandardsManagement: React.FC = () => {
  const [guidelinesGroups, setGuidelinesGroups] = useState<GuidelinesGroup[]>([]);
  const [guidelinesStandards, setGuidelinesStandards] = useState<GuidelineStandard[]>([]);
  const [filteredStandards, setFilteredStandards] = useState<GuidelineStandard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedStandardType, setSelectedStandardType] = useState('all');
  const [selectedMaturityLevel, setSelectedMaturityLevel] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [standardToDelete, setStandardToDelete] = useState<GuidelineStandard | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterStandards();
  }, [searchQuery, selectedStatus, selectedGroup, selectedStandardType, selectedMaturityLevel, guidelinesStandards]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [groups, standards] = await Promise.all([
        enhancedGuidelinesService.getAllGuidelinesGroups(),
        enhancedGuidelinesService.getAllGuidelinesStandards()
      ]);
      
      setGuidelinesGroups(groups);
      setGuidelinesStandards(standards);
      setFilteredStandards(standards);
      
      // Expand first group by default
      if (groups.length > 0) {
        setExpandedGroups(new Set([groups[0].id]));
      }
      
      // Show info toast about demo data
      if (groups.length > 0 && standards.length > 0) {
        toast.info('Showing demo data - Backend endpoints will be implemented soon', {
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load guidelines and standards');
    } finally {
      setIsLoading(false);
    }
  };

  const filterStandards = () => {
    let filtered = guidelinesStandards;

    if (searchQuery) {
      filtered = filtered.filter(standard =>
        standard.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        standard.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        standard.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(standard => standard.status === selectedStatus);
    }

    if (selectedGroup !== 'all') {
      filtered = filtered.filter(standard => standard.groupId === parseInt(selectedGroup));
    }

    if (selectedStandardType !== 'all') {
      filtered = filtered.filter(standard => standard.standardType === selectedStandardType);
    }

    if (selectedMaturityLevel !== 'all') {
      filtered = filtered.filter(standard => standard.maturityLevel === selectedMaturityLevel);
    }

    setFilteredStandards(filtered);
  };

  const handleDelete = async () => {
    if (!standardToDelete) return;

    try {
      await enhancedGuidelinesService.deleteGuidelineStandard(standardToDelete.id);
      toast.success('Guideline standard deleted successfully');
      loadData();
    } catch (error) {
      console.error('Failed to delete guideline standard:', error);
      toast.error('Failed to delete guideline standard');
    } finally {
      setDeleteDialogOpen(false);
      setStandardToDelete(null);
    }
  };

  const toggleGroupExpansion = (groupId: number) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
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

  const getMaturityLevelColor = (level: string) => {
    switch (level) {
      case 'proposed':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'review':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'deprecated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaturityLevelText = (level: string) => {
    switch (level) {
      case 'proposed':
        return 'Iliyopendekezwa';
      case 'draft':
        return 'Rasimu';
      case 'review':
        return 'Inakaguliwa';
      case 'approved':
        return 'Imekubaliwa';
      case 'deprecated':
        return 'Iliyopitwa';
      default:
        return level;
    }
  };

  const getStandardTypeColor = (type: string) => {
    switch (type) {
      case 'architecture':
        return 'bg-blue-100 text-blue-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'business':
        return 'bg-green-100 text-green-800';
      case 'interoperability':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStandardTypeText = (type: string) => {
    switch (type) {
      case 'architecture':
        return 'Usanifu';
      case 'process':
        return 'Mchakato';
      case 'vision':
        return 'Mtazamo';
      case 'business':
        return 'Biashara';
      case 'interoperability':
        return 'Uhusiano';
      case 'information':
        return 'Taarifa';
      case 'infrastructure':
        return 'Miundombinu';
      case 'integration':
        return 'Muunganisho';
      case 'security':
        return 'Usalama';
      default:
        return type;
    }
  };

  const getStandardsByGroup = (groupId: number) => {
    return guidelinesStandards.filter(standard => standard.groupId === groupId);
  };

  const statuses = ['all', 'active', 'draft', 'archived'];
  const groups = ['all', ...guidelinesGroups.map(g => g.id.toString())];
  const standardTypes = ['all', 'architecture', 'process', 'vision', 'business', 'interoperability', 'information', 'infrastructure', 'integration', 'security'];
  const maturityLevels = ['all', 'proposed', 'draft', 'review', 'approved', 'deprecated'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-normal text-gray-900">Usimamizi wa Miongozo na Viwango</h1>
          <p className="text-gray-600">Dhibiti miongozo na viwango vya e-Government Authority</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/cms/add-guidelines-group')}>
            <Plus className="w-4 h-4 mr-2" />
            Ongeza Kikundi
          </Button>
          <Button onClick={() => navigate('/cms/add-guideline-standard')}>
            <Plus className="w-4 h-4 mr-2" />
            Ongeza Miongozo na Viwango
          </Button>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tafuta miongozo na viwango..."
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
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Kikundi" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(group => (
                  <SelectItem key={group} value={group}>
                    {group === 'all' ? 'Vikundi vyote' : guidelinesGroups.find(g => g.id.toString() === group)?.name || group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStandardType} onValueChange={setSelectedStandardType}>
              <SelectTrigger>
                <SelectValue placeholder="Aina ya Kigezo" />
              </SelectTrigger>
              <SelectContent>
                {standardTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === 'all' ? 'Aina zote' : getStandardTypeText(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMaturityLevel} onValueChange={setSelectedMaturityLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Kiwango cha Ukomavu" />
              </SelectTrigger>
              <SelectContent>
                {maturityLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level === 'all' ? 'Kiwango chote' : getMaturityLevelText(level)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadData} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Osha upya
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guidelines Groups and Standards */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="p-8">
              <div className="flex items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2">Inapakia...</span>
              </div>
            </CardContent>
          </Card>
        ) : guidelinesGroups.length > 0 ? (
          guidelinesGroups.map((group) => {
            const groupStandards = getStandardsByGroup(group.id);
            const isExpanded = expandedGroups.has(group.id);
            
            return (
              <Card key={group.id}>
                <Collapsible open={isExpanded} onOpenChange={() => toggleGroupExpansion(group.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )}
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            <p className="text-sm text-gray-600">{group.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">
                            {groupStandards.length} nyaraka
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/cms/edit-guidelines-group/${group.id}`);
                            }}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      {groupStandards.length > 0 ? (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Jina</TableHead>
                                <TableHead>Aina ya Kigezo</TableHead>
                                <TableHead>Kiwango cha Ukomavu</TableHead>
                                <TableHead>Hali</TableHead>
                                <TableHead>Mwandishi</TableHead>
                                <TableHead>Upeo wa Matumizi</TableHead>
                                <TableHead>Vitendo</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {groupStandards.map((standard) => (
                                <TableRow key={standard.id}>
                                  <TableCell>
                                    <div>
                                      <div className="font-normal text-gray-900">{standard.title}</div>
                                      <div className="text-sm text-gray-500 line-clamp-2">
                                        {standard.description}
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getStandardTypeColor(standard.standardType)}>
                                      {getStandardTypeText(standard.standardType)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getMaturityLevelColor(standard.maturityLevel)}>
                                      {getMaturityLevelText(standard.maturityLevel)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={getStatusColor(standard.status)}>
                                      {getStatusText(standard.status)}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      <div className="font-normal">{standard.author}</div>
                                      <div className="text-gray-500">{standard.department}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      <div className="text-gray-900">v{standard.version}</div>
                                      <div className="text-gray-500">
                                        {standard.applicableScope.slice(0, 2).join(', ')}
                                        {standard.applicableScope.length > 2 && '...'}
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
                                        <DropdownMenuItem onClick={() => navigate(`/cms/edit-guideline-standard/${standard.id}`)}>
                                          <Edit className="w-4 h-4 mr-2" />
                                          Hariri
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => window.open(standard.fileUrl, '_blank')}>
                                          <Eye className="w-4 h-4 mr-2" />
                                          Tazama
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
                      ) : (
                        <div className="text-center py-6 text-gray-500">
                          Hakuna miongozo na viwango katika kikundi hiki.
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-normal text-gray-900 mb-2">
                  Hakuna vikundi vya miongozo zinazopatikana
                </h3>
                <p className="text-gray-600 mb-4">
                  Ongeza kikundi cha kwanza cha miongozo na viwango.
                </p>
                <Button onClick={() => navigate('/cms/add-guidelines-group')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ongeza Kikundi cha Kwanza
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Una uhakika?</AlertDialogTitle>
            <AlertDialogDescription>
              Kitendo hiki hakiwezi kurekebishwa. Hii itafuta miongozo na viwango "{standardToDelete?.title}" 
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

export default GuidelinesStandardsManagement;
