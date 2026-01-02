import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { enhancedGuidelinesService, CreateSampleTemplateData } from '@/services/enhancedGuidelinesService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const AddSampleTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateSampleTemplateData>({
    title: '',
    description: '',
    content: '',
    template_type: 'Document Template',
    category: 'General',
    template_category: '',
    use_case: '',
    version: '1.0',
    status: 'draft',
    tags: [],
    prerequisites: [],
    estimated_time: '',
    complexity: 'Medium',
    author: '',
    department: '',
    date_published: new Date().toISOString().split('T')[0],
    featured: false,
    order: 1,
  });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');

  const handleInputChange = (field: keyof CreateSampleTemplateData, value: string | number | boolean) => {
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites?.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...(prev.prerequisites || []), newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (prereqToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites?.filter(prereq => prereq !== prereqToRemove) || []
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast.error('Jina la mfano ni lazima');
      return false;
    }
    
    if (!formData.template_type.trim()) {
      toast.error('Aina ya mfano ni lazima');
      return false;
    }
    
    if (!formData.category.trim()) {
      toast.error('Kategoria ni lazima');
      return false;
    }
    
    if (!formData.version.trim()) {
      toast.error('Toleo ni lazima');
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
      
      // Create the sample template
      const result = await enhancedGuidelinesService.createSampleTemplate({
        ...formData,
        file: file || undefined
      });

      console.log('Success response:', result);
      toast.success('Mfano umeongezwa kwa mafanikio');
      navigate('/cms/samples-templates');
      
    } catch (error: any) {
      console.error('Failed to create sample template:', error);
      
      // Detailed error handling
      let errorMessage = 'Imeshindwa kuongeza mfano. Tafadhali jaribu tena.';
      
      if (error.response) {
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
        }
      } else if (error.request) {
        errorMessage = 'Server haijibu. Tafadhali angalia muunganisho wa mtandao.';
      } else {
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

  const templateTypes = [
    'Document Template',
    'Form Template',
    'Report Template',
    'Process Template',
    'Code Template'
  ];

  const categories = [
    'General',
    'Administrative',
    'Technical',
    'Financial',
    'HR',
    'Project Management'
  ];

  const complexityLevels = [
    'Low',
    'Medium',
    'High'
  ];

  const statusOptions = [
    { value: 'draft', label: 'Rasimu' },
    { value: 'active', label: 'Aktifu' },
    { value: 'inactive', label: 'Haijaamilishwa' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/cms/samples-templates')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Rudi
        </Button>
        <div>
          <h1 className="text-2xl font-normal text-gray-900">Ongeza Mfano</h1>
          <p className="text-gray-600">Ongeza mfano mpya wa miongozo</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Information */}
        <Card>
          <CardHeader>
            <CardTitle>Taarifa za Mfano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-normal">
                Jina la Mfano *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Jina la mfano"
                className="text-lg"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-normal">
                Maelezo Mafupi
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Maelezo mafupi ya mfano..."
                rows={4}
                className="text-base"
              />
            </div>

            {/* Template Type */}
            <div className="space-y-2">
              <Label htmlFor="template_type" className="text-base font-normal">
                Aina ya Mfano *
              </Label>
              <Select 
                value={formData.template_type} 
                onValueChange={(value) => handleInputChange('template_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chagua aina" />
                </SelectTrigger>
                <SelectContent>
                  {templateTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-normal">
                Kategoria *
              </Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chagua kategoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Template Category */}
            <div className="space-y-2">
              <Label htmlFor="template_category" className="text-base font-normal">
                Kategoria ya Mfano
              </Label>
              <Input
                id="template_category"
                value={formData.template_category}
                onChange={(e) => handleInputChange('template_category', e.target.value)}
                placeholder="Kategoria ya mfano (optional)"
              />
            </div>

            {/* Use Case */}
            <div className="space-y-2">
              <Label htmlFor="use_case" className="text-base font-normal">
                Matumizi
              </Label>
              <Input
                id="use_case"
                value={formData.use_case}
                onChange={(e) => handleInputChange('use_case', e.target.value)}
                placeholder="Matumizi ya mfano"
              />
            </div>

            {/* Version */}
            <div className="space-y-2">
              <Label htmlFor="version" className="text-base font-normal">
                Toleo *
              </Label>
              <Input
                id="version"
                value={formData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                placeholder="1.0"
                required
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-base font-normal">
                Hali
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleInputChange('status', value as 'active' | 'inactive' | 'draft')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chagua hali" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Complexity */}
            <div className="space-y-2">
              <Label htmlFor="complexity" className="text-base font-normal">
                Ugumu
              </Label>
              <Select 
                value={formData.complexity} 
                onValueChange={(value) => handleInputChange('complexity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chagua ugumu" />
                </SelectTrigger>
                <SelectContent>
                  {complexityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estimated Time */}
            <div className="space-y-2">
              <Label htmlFor="estimated_time" className="text-base font-normal">
                Muda unaotarajiwa
              </Label>
              <Input
                id="estimated_time"
                value={formData.estimated_time}
                onChange={(e) => handleInputChange('estimated_time', e.target.value)}
                placeholder="e.g., 2 hours, 1 day"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author" className="text-base font-normal">
                Mwandishi
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Jina la mwandishi"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-base font-normal">
                Idara
              </Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="Jina la idara"
              />
            </div>

            {/* Date Published */}
            <div className="space-y-2">
              <Label htmlFor="date_published" className="text-base font-normal">
                Tarehe ya Kuchapishwa *
              </Label>
              <Input
                id="date_published"
                type="date"
                value={formData.date_published}
                onChange={(e) => handleInputChange('date_published', e.target.value)}
                required
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-base font-normal">
                Vitambulisho
              </Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Ongeza kitambulisho na ubofye Enter"
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Ongeza
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Prerequisites */}
            <div className="space-y-2">
              <Label htmlFor="prerequisites" className="text-base font-normal">
                Masharti ya Awali
              </Label>
              <div className="flex gap-2">
                <Input
                  id="prerequisites"
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPrerequisite();
                    }
                  }}
                  placeholder="Ongeza sharti la awali na ubofye Enter"
                />
                <Button type="button" onClick={addPrerequisite} variant="outline">
                  Ongeza
                </Button>
              </div>
              {formData.prerequisites && formData.prerequisites.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.prerequisites.map((prereq) => (
                    <Badge key={prereq} variant="secondary" className="flex items-center gap-1">
                      {prereq}
                      <button
                        type="button"
                        onClick={() => removePrerequisite(prereq)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Faili ya Mfano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <Label htmlFor="file" className="text-lg font-normal text-gray-700 cursor-pointer">
                      Chagua faili au ulete hapa
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Aina zinazokubalika: PDF, DOC, DOCX, TXT, JPG, PNG
                    </p>
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
                    variant="outline"
                    onClick={() => document.getElementById('file')?.click()}
                  >
                    Chagua Faili
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  {getFileIcon()}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-normal text-gray-900">{file.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Aina: {file.type || 'Haijulikani'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* File Preview for Images */}
                {filePreview && (
                  <div className="mt-4">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="max-w-xs max-h-48 rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/cms/samples-templates')}
          >
            Ghairi
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[200px]">
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Inahifadhi...' : 'Hifadhi Mfano'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddSampleTemplate;

