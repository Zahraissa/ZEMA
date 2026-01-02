import React, { useState, useEffect } from 'react';
import { permissionAPI, Permission } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Search, Filter, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function PermissionManagement() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsGrouped, setPermissionsGrouped] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      console.log('Loading permissions data...');
      
      const [permissionsResponse, permissionsGroupedResponse, groupsResponse] = await Promise.all([
        permissionAPI.getPermissions().catch(err => {
          console.error('Error fetching permissions:', err);
          return { success: false, message: err.message || 'Failed to fetch permissions', data: [] };
        }),
        permissionAPI.getPermissionsGrouped().catch(err => {
          console.error('Error fetching grouped permissions:', err);
          return { success: false, message: err.message || 'Failed to fetch grouped permissions', data: {} };
        }),
        permissionAPI.getPermissionGroups().catch(err => {
          console.error('Error fetching permission groups:', err);
          return { success: false, message: err.message || 'Failed to fetch permission groups', data: [] };
        })
      ]);

      console.log('Permissions response:', permissionsResponse);
      console.log('Grouped permissions response:', permissionsGroupedResponse);
      console.log('Groups response:', groupsResponse);

      if (permissionsResponse.success) {
        setPermissions(permissionsResponse.data || []);
      } else {
        console.error('Failed to load permissions:', permissionsResponse.message);
        toast.error(`Failed to load permissions: ${permissionsResponse.message || 'Unknown error'}`);
      }
      
      if (permissionsGroupedResponse.success) {
        setPermissionsGrouped(permissionsGroupedResponse.data || {});
      } else {
        console.error('Failed to load grouped permissions:', permissionsGroupedResponse.message);
        // Don't show error toast for grouped, just log it
      }
      
      if (groupsResponse.success) {
        setGroups(groupsResponse.data || []);
      } else {
        console.error('Failed to load permission groups:', groupsResponse.message);
        // Don't show error toast for groups, just log it
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load permissions data';
      toast.error(`Failed to load permissions data: ${errorMessage}`);
      
      // Set empty arrays to prevent UI errors
      setPermissions([]);
      setPermissionsGrouped({});
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPermissions = permissions.filter(permission => {
    const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         permission.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || permission.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const getPermissionCount = (group: string) => {
    return permissions.filter(p => p.group === group).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    );
  }

  if (permissions.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Permission Management</h1>
          <p className="text-muted-foreground">View and manage system permissions</p>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No permissions found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Permission Management</h1>
          <p className="text-gray-600">View and manage system permissions</p>
        </div>
        <Button onClick={() => navigate('/cms/add-permission')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Permission
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300 text-gray-900"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-48 bg-white border-gray-300 text-gray-900">
              <SelectValue placeholder="Filter by group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group.charAt(0).toUpperCase() + group.slice(1)} ({getPermissionCount(group)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(permissionsGrouped).map(([group, groupPermissions]) => {
          const filteredGroupPermissions = groupPermissions.filter(permission => {
            const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 permission.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 permission.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesGroup = selectedGroup === 'all' || permission.group === group;
            return matchesSearch && matchesGroup;
          });

          if (filteredGroupPermissions.length === 0) return null;

          return (
            <Card key={group}>
              <CardHeader className="bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <CardTitle className="capitalize text-gray-900">{group}</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">{filteredGroupPermissions.length} permissions</Badge>
                </div>
                <CardDescription className="text-gray-600">
                  Permissions related to {group} management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {filteredGroupPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{permission.display_name}</span>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {permission.name}
                          </Badge>
                        </div>
                        {permission.description && (
                          <p className="text-sm text-gray-600">{permission.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPermissions.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No permissions found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
