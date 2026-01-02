import React, { useState } from 'react';
import { permissionAPI, Permission } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Shield, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PermissionFormData {
  name: string;
  display_name: string;
  description: string;
  group: string;
}

const PERMISSION_GROUPS = [
  'users',
  'roles', 
  'content',
  'settings',
  'dashboard',
  'files',
  'reports',
  'notifications',
  'analytics',
  'security'
];

export default function AddPermission() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PermissionFormData>({
    name: '',
    display_name: '',
    description: '',
    group: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.display_name || !formData.group) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      const response = await permissionAPI.createPermission(formData);
      
      if (response.success) {
        toast.success('Permission created successfully!');
        
        // Navigate back to permissions list after a short delay
        setTimeout(() => {
          navigate('/cms/permissions');
        }, 1000);
      } else {
        toast.error('Failed to create permission');
      }
      
    } catch (error: any) {
      console.error('Error creating permission:', error);
      
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors?.name?.includes('already been taken')) {
          toast.error('A permission with this name already exists. Please choose a different name.');
        } else {
          toast.error('Validation error: ' + Object.values(errors).flat().join(', '));
        }
      } else {
        toast.error('Failed to create permission');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PermissionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generatePermissionName = (displayName: string) => {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Permission</h1>
          <p className="text-gray-600">Create a new permission for the system</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/cms/permissions')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Permissions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Permission Details</span>
          </CardTitle>
          <CardDescription>
            Fill in the details for the new permission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="display_name" className="text-gray-900 font-medium">
                  Display Name *
                </Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => {
                    const displayName = e.target.value;
                    handleInputChange('display_name', displayName);
                    // Auto-generate permission name
                    if (displayName && !formData.name) {
                      handleInputChange('name', generatePermissionName(displayName));
                    }
                  }}
                  placeholder="e.g., Manage Reports"
                  className="bg-white border-gray-300 text-gray-900"
                  required
                />
                <p className="text-xs text-gray-500">
                  The human-readable name for this permission
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900 font-medium">
                  Permission Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., manage_reports"
                  className="bg-white border-gray-300 text-gray-900"
                  required
                />
                <p className="text-xs text-gray-500">
                  The system name (snake_case format)
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group" className="text-gray-900 font-medium">
                Permission Group *
              </Label>
              <Select value={formData.group} onValueChange={(value) => handleInputChange('group', value)}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {PERMISSION_GROUPS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                The category this permission belongs to
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this permission allows users to do..."
                className="bg-white border-gray-300 text-gray-900"
                rows={3}
              />
              <p className="text-xs text-gray-500">
                Optional description of what this permission does
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => {
                setFormData({
                  name: '',
                  display_name: '',
                  description: '',
                  group: ''
                });
              }}>
                Clear Form
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Permission'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview Section */}
      {formData.name && formData.display_name && formData.group && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-900">Permission Preview</CardTitle>
            <CardDescription>This is how your permission will appear</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{formData.display_name}</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {formData.name}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{formData.description || 'No description provided'}</p>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Group:</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                  {formData.group}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

