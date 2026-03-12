# SR Property Advisors - MERN Stack Real Estate Application

A premium, modern Real Estate Management and CRM platform built using the MERN stack (MongoDB, Express.js, React, Node.js). 

This application provides a comprehensive suite of tools for real estate agencies to manage their property portfolios, plot inventories, customer leads, and file assets.

## Features

### Public Facing
*   **Vibrant Landing Page**: High-end aesthetic with glassmorphism, modern typography, and responsive layouts.
*   **Property Browse & Filter**: Comprehensive property listing with advanced search and map view options.
*   **Property Detail Views**: High-resolution image galleries, layout plans, and built-in lead generation natively connecting to the CRM.

### Admin Dashboard (CRM & ERP)
*   **Project Management**: Track entire building phases, upload brochures, set coordinates, and manage global status.
*   **Plot Inventory Manager**: A dynamic visual grid + list view system to manage individual plots/units within a project (Available, Booked, Sold).
*   **Leads CRM Pipeline**: Process incoming inquiries, manage agent assignments, track internal conversation timelines, and update statuses fluidly.
*   **Locations Manager**: Dynamically manage active operating regions synced across the platform.
*   **File Explorer**: Integrated Google-Drive style file system to manage HD interior/exterior renders and legal PDF documents per project.

## Tech Stack

**Frontend:**
*   React 19 (Vite)
*   Tailwind CSS (v4)
*   React Router DOM
*   Axios
*   React Icons

**Backend:**
*   Node.js & Express.js
*   MongoDB Atlas (Mongoose)
*   JWT Authentication
*   Bcryptjs (Password Hashing)
*   Cloudinary (Image/Asset Storage)
*   Security: Helmet, CORS, Express-Rate-Limit

## Getting Started (Local Development)

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas Account
*   Cloudinary Account

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/your-username/sr-property-advisors.git
cd sr-property-advisors
\`\`\`

### 2. Backend Setup
1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a \`.env\` file in the `backend/` root and configure the following variables:
   \`\`\`env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:5173
   
   MONGODB_URI=your_mongodb_cluster_string
   
   JWT_SECRET=your_secret_string
   JWT_EXPIRE=30d
   
   CLOUDINARY_NAME=your_cloud_name
   CLOUDINARY_KEY=your_api_key
   CLOUDINARY_SECRET=your_api_secret
   \`\`\`
4. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
   *(The backend API will run on `http://localhost:5000`)*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a \`.env\` file in the `frontend/` root:
   \`\`\`env
   VITE_API_URL=http://localhost:5000/api
   VITE_WHATSAPP_NUMBER=1234567890
   \`\`\`
4. Start the frontend Vite server:
   \`\`\`bash
   npm run dev
   \`\`\`
   *(The application will be accessible at `http://localhost:5173`)*

## Deployment

The application is structured for split deployment:
*   **Frontend**: Native compatibility with Vercel (see `./vercel.json`).
*   **Backend**: Native compatibility with Render (see `./render.yaml`).

> *For complete deployment instructions, see `deployment_guide.md`.*

## License
MIT License - Copyright (c) 2026 SR Property Advisors
