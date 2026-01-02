import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, FileText, FileEdit, FileText as FileTextIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { enhancedGuidelinesService, CreatePolicyGuidelineData } from '@/services/enhancedGuidelinesService';
import { API_BASE_URL } from '@/config';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const AddPolicyGuideline: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreatePolicyGuidelineData>({
    title: '',
    description: '',
    category: 'Usalama wa Mtandao',
    document_type: 'Policy Guideline',
    version: '1.0',
    status: 'draft',
    tags: [],
    author: 'System User',
    department: 'IT Department',
    date_published: new Date().toISOString().split('T')[0],
    is_main_document: false,
    featured: false,
    order: 1,
  });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');

  const handleInputChange = (field: keyof CreatePolicyGuidelineData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview('');
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview('');
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Jina la miongozo ya sera ni lazima');
      return false;
    }
    
    if (!formData.description.trim()) {
      toast.error('Maelezo ya miongozo ya sera ni lazima');
      return false;
    }
    
    if (!file) {
      toast.error('Faili ya miongozo ya sera ni lazima');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('document_type', formData.document_type);
      formDataToSend.append('version', formData.version);
      formDataToSend.append('date_published', formData.date_published);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('department', formData.department);
      // Handle tags array properly
      if (formData.tags && formData.tags.length > 0) {
        formData.tags.forEach((tag, index) => {
          formDataToSend.append(`tags[${index}]`, tag);
        });
      }
      formDataToSend.append('is_main_document', '0'); // Default to false (0 for boolean)
      formDataToSend.append('featured', '0'); // Default to false (0 for boolean)
      formDataToSend.append('order', '1'); // Default order
      
      if (file) {
        formDataToSend.append('file', file);
      }

      // Log the data being sent for debugging
      console.log('Submitting form data:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        document_type: formData.document_type,
        version: formData.version,
        date_published: formData.date_published,
        status: formData.status,
        author: formData.author,
        department: formData.department,
        tags: formData.tags,
        is_main_document: 0,
        featured: 0,
        order: 1,
        file: file ? file.name : 'No file'
      });

      // Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value);
      }
      
      // Log the final URL being called
      console.log('Making request to:', `${API_BASE_URL}guidelines`);

      // Create the policy guideline
      console.log('Creating policy guideline...');
      console.log('File being sent:', file ? { name: file.name, size: file.size, type: file.type } : 'No file');
      
      const result = await enhancedGuidelinesService.createPolicyGuideline({
        ...formData,
        file: file || undefined
      });

      console.log('Success response:', result);
      console.log('File check:', {
        file_provided: !!file,
        file_path: result.file_path,
        fileUrl: result.fileUrl,
        file_name: result.file_name
      });
      
      // Check if file was uploaded
      if (file) {
        if (!result.file_path && !result.fileUrl) {
          console.error('File upload failed - no file_path or fileUrl in response');
          toast.error('Miongozo ya sera imeongezwa lakini faili haijapakiwa. Tafadhali jaribu kuongeza faili tena.');
        } else {
          console.log('File uploaded successfully:', {
            file_path: result.file_path,
            fileUrl: result.fileUrl
          });
          toast.success('Miongozo ya sera imeongezwa kwa mafanikio pamoja na faili');
        }
      } else {
        toast.success('Miongozo ya sera imeongezwa kwa mafanikio');
      }
      
      navigate('/cms/policy-guidelines');
      
    } catch (error: any) {
      console.error('Failed to create policy guideline:', error);
      
      // Detailed error handling
      let errorMessage = 'Imeshindwa kuongeza miongozo ya sera. Tafadhali jaribu tena.';
      
      if (error.response) {
        // Server responded with error status
        console.error('Error response:', error.response);
        console.error('Error status:', error.response.status);
        console.error('Error data:', error.response.data);
        
        if (error.response.data && error.response.data.message) {
          errorMessage = `Error: ${error.response.data.message}`;
          
          // Show specific validation errors if available
          if (error.response.data.errors) {
            const validationErrors = Object.values(error.response.data.errors).flat();
            errorMessage += `\n\nValidation errors:\n${validationErrors.join('\n')}`;
            console.error('Validation errors:', error.response.data.errors);
          }
        } else if (error.response.status === 400) {
          errorMessage = 'Data iliyotumwa si sahihi. Tafadhali angalia sehemu zote.';
        } else if (error.response.status === 401) {
          errorMessage = 'Una hakika ya kufikia. Tafadhali ingia tena.';
        } else if (error.response.status === 403) {
          errorMessage = 'Huna ruhusa ya kufanya kitendo hiki.';
        } else if (error.response.status === 404) {
          errorMessage = 'API endpoint haijulikani. Tafadhali angalia muunganisho wa server.';
        } else if (error.response.status === 422) {
          errorMessage = 'Data iliyotumwa si sahihi. Tafadhali angalia sehemu zote.';
          
          // Show specific validation errors for 422 status
          if (error.response.data.errors) {
            const validationErrors = Object.values(error.response.data.errors).flat();
            errorMessage += `\n\nValidation errors:\n${validationErrors.join('\n')}`;
            console.error('Validation errors:', error.response.data.errors);
          }
        } else if (error.response.status === 500) {
          errorMessage = 'Kuna tatizo kwenye server. Tafadhali jaribu tena baadae.';
        } else if (error.response.status === 0) {
          errorMessage = 'Server haijibu. Tafadhali angalia muunganisho wa mtandao.';
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        errorMessage = 'Server haijibu. Tafadhali angalia muunganisho wa mtandao.';
      } else {
        // Something else happened
        console.error('Other error:', error.message);
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = () => {
    if (!file) return <FileText className="w-8 h-8 text-gray-400" />;
    
    if (file.type.startsWith('image/')) {
      return <FileText className="w-8 h-8 text-blue-600" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-600" />;
    } else if (file.type.includes('word') || file.type.includes('document')) {
      return <FileText className="w-8 h-8 text-blue-600" />;
    } else {
      return <FileText className="w-8 h-8 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
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
                  Ongeza Miongozo ya Sera
                </h1>
                <p className="text-gray-600 mt-1">Ongeza miongozo mpya ya sera kwenye mfumo</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Fomu Mpya</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Information */}
        <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-50/50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-lg">
                <FileTextIcon className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Taarifa za Miongozo ya Sera</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Policy Guideline Name */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                Jina la Miongozo ya Sera <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Mfano: Sera ya Usalama wa Taarifa za Serikali"
                className="h-12 text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                required
              />
              <p className="text-sm text-gray-500">
                Ingiza jina kamili la miongozo ya sera unayotaka kuongeza
              </p>
            </div>

            {/* Short Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                Maelezo Mafupi <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Ingiza maelezo mafupi ya miongozo ya sera. Maelezo haya yataonekana kwenye ukurasa wa miongozo ya sera..."
                rows={5}
                className="text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-y min-h-[120px]"
                required
              />
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                <span>Maelezo haya yataonekana kwenye ukurasa wa miongozo ya sera</span>
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
              <CardTitle className="text-xl font-bold text-gray-900">Faili ya Miongozo ya Sera</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {!file ? (
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
                        Chagua faili au ulete hapa
                      </Label>
                      <p className="text-sm text-gray-600">
                        Aina zinazokubalika: <span className="font-medium">PDF, DOC, DOCX, TXT, JPG, PNG</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Ukubwa wa juu: 10MB</p>
                    </div>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      className="hidden"
                      required
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
                      Chagua Faili
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      {getFileIcon()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-semibold text-gray-900 text-base">{file.name}</span>
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs font-medium">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs font-medium">
                          {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Aina: <span className="font-medium">{file.type || 'Haijulikani'}</span>
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
                
                {/* File Preview for Images */}
                {filePreview && (
                  <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Onyesho la Picha:</p>
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="max-w-xs max-h-48 rounded-lg border-2 border-gray-300 shadow-md mx-auto"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/cms/policy-guidelines')}
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
                  Inahifadhi...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Hifadhi Miongozo ya Sera
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

export default AddPolicyGuideline;
