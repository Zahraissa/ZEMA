import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Upload, FileText, Calendar, User, Tag, Building, FileEdit, Sparkles, CheckCircle2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { enhancedGuidelinesService, PolicyGuideline } from '@/services/enhancedGuidelinesService';
import { API_BASE_URL } from '@/config';

const EditPolicyGuideline: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [guideline, setGuideline] = useState<PolicyGuideline | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    document_type: '',
    version: '1.0',
    author: '',
    department: '',
    date_published: '',
    status: 'draft',
    tags: '',
    is_main_document: false,
    featured: false,
    order: 1,
    file: null as File | null,
  });

  useEffect(() => {
    if (id) {
      loadGuideline();
    }
  }, [id]);

  const loadGuideline = async () => {
    try {
      setLoading(true);
      
      console.log('Loading policy guideline with ID:', id);
      
      // Check if we have an auth token
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please log in to access policy guidelines');
        navigate('/cms/login');
        return;
      }
      
      // Try direct API call first, then fallback to getting all guidelines
      let foundGuideline = null;
      
      try {
        // Try direct API call
        foundGuideline = await enhancedGuidelinesService.getPolicyGuidelineById(parseInt(id!));
        console.log('Direct API call successful:', foundGuideline);
      } catch (directError: any) {
        console.log('Direct API call failed, trying fallback method:', directError.message);
        
        // Fallback: get all guidelines and find by ID
        const allGuidelines = await enhancedGuidelinesService.getAllPolicyGuidelines();
        console.log('All guidelines loaded:', allGuidelines);
        
        foundGuideline = allGuidelines.find(g => g.id === parseInt(id!));
        console.log('Found guideline via fallback:', foundGuideline);
      }
      
      if (!foundGuideline) {
        toast.error('Policy guideline not found');
        navigate('/cms/policy-guidelines');
        return;
      }
      
      setGuideline(foundGuideline);
      setFormData({
        title: foundGuideline.title || '',
        description: foundGuideline.description || '',
        category: foundGuideline.category || '',
        document_type: foundGuideline.document_type || '',
        version: foundGuideline.version || '1.0',
        author: foundGuideline.author || '',
        department: foundGuideline.department || '',
        date_published: foundGuideline.date_published || '',
        status: foundGuideline.status || 'draft',
        tags: foundGuideline.tags && Array.isArray(foundGuideline.tags) ? foundGuideline.tags.join(', ') : '',
        is_main_document: foundGuideline.isMainDocument || false,
        featured: foundGuideline.featured || false,
        order: foundGuideline.order || 1,
        file: null,
      });
    } catch (error: any) {
      console.error('Error loading policy guideline:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      if (error.response?.status === 401) {
        toast.error('Unauthorized: Please log in to access policy guidelines');
        navigate('/cms/login');
      } else if (error.response?.status === 404) {
        toast.error('Policy guideline not found');
        navigate('/cms/policy-guidelines');
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        toast.error('Cannot connect to server. Please check if the backend is running.');
      } else {
        toast.error('Failed to load policy guideline. Please try again.');
        navigate('/cms/policy-guidelines');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('document_type', formData.document_type);
      formDataToSend.append('version', formData.version);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('date_published', formData.date_published);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('is_main_document', formData.is_main_document ? '1' : '0');
      formDataToSend.append('featured', formData.featured ? '1' : '0');
      formDataToSend.append('order', formData.order.toString());
      
      // Add tags as array
      const tagsArray = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      tagsArray.forEach((tag, index) => {
        formDataToSend.append(`tags[${index}]`, tag);
      });
      
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      console.log('Updating policy guideline with ID:', id);
      console.log('Form data being sent:', Object.fromEntries(formDataToSend.entries()));

      console.log('Updating policy guideline...');
      console.log('File being sent:', formData.file ? { name: formData.file.name, size: formData.file.size, type: formData.file.type } : 'No file (keeping existing)');
      
      const result = await enhancedGuidelinesService.updatePolicyGuideline({
        id: parseInt(id!),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        document_type: formData.document_type,
        version: formData.version,
        author: formData.author,
        department: formData.department,
        date_published: formData.date_published,
        status: formData.status,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        is_main_document: formData.is_main_document,
        featured: formData.featured,
        order: formData.order,
        file: formData.file || undefined
      });
      
      console.log('Update success response:', result);
      
      // Check if file was uploaded (if a new file was provided)
      if (formData.file && !result.file_path && !result.fileUrl) {
        toast.warning('Miongozo ya sera imesasishwa lakini faili mpya haijapakiwa. Tafadhali jaribu kuongeza faili tena.');
      } else if (formData.file && (result.file_path || result.fileUrl)) {
        toast.success('Miongozo ya sera imesasishwa kwa mafanikio pamoja na faili mpya');
      } else {
        toast.success('Miongozo ya sera imesasishwa kwa mafanikio');
      }
      
      navigate('/cms/policy-guidelines');
    } catch (error: any) {
      console.error('Error updating policy guideline:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        config: error.config
      });
      
      let errorMessage = 'Failed to update policy guideline';
      
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessage = `Validation errors: ${errorMessages.join(', ')}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Policy guideline not found';
      } else if (error.response?.status === 422) {
        errorMessage = 'Validation failed. Please check all fields.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/cms/policy-guidelines')}
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
                  Hariri Miongozo ya Sera
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
                <p className="text-gray-600 font-medium">Inapakia taarifa za miongozo ya sera...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/cms/policy-guidelines')}
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
                  Hariri Miongozo ya Sera
                </h1>
                <p className="text-gray-600 mt-1">Hariri miongozo ya sera iliyopo kwenye mfumo</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Hariri</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-50/50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span>Taarifa za Msingi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      Jina la Miongozo ya Sera <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Mfano: Sera ya Usalama wa Taarifa za Serikali"
                      className="h-12 text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      Maelezo <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Ingiza maelezo kamili ya miongozo ya sera..."
                      rows={5}
                      className="text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-y min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        Kategoria <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500">
                          <SelectValue placeholder="Chagua kategoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Digital Government">Digital Government</SelectItem>
                          <SelectItem value="Data Management">Data Management</SelectItem>
                          <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                          <SelectItem value="Service Delivery">Service Delivery</SelectItem>
                          <SelectItem value="Technology Standards">Technology Standards</SelectItem>
                          <SelectItem value="Compliance">Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="document_type" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        Aina ya Nyaraka <span className="text-red-500">*</span>
                      </Label>
                      <Select value={formData.document_type} onValueChange={(value) => setFormData({ ...formData, document_type: value })}>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500">
                          <SelectValue placeholder="Chagua aina ya nyaraka" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Policy">Policy</SelectItem>
                          <SelectItem value="Guideline">Guideline</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Procedure">Procedure</SelectItem>
                          <SelectItem value="Framework">Framework</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="version" className="text-base font-semibold text-gray-900">Toleo</Label>
                      <Input
                        id="version"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        placeholder="Mfano: 1.0"
                        className="h-12 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-base font-semibold text-gray-900">Hali</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-purple-500">
                          <SelectValue placeholder="Chagua hali" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
              </CardContent>
            </Card>

              {/* Author Information */}
              <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-50/50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span>Taarifa za Mwandishi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        Mwandishi <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Ingiza jina la mwandishi"
                        className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        Idara <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        placeholder="Ingiza jina la idara"
                        className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_published" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      Tarehe ya Kuchapishwa <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date_published"
                      type="date"
                      value={formData.date_published}
                      onChange={(e) => setFormData({ ...formData, date_published: e.target.value })}
                      className="h-12 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-50/50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                      <Tag className="w-5 h-5 text-white" />
                    </div>
                    <span>Vitambulisho (Tags)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-base font-semibold text-gray-900">Vitambulisho (zitenganishe kwa koma)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Mfano: digital transformation, e-government, compliance"
                      className="h-12 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                      <span>Zitenganishe vitambulisho vingi kwa koma</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* File Upload */}
              <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-50/50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 bg-orange-600 rounded-lg">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <span>Faili ya Nyaraka</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity blur-xl"></div>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                      onClick={() => document.getElementById('file')?.click()}>
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                          <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <Label htmlFor="file" className="text-base font-semibold text-gray-900 cursor-pointer block mb-1">
                            Pakia Faili Mpya (Si Lazima)
                          </Label>
                          <p className="text-xs text-gray-600">
                            Aina: PDF, DOC, DOCX, TXT
                          </p>
                        </div>
                        <Input
                          id="file"
                          type="file"
                          onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                          accept=".pdf,.doc,.docx,.txt"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('file')?.click();
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Chagua Faili
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {guideline?.fileUrl && (
                    <div className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 shadow-md">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Faili Iliyopo:</p>
                      <p className="text-sm text-gray-700 mb-3">{guideline.file_name}</p>
                      <a 
                        href={guideline.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium w-fit"
                      >
                        <Eye className="w-4 h-4" />
                        Tazama Faili
                      </a>
                      <p className="text-xs text-gray-500 mt-2">Acha tupu ili kubaki na faili hii</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Settings */}
              <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-50/50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <span>Mipangilio</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_main_document" className="text-base font-semibold text-gray-900">
                        Nyaraka Kuu
                      </Label>
                      <p className="text-sm text-gray-600">
                        {formData.is_main_document ? 'Nyaraka hii ni nyaraka kuu' : 'Sio nyaraka kuu'}
                      </p>
                    </div>
                    <Switch
                      id="is_main_document"
                      checked={formData.is_main_document}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_main_document: checked })}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="space-y-0.5">
                      <Label htmlFor="featured" className="text-base font-semibold text-gray-900">
                        Imekuwa Maarufu
                      </Label>
                      <p className="text-sm text-gray-600">
                        {formData.featured ? 'Itaonyeshwa kama maarufu' : 'Haijaonyeshwa kama maarufu'}
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      className="data-[state=checked]:bg-green-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-base font-semibold text-gray-900">Utaratibu wa Kuonyesha</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                      min="1"
                      className="h-12 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                    <p className="text-xs text-gray-500">Nambari ndogo zaidi zitaonyeshwa kwanza</p>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border-2 border-gray-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                      disabled={saving}
                    >
                      {saving ? (
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
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 border-2 hover:bg-gray-50"
                      onClick={() => navigate('/cms/policy-guidelines')}
                    >
                      Ghairi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPolicyGuideline;
