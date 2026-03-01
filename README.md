# 3D Interior Designer Website
A full-stack web application for showcasing 3D interior designs with an admin panel for managing 3D models.
## 🚀 Features

- **3D Model Viewer**: Interactive 3D interior designs using Three.js and React Three Fiber
- **Dynamic Gallery**: Browse and view multiple interior designs with filtering
- **Admin Panel**: Upload, manage, and delete 3D models
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Beautiful and intuitive user interface with Tailwind CSS
- **Authentication**: Secure admin login with JWT

## 📋 Tech Stack

### Frontend
- React 18
- Vite
- Three.js / React Three Fiber
- React Router
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Multer (File Upload)

## 🛠️ Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd "3d web"
```

2. Install all dependencies

For the root (if using concurrently):
```bash
npm install
```

For the client:
```bash
cd client
npm install
```

For the server:
```bash
cd server
npm install
```

3. Setup environment variables

Create `server/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

4. Create uploads directory
```bash
cd server
mkdir uploads
```

5. Run the application

Option 1: Run separately
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

Option 2: Using concurrently (if installed)
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
3d-interior-designer/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   └── utils/       # API utilities
│   └── package.json
├── server/             # Express backend
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   ├── uploads/        # Uploaded files
│   └── index.js
└── README.md
```

## 🎯 Project Phases

- ✅ Phase 1: Setup & Foundation
- ✅ Phase 2: Frontend Pages
- ✅ Phase 3: 3D Basics
- ✅ Phase 4: Pre-Uploaded Models
- ✅ Phase 5: Backend + Database
- ✅ Phase 6: Admin Authentication
- ✅ Phase 7: Admin Panel
- ✅ Phase 8: Frontend-Backend Integration
- ✅ Phase 9: Extra Features (Dark Mode, Pagination, Search, All 3D Scenes)
- ✅ Phase 10: Optimization (Lazy Loading, Code Splitting)
- ⏳ Phase 11: Deployment Ready
- ⏳ Phase 12: Documentation

## 🔐 Admin Setup

1. Start the server
2. Register an admin account by making a POST request to `/api/auth/register`:
```json
{
  "username": "admin",
  "password": "yourpassword"
}
```

Or use the login endpoint if you already have an account.

## 📝 API Endpoints

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register admin (for initial setup)

### Designs
- `GET /api/designs` - Get all designs (public)
- `GET /api/designs/:id` - Get single design (public)
- `POST /api/designs` - Create design (protected)
- `PUT /api/designs/:id` - Update design (protected)
- `DELETE /api/designs/:id` - Delete design (protected)

## 🎨 Usage

1. **View Designs**: Navigate to the Gallery page to see all available 3D designs
2. **View 3D Model**: Click on any design to open the interactive 3D viewer
3. **Admin Login**: Go to `/admin/login` to access the admin dashboard
4. **Upload Design**: Use the admin panel to upload new 3D models (.glb files) with thumbnails

## � Future Enhancements

- [ ] Model compression and optimization
- [ ] Cloud storage integration (AWS S3, Cloudinary)
- [ ] Email notifications
- [ ] Social sharing
- [ ] Multi-language support
- [ ] Comments/Reviews system

## 📝 License

MIT

## 👤 Author

Your Name

---

**Note**: Make sure to set up MongoDB Atlas or a local MongoDB instance before running the server.










