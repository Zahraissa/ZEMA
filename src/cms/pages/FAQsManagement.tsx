import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Save, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { faqService, FAQ, CreateFAQData, UpdateFAQData } from '@/services/faqService';



const FAQsManagement: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: '',
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load FAQs from API
  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setIsLoading(true);
    try {
      const response = await faqService.getFAQs();
      const faqsArray = Array.isArray(response.data) ? response.data : [];
      setFaqs(faqsArray);
    } catch (error: any) {
      console.error('Failed to load FAQs:', error);
      toast.error('Failed to load FAQs');
      setFaqs([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFAQs = Array.isArray(faqs) ? faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  


  const handleAddFAQ = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const createData: CreateFAQData = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category || undefined,
        isActive: formData.isActive
      };

      await faqService.createFAQ(createData);
      await loadFAQs(); // Reload FAQs
      resetForm();
      setIsAddDialogOpen(false);
      toast.success('FAQ added successfully');
    } catch (error) {
      console.error('Failed to add FAQ:', error);
      toast.error('Failed to add FAQ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditFAQ = async () => {
    if (!editingFAQ || !formData.question.trim() || !formData.answer.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const updateData: UpdateFAQData = {
        question: formData.question,
        answer: formData.answer,
        category: formData.category || undefined,
        isActive: formData.isActive
      };

      await faqService.updateFAQ(editingFAQ.id, updateData);
      await loadFAQs(); // Reload FAQs
      resetForm();
      setIsEditDialogOpen(false);
      setEditingFAQ(null);
      toast.success('FAQ updated successfully');
    } catch (error) {
      console.error('Failed to update FAQ:', error);
      toast.error('Failed to update FAQ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFAQ = async (id: number) => {
    setIsLoading(true);
    try {
      await faqService.deleteFAQ(id);
      await loadFAQs(); // Reload FAQs
      toast.success('FAQ deleted successfully');
    } catch (error) {
      console.error('Failed to delete FAQ:', error);
      toast.error('Failed to delete FAQ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    setIsLoading(true);
    try {
      await faqService.toggleFAQStatus(id);
      await loadFAQs(); // Reload FAQs
      toast.success('FAQ status updated successfully');
    } catch (error) {
      console.error('Failed to update FAQ status:', error);
      toast.error('Failed to update FAQ status');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || '',
      isActive: faq.isActive
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      category: '',
      isActive: true
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error, 'for date:', dateString);
      return 'Invalid Date';
    }
  };

  const getDateField = (faq: FAQ, field: 'created' | 'updated') => {
    // Try camelCase first, then snake_case
    const camelField = field === 'created' ? 'createdAt' : 'updatedAt';
    const snakeField = field === 'created' ? 'created_at' : 'updated_at';
    
    return faq[camelField] || faq[snakeField] || '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-normal text-gray-900">FAQs Management</h1>
          <p className="text-gray-600 mt-1">Manage frequently asked questions and their answers</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Question *
                </label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  placeholder="Enter the question"
                />
              </div>
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Answer *
                </label>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  placeholder="Enter the answer"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  Category
                </label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="Enter category (optional)"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <label htmlFor="isActive" className="text-sm font-normal text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddFAQ} disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add FAQ'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* FAQs List */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFAQs.map((faq) => (
          <Card key={faq.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-normal text-gray-900">{faq.question}</h3>
                    <Badge variant={faq.isActive ? "default" : "secondary"}>
                      {faq.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {faq.category && (
                      <Badge variant="outline">{faq.category}</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 line-clamp-2">{faq.answer}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Created: {formatDate(getDateField(faq, 'created'))}</span>
                    <span>Updated: {formatDate(getDateField(faq, 'updated'))}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(faq)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(faq.id)}
                    disabled={isLoading}
                  >
                    {faq.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete FAQ</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this FAQ? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteFAQ(faq.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}

      {filteredFAQs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-normal text-gray-900 mb-2">No FAQs found</h3>
            <p className="text-gray-600">
              {searchQuery ? 'No FAQs match your search criteria.' : 'Get started by adding your first FAQ.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Question *
              </label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter the question"
              />
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Answer *
              </label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Enter the answer"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-2">
                Category
              </label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Enter category (optional)"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="editIsActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="editIsActive" className="text-sm font-normal text-gray-700">
                Active
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingFAQ(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditFAQ} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update FAQ'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FAQsManagement;
