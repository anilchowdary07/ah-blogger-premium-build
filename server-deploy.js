
const { execSync } = require('child_process');
const fs = require('fs');

// Get the current blog posts from localStorage if running in a browser
if (typeof window !== 'undefined') {
  const savedPosts = localStorage.getItem('blogPosts');
  if (savedPosts) {
    const dbContent = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    dbContent.posts = JSON.parse(savedPosts);
    fs.writeFileSync('db.json', JSON.stringify(dbContent, null, 2));
  }
}

// Deploy to render.com or similar service
console.log('Ready to deploy! Follow these steps:');
console.log('1. Create a new Web Service on render.com');
console.log('2. Connect your GitHub repository');
console.log('3. Set the start command to: node server.js');
console.log('4. Deploy!');
