import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enhancedGuidelinesService } from '@/services/enhancedGuidelinesService';

const TestAPI: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testGetAll = async () => {
    setLoading(true);
    setResult('Testing getAllPolicyGuidelines...\n');
    
    try {
      const guidelines = await enhancedGuidelinesService.getAllPolicyGuidelines();
      setResult(prev => prev + `✅ Success! Found ${guidelines.length} guidelines\n`);
      setResult(prev => prev + `First guideline: ${JSON.stringify(guidelines[0], null, 2)}\n`);
    } catch (error: any) {
      setResult(prev => prev + `❌ Error: ${error.message}\n`);
      setResult(prev => prev + `Status: ${error.response?.status}\n`);
      setResult(prev => prev + `Data: ${JSON.stringify(error.response?.data, null, 2)}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testGetById = async () => {
    setLoading(true);
    setResult('Testing getPolicyGuidelineById(2)...\n');
    
    try {
      const guideline = await enhancedGuidelinesService.getPolicyGuidelineById(2);
      setResult(prev => prev + `✅ Success! Found guideline:\n`);
      setResult(prev => prev + `${JSON.stringify(guideline, null, 2)}\n`);
    } catch (error: any) {
      setResult(prev => prev + `❌ Error: ${error.message}\n`);
      setResult(prev => prev + `Status: ${error.response?.status}\n`);
      setResult(prev => prev + `Data: ${JSON.stringify(error.response?.data, null, 2)}\n`);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    setResult(`Auth Token: ${token ? 'Present' : 'Missing'}\n`);
    setResult(prev => prev + `Token preview: ${token ? token.substring(0, 20) + '...' : 'No token'}\n`);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-normal">API Test Page</h1>
      
      <div className="flex space-x-4">
        <Button onClick={checkAuth} disabled={loading}>
          Check Auth
        </Button>
        <Button onClick={testGetAll} disabled={loading}>
          Test GetAll
        </Button>
        <Button onClick={testGetById} disabled={loading}>
          Test GetById
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded">
            {result || 'Click a button to test the API...'}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestAPI;
