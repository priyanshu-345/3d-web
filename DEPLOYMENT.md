# Deployment Guide

## Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel

1. **Install Vercel CLI** (optional):
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
cd client
vercel
```

Or connect your GitHub repo to Vercel dashboard.

3. **Environment Variables**:
Add in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.com/api
```

### Option 2: Netlify

1. **Build the project**:
```bash
cd client
npm run build
```

2. **Deploy**:
- Drag and drop the `dist` folder to Netlify
- Or connect GitHub repo and set build command: `npm run build`
- Set publish directory: `dist`

3. **Environment Variables**:
Add in Netlify dashboard:
```
VITE_API_URL=https://your-backend-url.com/api
```

## Backend Deployment (Render/Railway)

### Option 1: Render

1. **Create Account**: Sign up at [render.com](https://render.com)

2. **Create Web Service**:
   - Connect your GitHub repo
   - Set root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`

3. **Environment Variables**:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

4. **Add Environment**:
   - Go to Environment tab
   - Add all variables

### Option 2: Railway

1. **Create Account**: Sign up at [railway.app](https://railway.app)

2. **New Project**:
   - Connect GitHub repo
   - Add service from repo
   - Set root directory: `server`

3. **Environment Variables**:
   - Add in Variables tab
   - Same as Render

### Option 3: Heroku

1. **Install Heroku CLI**:
```bash
npm install -g heroku
```

2. **Login**:
```bash
heroku login
```

3. **Create App**:
```bash
cd server
heroku create your-app-name
```

4. **Set Environment Variables**:
```bash
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
```

5. **Deploy**:
```bash
git push heroku main
```

## MongoDB Atlas Setup

1. **Create Account**: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create Cluster**: Free tier (M0)

3. **Database Access**:
   - Create database user
   - Set password

4. **Network Access**:
   - Add IP address: `0.0.0.0/0` (allow all) or your server IP

5. **Get Connection String**:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

## Cloud Storage for 3D Models

### Option 1: AWS S3

1. **Create S3 Bucket**

2. **Install AWS SDK**:
```bash
cd server
npm install aws-sdk
```

3. **Update upload route** to use S3 instead of local storage

### Option 2: Cloudinary

1. **Create Account**: [cloudinary.com](https://cloudinary.com)

2. **Install SDK**:
```bash
cd server
npm install cloudinary
```

3. **Update upload route** to use Cloudinary

### Option 3: Keep Local (Render/Railway)

- Use persistent disk storage
- Or keep using local uploads (files reset on restart)

## CORS Configuration

Update `server/index.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-url.com'],
  credentials: true
}));
```

## Final Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] MongoDB Atlas connected
- [ ] Environment variables set
- [ ] CORS configured
- [ ] File uploads working (S3/Cloudinary or local)
- [ ] Admin account created
- [ ] Test all features on live site

## Post-Deployment

1. **Update API URL** in frontend environment variables
2. **Test admin login**
3. **Upload a test 3D model**
4. **Test 3D viewer**
5. **Test booking form**
6. **Check mobile responsiveness**

## Troubleshooting

### CORS Errors
- Check CORS configuration in backend
- Verify frontend URL is in allowed origins

### File Upload Issues
- Check file size limits
- Verify storage configuration
- Check file permissions

### Database Connection
- Verify MongoDB URI is correct
- Check network access in MongoDB Atlas
- Verify credentials

### 3D Models Not Loading
- Check file URLs are accessible
- Verify CORS allows model file requests
- Check browser console for errors










