import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, FileText, Save, FileEdit, FileText as FileTextIcon, ToggleLeft, ToggleRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { managementAPI } from '@/services/api';
import Swal from 'sweetalert2';

const AddOrodha: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const getFileIcon = () => {
    if (!selectedFile) return <FileText className="w-8 h-8 text-gray-400" />;
    
    if (selectedFile.type.startsWith('image/')) {
      return <FileText className="w-8 h-8 text-blue-600" />;
    } else if (selectedFile.type.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-600" />;
    } else if (selectedFile.type.includes('word') || selectedFile.type.includes('document')) {
      return <FileText className="w-8 h-8 text-blue-600" />;
    } else {
      return <FileText className="w-8 h-8 text-gray-600" />;
    }
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

    if (!selectedFile) {
      await Swal.fire({
        icon: 'error',
        title: 'Faili Linahitajika',
        text: 'Tafadhali chagua faili ya kuweka.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Show loading alert
      Swal.fire({
        title: 'Inahifadhi...',
        text: 'Tafadhali subiri, hati inawekwa.',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append('title', documentName);
      formDataToSend.append('description', ''); // Empty description as per requirements
      formDataToSend.append('category', 'Orodha ya Viwango na Miongozo'); // Category for Orodha
      formDataToSend.append('status', isActive ? 'active' : 'inactive');
      formDataToSend.append('order', '1');
      formDataToSend.append('featured', '0');
      
      // Append file
      formDataToSend.append('file', selectedFile);

      // Call API
      const response = await managementAPI.createGuide(formDataToSend);

      console.log('API Response:', response);

      if (response.success) {
        // Success message
        await Swal.fire({
          icon: 'success',
          title: 'Imefanikiwa!',
          text: 'Hati imeongezwa kwa mafanikio.',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });

        // Navigate back to manage orodha page
        navigate('/cms/manage-orodha');
      } else {
        throw new Error(response.message || 'Failed to create orodha');
      }
      
    } catch (error: any) {
      console.error('Error creating orodha:', error);
      
      let errorMessage = 'Imeshindwa kuongeza hati. Tafadhali jaribu tena.';
      
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/cms/manage-orodha')}
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
                  Ongeza Orodha
                </h1>
                <p className="text-gray-600 mt-1">Ongeza orodha mpya kwenye mfumo</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Fomu Mpya</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Mfano: Orodha ya Viwango na Miongozo"
                className="h-12 text-base border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                required
              />
              <p className="text-sm text-gray-500">
                Ingiza jina kamili la orodha unayotaka kuongeza
              </p>
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
            {!selectedFile ? (
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
              <div className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    {getFileIcon()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-gray-900 text-base">{selectedFile.name}</span>
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
            )}
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
              onClick={() => navigate('/cms/manage-orodha')}
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
                  Hifadhi Orodha
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

export default AddOrodha;

