import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { enhancedGuidelinesService } from '@/services/enhancedGuidelinesService';

const DebugAPI: React.FC = () => {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testId, setTestId] = useState('2');

  const checkAuthToken = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    setResults({
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'No token',
      user: user ? JSON.parse(user) : null,
      timestamp: new Date().toISOString()
    });
    
    toast.success('Auth token checked');
  };

  const testPublicAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/guidelines');
      const data = await response.json();
      
      setResults({
        endpoint: 'Public Guidelines API',
        status: response.status,
        success: response.ok,
        data: data,
        timestamp: new Date().toISOString()
      });
      
      toast.success('Public API test completed');
    } catch (error: any) {
      setResults({
        endpoint: 'Public Guidelines API',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      toast.error('Public API test failed');
    } finally {
      setLoading(false);
    }
  };

  const testProtectedAPI = async () => {
    try {
      setLoading(true);
      const guidelines = await enhancedGuidelinesService.getAllPolicyGuidelines();
      
      setResults({
        endpoint: 'Protected Guidelines Management API',
        success: true,
        data: guidelines,
        count: guidelines.length,
        timestamp: new Date().toISOString()
      });
      
      toast.success('Protected API test completed');
    } catch (error: any) {
      setResults({
        endpoint: 'Protected Guidelines Management API',
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        timestamp: new Date().toISOString()
      });
      toast.error('Protected API test failed');
    } finally {
      setLoading(false);
    }
  };

  const testGetById = async () => {
    try {
      setLoading(true);
      const guideline = await enhancedGuidelinesService.getPolicyGuidelineById(parseInt(testId));
      
      setResults({
        endpoint: `Get Guideline by ID (${testId})`,
        success: true,
        data: guideline,
        timestamp: new Date().toISOString()
      });
      
      toast.success('Get by ID test completed');
    } catch (error: any) {
      setResults({
        endpoint: `Get Guideline by ID (${testId})`,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        timestamp: new Date().toISOString()
      });
      toast.error('Get by ID test failed');
    } finally {
      setLoading(false);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setResults(null);
    toast.success('Auth data cleared');
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-normal">API Debug Tool</h1>
        <p className="text-gray-600">Test API endpoints and authentication</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={checkAuthToken} className="w-full">
              Check Auth Token
            </Button>
            <Button onClick={clearAuth} variant="outline" className="w-full">
              Clear Auth Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testPublicAPI} 
              disabled={loading}
              className="w-full"
            >
              Test Public API
            </Button>
            <Button 
              onClick={testProtectedAPI} 
              disabled={loading}
              className="w-full"
            >
              Test Protected API
            </Button>
            <div className="space-y-2">
              <Label htmlFor="testId">Test ID:</Label>
              <Input
                id="testId"
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                placeholder="Enter guideline ID"
              />
              <Button 
                onClick={testGetById} 
                disabled={loading}
                className="w-full"
              >
                Test Get by ID
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DebugAPI;
