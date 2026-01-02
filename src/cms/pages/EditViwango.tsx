import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, FileText, Save, FolderTree, FileEdit, FileText as FileTextIcon, ToggleLeft, ToggleRight, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { enhancedGuidelinesService, GuidelineStandard, GuidelinesGroup } from '@/services/enhancedGuidelinesService';
import Swal from 'sweetalert2';
import { STORAGE_BASE_URL } from '@/config';

const EditViwango: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [existingFile, setExistingFile] = useState<{ name: string; path: string } | null>(null);
  const [viwango, setViwango] = useState<GuidelineStandard | null>(null);
  const [groups, setGroups] = useState<GuidelinesGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    loadGroups();
    if (id) {
      loadViwango();
    }
  }, [id]);

  const loadGroups = async () => {
    try {
      const allGroups = await enhancedGuidelinesService.getAllGuidelinesGroups();
      setGroups(allGroups);
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const loadViwango = async () => {
    try {
      setIsLoading(true);
      
      if (!id) {
        Swal.fire({
          icon: 'error',
          title: 'Makosa',
          text: 'ID ya viwango haijulikani.',
          confirmButtonColor: '#3085d6'
        });
        navigate('/cms/manage-viwango');
        return;
      }

      // Try to get standard by ID
      let foundStandard: GuidelineStandard | null = null;
      
      try {
        foundStandard = await enhancedGuidelinesService.getStandardById(parseInt(id));
      } catch (error: any) {
        console.log('Direct API call failed, trying fallback method');
        // Fallback: get all standards and find by ID
        const allStandards = await enhancedGuidelinesService.getAllGuidelinesStandards();
        foundStandard = allStandards.find(s => s.id === parseInt(id)) || null;
      }

      if (!foundStandard) {
        Swal.fire({
          icon: 'error',
          title: 'Makosa',
          text: 'Viwango haijulikani.',
          confirmButtonColor: '#3085d6'
        });
        navigate('/cms/manage-viwango');
        return;
      }

      setViwango(foundStandard);
      setDocumentName(foundStandard.title || '');
      setDescription(foundStandard.description || '');
      setIsActive(foundStandard.status === 'active');
      setSelectedGroupId(foundStandard.group_id);
      
      // Set existing file info if available
      if (foundStandard.file_name && foundStandard.file_path) {
        setExistingFile({
          name: foundStandard.file_name,
          path: foundStandard.file_path
        });
      }
    } catch (error: any) {
      console.error('Failed to load viwango:', error);
      
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
        text: 'Imeshindwa kupakia viwango. Tafadhali jaribu tena.',
        confirmButtonColor: '#ef4444'
      }).then(() => {
        navigate('/cms/manage-viwango');
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Clear existing file when new file is selected
      setExistingFile(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    // Restore existing file if available
    if (viwango?.file_name && viwango?.file_path) {
      setExistingFile({
        name: viwango.file_name,
        path: viwango.file_path
      });
    }
  };

  const getFileIcon = () => {
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        return <FileText className="w-8 h-8 text-blue-600" />;
      } else if (selectedFile.type.includes('pdf')) {
        return <FileText className="w-8 h-8 text-red-600" />;
      } else if (selectedFile.type.includes('word') || selectedFile.type.includes('document')) {
        return <FileText className="w-8 h-8 text-blue-600" />;
      } else {
        return <FileText className="w-8 h-8 text-gray-600" />;
      }
    }
    return <FileText className="w-8 h-8 text-gray-400" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!documentName.trim()) {
      await Swal.fire({
        icon: 'error',
        title: 'Jina la Hati Linahitajika',
        text: 'Tafadhali ingiza jina la hati.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    // Note: File is optional for edit - can keep existing file
    if (!selectedFile && !existingFile) {
      await Swal.fire({
        icon: 'error',
        title: 'Faili Linahitajika',
        text: 'Tafadhali chagua faili ya kuweka au acha faili iliyopo.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (!viwango) {
      await Swal.fire({
        icon: 'error',
        title: 'Makosa',
        text: 'Taarifa za viwango hazipatikani.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    if (!selectedGroupId) {
      await Swal.fire({
        icon: 'error',
        title: 'Kikundi Kilihitajika',
        text: 'Tafadhali chagua kikundi cha viwango.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Show loading alert
      Swal.fire({
        title: 'Inasasisha...',
        text: 'Tafadhali subiri, hati inasasishwa.',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Fetch full standard data to ensure we have all required fields
      const fullStandard = await enhancedGuidelinesService.getStandardById(viwango.id);

      // Update standard data
      const updateData = {
        ...fullStandard,
        id: fullStandard.id,
        title: documentName.trim(),
        description: description.trim() || '', // Description from form
        status: isActive ? 'active' : 'inactive' as 'active' | 'inactive' | 'draft',
        group_id: selectedGroupId, // Use selected group
        standard_type: fullStandard.standard_type,
        maturity_level: fullStandard.maturity_level,
        version: fullStandard.version,
        date_published: fullStandard.date_published,
        featured: fullStandard.featured,
        order: fullStandard.order,
        file: selectedFile || undefined
      };

      // Call API to update
      const response = await enhancedGuidelinesService.updateStandard(updateData);

      console.log('API Response:', response);

      // Success message
      await Swal.fire({
        icon: 'success',
        title: 'Imefanikiwa!',
        text: 'Hati imesasishwa kwa mafanikio.',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true
      });

      // Navigate back to manage viwango
      navigate('/cms/manage-viwango');
      
    } catch (error: any) {
      console.error('Error updating viwango:', error);
      
      let errorMessage = 'Imeshindwa kusasisha hati. Tafadhali jaribu tena.';
      
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
          
          // Show specific validation errors if available
          if (error.response.data.errors) {
            const validationErrors = Object.values(error.response.data.errors).flat();
            errorMessage += `\n\nMakosa ya uthibitishaji:\n${validationErrors.join('\n')}`;
          }
        } else if (error.response.status === 400) {
          errorMessage = 'Data iliyotumwa si sahihi. Tafadhali angalia sehemu zote.';
        } else if (error.response.status === 401) {
          errorMessage = 'Una hakika ya kufikia. Tafadhali ingia tena.';
        } else if (error.response.status === 403) {
          errorMessage = 'Huna ruhusa ya kufanya kitendo hiki.';
        } else if (error.response.status === 404) {
          errorMessage = 'Viwango haijulikani.';
        } else if (error.response.status === 422) {
          errorMessage = 'Data iliyotumwa si sahihi. Tafadhali angalia sehemu zote.';
          
          if (error.response.data.errors) {
            const validationErrors = Object.values(error.response.data.errors).flat();
            errorMessage += `\n\nMakosa ya uthibitishaji:\n${validationErrors.join('\n')}`;
          }
        } else if (error.response.status === 500) {
          errorMessage = 'Kuna tatizo kwenye server. Tafadhali jaribu tena baadae.';
        }
      } else if (error.request) {
        errorMessage = 'Server haijibu. Tafadhali angalia muunganisho wa mtandao.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Imeshindwa',
        text: errorMessage,
        confirmButtonColor: '#ef4444'
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/cms/manage-viwango')}
                className="flex items-center gap-2 hover:bg-blue-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Rudi
              </Button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <FileEdit className="w-6 h-6 text-white" />
                  </div>
                  Hariri Viwango
                </h1>
                <p className="text-gray-600 mt-1">Inapakia...</p>
              </div>
            </div>
          </div>
          <Card className="border-2 border-gray-100 shadow-lg">
            <CardContent className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileEdit className="w-6 h-6 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-gray-600 font-medium">Inapakia taarifa za viwango...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/cms/manage-viwango')}
                className="flex items-center gap-2 hover:bg-blue-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Rudi
              </Button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                    <FileEdit className="w-6 h-6 text-white" />
                  </div>
                  Hariri Viwango
                </h1>
                <p className="text-gray-600 mt-1">Hariri viwango iliyopo kwenye mfumo</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Hariri</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Selection */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FolderTree className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Chagua Kikundi</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <Label htmlFor="group" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                Kikundi cha Viwango <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedGroupId?.toString() || ''}
                onValueChange={(value) => setSelectedGroupId(parseInt(value))}
                required
              >
                <SelectTrigger id="group" className="h-12 text-base border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Chagua kikundi cha viwango" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id.toString()} className="text-base py-3">
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Chagua kikundi ambacho hati hii itakuwa sehemu yake. Hii itasaidia kuorodhesha hati kwa makundi yake.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Name */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-50/50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <FileTextIcon className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Jina la Hati</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <Label htmlFor="documentName" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                Jina la Hati <span className="text-red-500">*</span>
              </Label>
              <Input
                id="documentName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Mfano: Usanifishaji wa Dira ya Serikali Mtandao"
                className="h-12 text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                required
              />
              <p className="text-sm text-gray-500">
                Ingiza jina kamili la hati au viwango unayotaka kuongeza
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-50/50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Maelezo Ya Nyaraka</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold text-gray-900">
                Maelezo Ya Nyaraka
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ingiza maelezo mafupi ya nyaraka hii. Maelezo haya yataonekana kwenye ukurasa wa viwango na miongozo..."
                className="min-h-[140px] text-base border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all resize-y"
                rows={6}
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>Maelezo haya yataonekana kwenye ukurasa wa viwango na miongozo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-50/50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Pakia Faili</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {selectedFile ? (
              <div className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    {getFileIcon()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-gray-900 text-base">{selectedFile.name}</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium">
                        Faili Mpya
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium">
                        {selectedFile.type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Aina: <span className="font-medium">{selectedFile.type || 'Haijulikani'}</span>
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : existingFile ? (
              <div className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-gray-900 text-base">{existingFile.name}</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium">
                        Faili Iliyopo
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Faili hii itabaki ikiwa hujachagua faili mpya
                    </p>
                  </div>
                  <a
                    href={`${STORAGE_BASE_URL}${existingFile.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Tazama
                  </a>
                </div>
              </div>
            ) : null}
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                onClick={() => document.getElementById('file')?.click()}>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                    <Upload className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <Label htmlFor="file" className="text-lg font-semibold text-gray-900 cursor-pointer block mb-2">
                      {existingFile ? 'Badilisha faili' : 'Chagua faili au ulete hapa'}
                    </Label>
                    <p className="text-sm text-gray-600">
                      Aina zinazokubalika: <span className="font-medium">PDF, DOC, DOCX, TXT, JPG, PNG</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Ukubwa wa juu: 10MB</p>
                    {existingFile && (
                      <p className="text-xs text-blue-600 mt-2 font-medium">
                        Chagua faili mpya kubadilisha faili iliyopo
                      </p>
                    )}
                  </div>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('file')?.click();
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {existingFile ? 'Chagua Faili Mpya' : 'Chagua Faili'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active/Inactive Status */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-50/50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                {isActive ? (
                  <ToggleRight className="w-5 h-5 text-white" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-white" />
                )}
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Hali ya Hati</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="space-y-1">
                <Label htmlFor="status" className="text-base font-semibold text-gray-900">
                  Hali ya Hati
                </Label>
                <p className={`text-sm font-medium ${isActive ? 'text-green-700' : 'text-gray-600'}`}>
                  {isActive ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Hati itaonekana kwa watumiaji
                    </span>
                  ) : (
                    'Hati haitaonekana kwa watumiaji'
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm font-semibold transition-colors ${!isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                  Haijaamilishwa
                </span>
                <Switch
                  id="status"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  className="data-[state=checked]:bg-green-600"
                />
                <span className={`text-sm font-semibold transition-colors ${isActive ? 'text-green-700' : 'text-gray-400'}`}>
                  Aktifu
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/cms/manage-viwango')}
              disabled={isSubmitting}
              className="min-w-[140px] h-12 border-2 hover:bg-gray-50"
            >
              Ghairi
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="min-w-[200px] h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Inasasisha...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Hifadhi Mabadiliko
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default EditViwango;

