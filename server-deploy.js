
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure db.json exists
const dbPath = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbPath)) {
  // Initialize db.json with empty posts array
  const initialDb = {
    posts: []
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
  console.log('Created initial db.json file');
}

// Get saved posts from localStorage if in browser context
const syncLocalStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const savedPosts = localStorage.getItem('blogPosts');
      if (savedPosts) {
        const dbContent = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        dbContent.posts = JSON.parse(savedPosts);
        fs.writeFileSync(dbPath, JSON.stringify(dbContent, null, 2));
        console.log('Synced posts from localStorage to db.json');
      }
    } catch (err) {
      console.error('Failed to sync localStorage posts:', err);
    }
  }
};

// Try to sync
syncLocalStorage();

console.log('\n=== DEPLOYMENT INSTRUCTIONS ===');
console.log('To deploy your JSON Server backend:');
console.log('1. Create a new service on Render.com or similar platform');
console.log('2. Set the build command: npm install');
console.log('3. Set the start command: node server.js');
console.log('4. After deployment, update the API_URL in src/services/blogService.ts');
console.log('   to point to your deployed server URL');
console.log('=================================\n');

// Log current configuration
console.log('Server configured to run on port:', process.env.PORT || 3000);
console.log('API will be accessible at: /api');
