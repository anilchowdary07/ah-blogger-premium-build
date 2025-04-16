// Advanced API test script
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// Test the API connection
async function testApiConnection() {
  console.log('=== API CONNECTION TEST ===');
  
  const API_URL = '/.netlify/functions/server';
  
  // Check basic connection
  console.log('\n1. Testing server health...');
  try {
    const response = await fetch(`${API_URL}/health`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      console.log('✅ Server is reachable');
    } else {
      console.log('⚠️ Server returned an error status');
    }
  } catch (error) {
    console.error('❌ Server connection failed:', error.message);
  }
  
  // Test GET endpoints
  const getEndpoints = [
    { name: 'Get all posts', url: `${API_URL}/posts` },
    { name: 'Get post by slug', url: `${API_URL}/posts/welcome-to-our-blog` },
    { name: 'Get featured posts', url: `${API_URL}/posts?featured=true` },
    { name: 'Get posts by category', url: `${API_URL}/posts?category=general` }
  ];
  
  console.log('\n2. Testing GET endpoints...');
  for (const endpoint of getEndpoints) {
    console.log(`\nTesting: ${endpoint.name}`);
    try {
      const response = await fetch(endpoint.url);
      console.log(`Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        const dataPreview = JSON.stringify(data).substring(0, 100).replace(/"/g, "'") + '...';
        console.log(`✅ Success: ${dataPreview}`);
      } else {
        console.log(`❌ Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`❌ Failed: ${error.message}`);
    }
  }
  
  // Test POST endpoints (create post)
  console.log('\n3. Testing POST endpoint (create post)...');
  const newPost = {
    id: uuidv4(),
    title: `Node Test Post ${new Date().toISOString()}`,
    slug: `node-test-post-${Date.now()}`,
    content: "This is a test post created by the Node.js API test.",
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
  
  try {
    console.log('Creating new post...');
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newPost)
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Post created successfully: ${data.id || newPost.id}`);
      
      // Verify post was created
      console.log('\nVerifying post was created...');
      const verifyResponse = await fetch(`${API_URL}/posts/${newPost.slug}`);
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log(`✅ Post verification successful: "${verifyData.title}"`);
      } else {
        console.log(`❌ Post verification failed: ${verifyResponse.status} ${verifyResponse.statusText}`);
      }
    } else {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.log(`❌ Failed to create post: ${errorText}`);
    }
  } catch (error) {
    console.error(`❌ Post creation error: ${error.message}`);
  }
  
  console.log('\n=== TEST COMPLETED ===');
}

testApiConnection().catch(console.error); 