
# AH Blogger - Modern Blog Platform

## Overview

AH Blogger is a modern, responsive blog platform built with React, TypeScript, and SQLite. It features a clean, user-friendly interface with admin capabilities for content management.

![AH Blogger Screenshot](https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVuY3x8MnwwfHwxMzg4NDc3MzYwfA%3D%3D&auto=format&fit=crop&w=1000&q=80)

## Features

- Responsive design that works on mobile, tablet, and desktop
- Admin dashboard for content management
- Rich text editor for creating and editing posts
- Category and tag organization
- Featured posts highlighting
- Search functionality
- SQLite database for persistent data storage
- Netlify serverless functions for backend API
- Authentication system for admin access

## Live Demo

Visit the live site: [Your Netlify Domain]

## Table of Contents

1. [Setup and Installation](#setup-and-installation)
2. [Admin Configuration](#admin-configuration)
3. [Content Management](#content-management)
4. [Deployment Guide](#deployment-guide)
5. [Customization Options](#customization-options)
6. [Troubleshooting](#troubleshooting)
7. [Tech Stack](#tech-stack)

## Setup and Installation

### Local Development

1. **Clone the repository**

```bash
git clone [repository-url]
cd ah-blogger
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Access the application**

Open your browser and navigate to: http://localhost:5173

### Environment Setup

No environment variables are required for basic functionality. The application uses SQLite for data storage, which is handled by the Netlify serverless functions.

## Admin Configuration

### Default Admin Credentials

- **Email:** admin@example.com
- **Password:** password123

### Changing Admin Credentials

1. Log in with the default credentials
2. Navigate to the Admin Dashboard
3. Click on "Admin Settings" in the sidebar
4. Update your name, email, and password
5. Click "Save Changes"

These settings will persist across sessions in your browser's localStorage. When deployed to Netlify, the changes will be visible across all devices.

## Content Management

### Creating a New Post

1. Log in to the admin dashboard
2. Click "New Post" button
3. Fill in the post details:
   - Title
   - Content (supports rich text formatting)
   - Category
   - Tags (comma separated)
   - Featured image URL
   - Featured post toggle (for homepage highlighting)
4. Click "Publish" to make the post live immediately, or save as draft

### Editing Existing Posts

1. Navigate to the admin dashboard
2. Find the post in the list and click "Edit"
3. Make your changes
4. Click "Update" to save changes

### Organizing Content

- **Categories:** Used for primary organization (e.g., Technology, Science)
- **Tags:** Used for more granular organization and related content links
- **Featured Toggle:** Marks posts to appear in the featured section of the homepage

## Deployment Guide

### Deploying to Netlify

1. **Create a Netlify account**

   Sign up at [netlify.com](https://netlify.com) if you don't have an account.

2. **Connect your GitHub repository**

   - Go to the Netlify dashboard
   - Click "New site from Git"
   - Select GitHub and authorize Netlify
   - Select your repository

3. **Configure build settings**

   - Build command: `npm run build`
   - Publish directory: `dist`
   - Advanced build settings: 
     - Add runtime environment variable: `NODE_VERSION` = `18`

4. **Deploy your site**

   Click "Deploy site" and wait for the build to complete.

5. **Configure Netlify Functions**

   The serverless SQLite API will be automatically set up through the netlify.toml configuration.

6. **Custom domain setup (Optional)**

   - Go to "Site settings" > "Domain management"
   - Click "Add custom domain"
   - Follow the instructions to set up your domain with Netlify

### Database Persistence

The SQLite database is created and managed in the Netlify Functions environment. The database file is stored in the Netlify deployment and persists across function invocations.

## Customization Options

### Styling and Theming

1. **Colors and Theme**

   - Primary theme colors are defined in `tailwind.config.ts`
   - To change the main purple theme color, update the `blog-purple` and `blog-dark-purple` values

2. **Layout Customization**

   - Main layout components are in `src/components/Layout.tsx`
   - Header customization: `src/components/Header.tsx`
   - Footer customization: `src/components/Footer.tsx`
   - Sidebar customization: `src/components/Sidebar.tsx`

### Adding New Features

1. **Create new component files** in the `src/components` directory
2. **Add new pages** in the `src/pages` directory
3. **Update routes** in `src/App.tsx` if adding new pages

## Troubleshooting

### Common Issues

#### "Unable to connect to the blog server"

This message appears when the application cannot connect to the SQLite database via Netlify Functions. Possible solutions:

1. **Check Netlify Function logs:**
   - Go to Netlify dashboard > Your site > Functions
   - Check logs for any errors

2. **Verify deployment settings:**
   - Ensure `netlify.toml` is properly configured
   - Check that the function dependencies are installed

3. **Local development:**
   - For local development, the app will fall back to localStorage data

#### Admin Login Issues

If you cannot log in with admin credentials:

1. **Check browser console** for any errors
2. **Clear localStorage** using browser dev tools
3. **Reset to default credentials** by clearing localStorage
4. **Update credentials** through the Admin Settings page

## Tech Stack

- **Frontend:**
  - React
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Framer Motion for animations

- **Backend:**
  - Netlify Serverless Functions
  - SQLite database
  - JSON Server API layer

- **State Management:**
  - React Context API
  - Local storage for persistence and offline fallback

- **Authentication:**
  - Custom authentication system with localStorage persistence

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please open an issue on the GitHub repository.
