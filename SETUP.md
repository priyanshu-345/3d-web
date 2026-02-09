# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Setup MongoDB

You have two options:

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add it to `server/.env`

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/interior-designer`

### 3. Configure Environment Variables

Create `server/.env` file:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 4. Create Uploads Directory

```bash
cd server
mkdir uploads
```

### 5. Run the Application

**Option 1: Run Both Servers Together**
```bash
# From root directory
npm run dev
```

**Option 2: Run Separately**
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

### 6. Create Admin Account

After starting the server, create an admin account:

**Using curl:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'
```

**Using Postman or similar:**
- POST to `http://localhost:5000/api/auth/register`
- Body: `{"username":"admin","password":"yourpassword"}`

### 7. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Login**: http://localhost:5173/admin/login

## Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
- Change `PORT` in `server/.env`
- Change port in `client/vite.config.js`

### MongoDB Connection Error
- Check your MongoDB connection string
- Ensure MongoDB is running (if local)
- Check firewall settings (if Atlas)

### 3D Models Not Loading
- Ensure model files are `.glb` or `.gltf` format
- Check browser console for errors
- Verify model URL is accessible

### CORS Errors
- Ensure backend is running
- Check `server/index.js` CORS configuration
- Verify API URL in `client/src/utils/api.js`

## Next Steps

1. Login to admin panel
2. Upload your first 3D model (.glb file)
3. Upload a thumbnail image
4. View it in the gallery!

## File Formats

- **3D Models**: `.glb` or `.gltf` (recommended: `.glb`)
- **Thumbnails**: `.jpg`, `.png`, `.gif`, `.webp`

## Production Deployment

See `README.md` for deployment instructions to:
- Frontend: Netlify, Vercel, or similar
- Backend: Render, Railway, Heroku, or similar
- Database: MongoDB Atlas
- Storage: AWS S3, Cloudinary, or similar










