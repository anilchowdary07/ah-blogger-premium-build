import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { v4 as uuidv4 } from 'uuid';

const ApiTest = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isServerReachable, setIsServerReachable] = useState<boolean | null>(null);

  useEffect(() => {
    const runTests = async () => {
      setIsLoading(true);
      try {
        setTestResults(prev => [...prev, "Starting API tests..."]);
        
        // Check server connection
        try {
          setTestResults(prev => [...prev, "Testing server connection..."]);
          const response = await fetch('/.netlify/functions/server/health');
          if (response.ok) {
            setTestResults(prev => [...prev, "✅ Server is reachable"]);
            setIsServerReachable(true);
          } else {
            setTestResults(prev => [...prev, `⚠️ Server returned status ${response.status}`]);
            setIsServerReachable(false);
          }
        } catch (err) {
          setTestResults(prev => [...prev, `⚠️ Server connection failed: ${err.message}`]);
          setIsServerReachable(false);
        }
        
        // Test getAllPosts
        try {
          setTestResults(prev => [...prev, "\nTesting getAllPosts..."]);
          const posts = await storageService.getAllPosts();
          setTestResults(prev => [...prev, `✅ Success: Got ${posts.length} posts`]);
          setTestResults(prev => [...prev, `Post titles: ${posts.map(p => p.title).join(', ')}`]);
        } catch (err) {
          setTestResults(prev => [...prev, `❌ Error: getAllPosts failed - ${err.message}`]);
        }
        
        // Test getPostBySlug
        try {
          setTestResults(prev => [...prev, "\nTesting getPostBySlug..."]);
          const post = await storageService.getPostBySlug('welcome-to-our-blog');
          if (post) {
            setTestResults(prev => [...prev, `✅ Success: Post found - "${post.title}"`]);
          } else {
            setTestResults(prev => [...prev, `⚠️ Note: Post not found`]);
          }
        } catch (err) {
          setTestResults(prev => [...prev, `❌ Error: getPostBySlug failed - ${err.message}`]);
        }
        
        // Test savePost
        try {
          setTestResults(prev => [...prev, "\nTesting savePost..."]);
          const newPost = {
            id: uuidv4(),
            title: `Test Post ${new Date().toISOString()}`,
            slug: `test-post-${Date.now()}`,
            content: "This is a test post created by the API test.",
            excerpt: "Test post excerpt",
            coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
            author: "Test User",
            date: new Date().toISOString(),
            category: "test",
            tags: ["test", "api"],
            readingTime: 1,
            featured: false,
            published: true,
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          const success = await storageService.savePost(newPost);
          if (success) {
            setTestResults(prev => [...prev, `✅ Success: Post "${newPost.title}" saved successfully`]);
          } else {
            setTestResults(prev => [...prev, `⚠️ Note: Post saved to local storage only`]);
          }
          
          // Verify the post was saved by getting all posts again
          const updatedPosts = await storageService.getAllPosts();
          const savedPost = updatedPosts.find(p => p.id === newPost.id);
          if (savedPost) {
            setTestResults(prev => [...prev, `✅ Verification: Post found in storage`]);
          } else {
            setTestResults(prev => [...prev, `❌ Verification failed: Post not found in storage`]);
          }
        } catch (err) {
          setTestResults(prev => [...prev, `❌ Error: savePost failed - ${err.message}`]);
        }
        
        setTestResults(prev => [...prev, "\nTests completed"]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    runTests();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">API Connection Test</h1>
      
      {isServerReachable !== null && (
        <div className={`mb-6 p-4 rounded ${isServerReachable ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          <h2 className="text-lg font-semibold">Server Status: {isServerReachable ? 'Connected' : 'Not Connected'}</h2>
          <p className="mt-1">
            {isServerReachable 
              ? 'The API server is reachable. Tests should communicate with the actual server.' 
              : 'Using local storage fallback. Changes will not be saved to the server.'}
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span>Running tests...</span>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap">
            {testResults.map((result, index) => (
              <div key={index} className={`py-1 ${
                result.includes('✅') ? 'text-green-600 dark:text-green-400' :
                result.includes('❌') ? 'text-red-600 dark:text-red-400' :
                result.includes('⚠️') ? 'text-yellow-600 dark:text-yellow-400' :
                ''
              }`}>{result}</div>
            ))}
          </pre>
        )}
      </div>
      
      <div className="mt-6">
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Run Tests Again
        </button>
        <button 
          onClick={() => window.history.back()} 
          className="px-4 py-2 ml-4 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ApiTest; 