import React, { useState, useEffect } from 'react';
import { 
  Save, 
  ArrowLeft, 
  Upload, 
  X,
  FileText,
  Calendar,
  User,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { guidelinesService, CreateGuidelineRequest } from '@/services/guidelinesService';
import { toast } from 'sonner';

const AddGuideline: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateGuidelineRequest>({
    title: '',
    description: '',
    category: '',
    documentType: '',
    version: '1.0',
    status: 'draft',
    fileUrl: '',
    tags: [],
    author: '',
    department: ''
  });
  const [newTag, setNewTag] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const categories = [
    'Usalama wa Mtandao',
    'Ubunifu wa Programu',
    'Usimamizi wa Data',
    'Ufikiaji',
    'Usimamizi wa Miradi',
    'Usalama wa Taarifa',
    'Huduma za Kidijitali',
    'Teknolojia ya Mawasiliano',
    'Usimamizi wa Miradi',
    'Mafunzo na Ujuzi'
  ];

  const documentTypes = [
    'Miongozo',
    'Viwango',
    'Sera',
    'Maelekezo',
    'Kanuni',
    'Sheria'
  ];

  const departments = [
    'eGAZ',
    'Idara ya Usalama wa Mtandao',
    'Idara ya Teknolojia',
    'Idara ya Data na Analytics',
    'Idara ya Huduma za Umma',
    'Idara ya Miradi',
    'Idara ya Usalama',
    'Idara ya Mawasiliano'
  ];

  const handleInputChange = (field: keyof CreateGuidelineRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // In a real implementation, you would upload the file to your server
      // and get back a URL. For now, we'll just use a placeholder
      setFormData(prev => ({
        ...prev,
        fileUrl: `/documents/${file.name}`
      }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.documentType) {
      toast.error('Tafadhali jaza sehemu zote muhimu');
      return;
    }

    try {
      setIsLoading(true);
      await guidelinesService.createGuideline(formData);
      toast.success('Miongozo imeongezwa kwa mafanikio');
      navigate('/cms/guidelines');
    } catch (error) {
      console.error('Failed to create guideline:', error);
      toast.error('Imeshindwa kuongeza miongozo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/cms/guidelines')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Rudi nyuma
          </Button>
          <div>
            <h1 className="text-2xl font-normal text-gray-900">Ongeza Miongozo Mpya</h1>
            <p className="text-gray-600">Ongeza miongozo au viwango vipya vya e-Government Authority</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Taarifa za Msingi</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Jina la Miongozo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ingiza jina la miongozo..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Maelezo *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Ingiza maelezo ya miongozo..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Kategoria *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chagua kategoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="documentType">Aina ya Nyaraka *</Label>
                  <Select value={formData.documentType} onValueChange={(value) => handleInputChange('documentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chagua aina" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="version">Toleo</Label>
                  <Input
                    id="version"
                    value={formData.version}
                    onChange={(e) => handleInputChange('version', e.target.value)}
                    placeholder="1.0"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Hali</Label>
                  <Select value={formData.status} onValueChange={(value: 'active' | 'draft' | 'archived') => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rasimu</SelectItem>
                      <SelectItem value="active">Inatumika</SelectItem>
                      <SelectItem value="archived">Iliyohifadhiwa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Author and Department */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Mwandishi na Idara</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="author">Mwandishi *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  placeholder="Ingiza jina la mwandishi..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="department">Idara *</Label>
                <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chagua idara" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(department => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fileUrl">URL ya Faili</Label>
                <Input
                  id="fileUrl"
                  value={formData.fileUrl}
                  onChange={(e) => handleInputChange('fileUrl', e.target.value)}
                  placeholder="https://example.com/document.pdf"
                />
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="fileUpload">Pakia Faili</Label>
                <div className="mt-2">
                  <Input
                    id="fileUpload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                </div>
                {uploadedFile && (
                  <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>{uploadedFile.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUploadedFile(null);
                        setFormData(prev => ({ ...prev, fileUrl: '' }));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tag className="w-5 h-5" />
              <span>Vitambulisho (Tags)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Ingiza vitambulisho..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} disabled={!newTag.trim()}>
                  Ongeza
                </Button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="h-auto p-0 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/cms/guidelines')}
            disabled={isLoading}
          >
            Ghairi
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Inahifadhi...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Hifadhi Miongozo
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddGuideline;
