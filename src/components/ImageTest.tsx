import React, { useState } from 'react';
import { STORAGE_BASE_URL } from '@/config';

const ImageTest = () => {
  const [testUrls, setTestUrls] = useState([
    `${STORAGE_BASE_URL}sliders/test.jpg`,
    `${STORAGE_BASE_URL}test.jpg`,
    `${STORAGE_BASE_URL}app/public/sliders/test.jpg`,
  ]);

  const [results, setResults] = useState<{[key: string]: 'loading' | 'success' | 'error'}>({});

  const testImage = (url: string) => {
    setResults(prev => ({ ...prev, [url]: 'loading' }));
    
    const img = new Image();
    img.onload = () => {
      setResults(prev => ({ ...prev, [url]: 'success' }));
      console.log('✅ Image loaded successfully:', url);
    };
    img.onerror = () => {
      setResults(prev => ({ ...prev, [url]: 'error' }));
      console.log('❌ Image failed to load:', url);
    };
    img.src = url;
  };

  const addTestUrl = () => {
    const newUrl = prompt('Enter test URL:');
    if (newUrl) {
      setTestUrls(prev => [...prev, newUrl]);
    }
  };

  const testAllUrls = () => {
    testUrls.forEach(url => testImage(url));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'loading': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'loading': return '⏳';
      default: return '⏸️';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white p-4 rounded-lg shadow-lg max-w-md">
      <h3 className="font-normal mb-2">Image URL Tester</h3>
      
      <div className="space-y-2 mb-4">
        {testUrls.map((url, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className={getStatusColor(results[url] || '')}>
              {getStatusIcon(results[url] || '')}
            </span>
            <button
              onClick={() => testImage(url)}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Test
            </button>
            <span className="text-xs text-gray-600 truncate">{url}</span>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={testAllUrls}
          className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          Test All
        </button>
        <button
          onClick={addTestUrl}
          className="text-xs bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
        >
          Add URL
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        Check console for detailed logs
      </div>
    </div>
  );
};

export default ImageTest;
