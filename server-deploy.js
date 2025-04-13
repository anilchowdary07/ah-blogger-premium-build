
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.cyan('\n========================================'));
console.log(chalk.cyan('     BLOG SERVER DEPLOYMENT HELPER       '));
console.log(chalk.cyan('========================================\n'));

// Ensure db.json exists
const dbPath = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbPath)) {
  // Initialize db.json with empty posts array
  const initialDb = {
    posts: []
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialDb, null, 2));
  console.log(chalk.green('✓ Created initial db.json file'));
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
        console.log(chalk.green('✓ Synced posts from localStorage to db.json'));
      }
    } catch (err) {
      console.error(chalk.red('✗ Failed to sync localStorage posts:'), err);
    }
  }
};

// Try to sync
syncLocalStorage();

console.log(chalk.yellow('\n=== STEP-BY-STEP DEPLOYMENT GUIDE ===\n'));

console.log(chalk.white('Step 1: Prepare Your Backend'));
console.log('  • Ensure your server.js and db.json are ready');
console.log('  • Test your server locally with: node server.js\n');

console.log(chalk.white('Step 2: Choose a Deployment Platform'));
console.log('  Option A: Render.com (Recommended)');
console.log('  Option B: Heroku');
console.log('  Option C: Railway.app');
console.log('  Option D: DigitalOcean\n');

console.log(chalk.white('Step 3: Deploy Backend on Render.com'));
console.log('  1. Create an account at render.com');
console.log('  2. Click "New +" and select "Web Service"');
console.log('  3. Connect your GitHub repository or upload your code');
console.log('  4. Configure the deployment:');
console.log('     • Name: blog-backend');
console.log('     • Environment: Node');
console.log('     • Build Command: npm install');
console.log('     • Start Command: node server.js');
console.log('     • Add environment variables if needed');
console.log('  5. Click "Create Web Service"\n');

console.log(chalk.white('Step 4: Configure Your Frontend'));
console.log('  1. Update API_URL in src/services/blogService.ts to point to your deployed backend');
console.log('     Example: const API_URL = "https://your-backend-url.onrender.com/api";');
console.log('  2. Build your frontend: npm run build');
console.log('  3. Deploy your frontend to Netlify, Vercel, or GitHub Pages\n');

console.log(chalk.white('Step 5: Frontend Deployment on Netlify'));
console.log('  1. Create an account at netlify.com');
console.log('  2. Click "Add new site" > "Import an existing project"');
console.log('  3. Connect to your GitHub repository');
console.log('  4. Configure the deployment:');
console.log('     • Build command: npm run build');
console.log('     • Publish directory: dist');
console.log('     • Add environment variables if needed');
console.log('  5. Click "Deploy site"\n');

console.log(chalk.white('Step 6: Final Configuration'));
console.log('  1. Set up a custom domain if desired');
console.log('  2. Configure CORS in server.js to allow requests from your frontend domain');
console.log('  3. Test the complete application\n');

console.log(chalk.green('Current Configuration:'));
console.log('• Server port:', chalk.cyan(process.env.PORT || 3000));
console.log('• API endpoint:', chalk.cyan('/api'));
console.log('• Database file:', chalk.cyan('db.json'));
console.log('• CORS enabled:', chalk.green('Yes'));

console.log(chalk.yellow('\nNeed help? Reach out to our support team or refer to the documentation.\n'));
