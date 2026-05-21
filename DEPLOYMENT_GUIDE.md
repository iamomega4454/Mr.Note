# 🚀 Mr.Note Deployment Guide

Complete guide to deploying your Mr.Note application to production.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:
- [ ] MongoDB database is set up (local or cloud)
- [ ] Environment variables are configured
- [ ] Frontend build works locally (`npm run build`)
- [ ] Backend runs without errors
- [ ] All dependencies are in package.json
- [ ] .gitignore includes sensitive files

---

## 🎯 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) [RECOMMENDED]
**Best for:** Quick deployment, free tier available
**Difficulty:** Easy

### Option 2: Netlify (Frontend) + Render (Backend)
**Best for:** Alternative to Vercel, generous free tier
**Difficulty:** Easy

### Option 3: AWS (Full Stack)
**Best for:** Production-grade, scalable
**Difficulty:** Advanced

### Option 4: DigitalOcean/Linode VPS
**Best for:** Full control, cost-effective
**Difficulty:** Intermediate

---

## 🌐 Option 1: Vercel + Railway (Recommended)

### Part A: Deploy Backend to Railway

#### Step 1: Set up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/notevault?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password

#### Step 2: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Mr.Note repository
5. Railway will auto-detect Node.js

#### Step 3: Configure Railway

1. Click on your service
2. Go to "Variables" tab
3. Add environment variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/notevault
   CLIENT_URL=https://your-frontend-url.vercel.app
   OWNER_PIN=123456
   NODE_ENV=production
   ```

#### Step 4: Set Root Directory

1. Go to "Settings" tab
2. Set "Root Directory" to `server`
3. Set "Start Command" to `npm start`

#### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Copy your Railway URL (e.g., `https://your-app.railway.app`)

### Part B: Deploy Frontend to Vercel

#### Step 1: Update API URL

1. Create `client/.env.production`:
   ```env
   VITE_API_URL=https://your-app.railway.app/api
   ```

2. Update `client/src/utils/api.js`:
   ```javascript
   import axios from "axios";

   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
     headers: {
       "Content-Type": "application/json",
     },
   });

   export default api;
   ```

#### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your Mr.Note repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### Step 3: Add Environment Variables

1. In Vercel project settings
2. Go to "Environment Variables"
3. Add:
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your app is live at `https://your-app.vercel.app`

#### Step 5: Update Backend CORS

1. Go back to Railway
2. Update `CLIENT_URL` variable:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Redeploy backend

---

## 🎨 Option 2: Netlify + Render

### Part A: Deploy Backend to Render

#### Step 1: Set up MongoDB Atlas
(Same as Option 1, Step 1)

#### Step 2: Deploy to Render

1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name:** mr-note-api
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

#### Step 3: Add Environment Variables

```
PORT=5000
MONGO_URI=mongodb+srv://...
CLIENT_URL=https://your-app.netlify.app
OWNER_PIN=123456
NODE_ENV=production
```

#### Step 4: Deploy
- Click "Create Web Service"
- Copy your Render URL

### Part B: Deploy Frontend to Netlify

#### Step 1: Update API URL
(Same as Option 1, Part B, Step 1)

#### Step 2: Create netlify.toml

Create `client/netlify.toml`:
```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 3: Deploy to Netlify

1. Go to [Netlify](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`

#### Step 4: Add Environment Variables

1. Go to "Site settings" → "Environment variables"
2. Add:
   ```
   VITE_API_URL=https://your-app.onrender.com/api
   ```

#### Step 5: Deploy
- Click "Deploy site"
- Update Render's `CLIENT_URL` with your Netlify URL

---

## ☁️ Option 3: AWS (Production-Grade)

### Architecture
```
CloudFront (CDN)
    ↓
S3 (Frontend Static Files)

Route53 (DNS)
    ↓
ALB (Load Balancer)
    ↓
EC2/ECS (Backend)
    ↓
DocumentDB/MongoDB Atlas
    ↓
S3 (File Storage)
```

### Step 1: Frontend (S3 + CloudFront)

1. **Build Frontend:**
   ```bash
   cd client
   npm run build
   ```

2. **Create S3 Bucket:**
   ```bash
   aws s3 mb s3://mr-note-frontend
   aws s3 website s3://mr-note-frontend --index-document index.html
   ```

3. **Upload Build:**
   ```bash
   aws s3 sync dist/ s3://mr-note-frontend
   ```

4. **Create CloudFront Distribution:**
   - Origin: S3 bucket
   - Default root object: index.html
   - Enable HTTPS

### Step 2: Backend (EC2 or ECS)

#### Option A: EC2

1. **Launch EC2 Instance:**
   - AMI: Ubuntu 22.04
   - Instance type: t2.micro (free tier)
   - Security group: Allow 80, 443, 22

2. **SSH into instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

4. **Clone and setup:**
   ```bash
   git clone https://github.com/yourusername/Mr.Note.git
   cd Mr.Note/server
   npm install
   ```

5. **Create .env:**
   ```bash
   nano .env
   # Add your environment variables
   ```

6. **Start with PM2:**
   ```bash
   pm2 start server.js --name mr-note-api
   pm2 startup
   pm2 save
   ```

7. **Setup Nginx:**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/mr-note
   ```

   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo ln -s /etc/nginx/sites-available/mr-note /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **Setup SSL (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

#### Option B: ECS (Docker)

1. **Create Dockerfile** in `server/`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Build and push to ECR:**
   ```bash
   aws ecr create-repository --repository-name mr-note-api
   docker build -t mr-note-api .
   docker tag mr-note-api:latest <account-id>.dkr.ecr.region.amazonaws.com/mr-note-api:latest
   docker push <account-id>.dkr.ecr.region.amazonaws.com/mr-note-api:latest
   ```

3. **Create ECS Task Definition and Service**

### Step 3: Database (DocumentDB or MongoDB Atlas)

**Option A: MongoDB Atlas** (Recommended)
- Use MongoDB Atlas as described in Option 1

**Option B: AWS DocumentDB**
```bash
aws docdb create-db-cluster \
  --db-cluster-identifier mr-note-cluster \
  --engine docdb \
  --master-username admin \
  --master-user-password YourPassword123
```

### Step 4: File Storage (S3)

1. **Create S3 bucket for uploads:**
   ```bash
   aws s3 mb s3://mr-note-uploads
   ```

2. **Update backend to use S3:**
   - Install AWS SDK: `npm install @aws-sdk/client-s3`
   - Modify file upload logic to use S3 instead of local storage

---

## 🖥️ Option 4: VPS (DigitalOcean/Linode)

### Step 1: Create Droplet/Linode

1. Choose Ubuntu 22.04
2. Select plan (Basic $6/month)
3. Add SSH key
4. Create

### Step 2: Initial Server Setup

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Create non-root user
adduser mrnode
usermod -aG sudo mrnode
su - mrnode

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

### Step 3: Deploy Backend

```bash
# Clone repository
git clone https://github.com/yourusername/Mr.Note.git
cd Mr.Note/server

# Install dependencies
npm install

# Create .env
nano .env
# Add your environment variables

# Start with PM2
pm2 start server.js --name mr-note-api
pm2 startup
pm2 save
```

### Step 4: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/mr-note
```

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/mr-note/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mr-note /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Deploy Frontend

```bash
# Build frontend locally
cd client
npm run build

# Upload to server
scp -r dist/* mrnode@your-server-ip:/var/www/mr-note/client/dist/
```

### Step 6: Setup SSL

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

### Step 7: Setup Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 🔒 Production Security Checklist

### Environment Variables
- [ ] Never commit .env files
- [ ] Use strong OWNER_PIN (12+ characters)
- [ ] Use secure MongoDB password
- [ ] Set NODE_ENV=production

### HTTPS/SSL
- [ ] Enable HTTPS on all domains
- [ ] Use Let's Encrypt or CloudFlare SSL
- [ ] Redirect HTTP to HTTPS
- [ ] Set secure cookie flags

### Database
- [ ] Enable MongoDB authentication
- [ ] Whitelist IP addresses
- [ ] Regular backups
- [ ] Use connection pooling

### Backend
- [ ] Enable rate limiting
- [ ] Add helmet.js for security headers
- [ ] Validate all inputs
- [ ] Sanitize file uploads
- [ ] Set file size limits
- [ ] Enable CORS only for your domain

### Frontend
- [ ] Minify and compress assets
- [ ] Enable CDN
- [ ] Set cache headers
- [ ] Remove console.logs

---

## 📊 Monitoring & Maintenance

### Monitoring Tools

1. **Backend Monitoring:**
   - PM2 monitoring: `pm2 monit`
   - Logs: `pm2 logs mr-note-api`
   - New Relic (free tier)
   - Sentry for error tracking

2. **Frontend Monitoring:**
   - Vercel Analytics (built-in)
   - Google Analytics
   - Sentry for error tracking

3. **Database Monitoring:**
   - MongoDB Atlas monitoring (built-in)
   - Set up alerts for high CPU/memory

### Backup Strategy

```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb+srv://..." --out=/backups/mr-note-$DATE
aws s3 sync /backups/ s3://mr-note-backups/
```

### Update Strategy

```bash
# Backend updates
cd Mr.Note/server
git pull origin main
npm install
pm2 restart mr-note-api

# Frontend updates
cd ../client
npm install
npm run build
# Upload to S3/Vercel or sync to server
```

---

## 🚀 CI/CD Setup (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Mr.Note

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: mr-note-api

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./client
```

---

## 🌍 Custom Domain Setup

### For Vercel (Frontend)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain (e.g., `mrnote.com`)
4. Update DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

### For Railway (Backend)

1. Go to Railway project settings
2. Click "Settings" → "Domains"
3. Add custom domain (e.g., `api.mrnote.com`)
4. Update DNS:
   ```
   Type: CNAME
   Name: api
   Value: your-app.railway.app
   ```

---

## 💰 Cost Estimation

### Free Tier (Hobby Projects)
- **Frontend:** Vercel/Netlify (Free)
- **Backend:** Railway/Render (Free tier: 500 hours/month)
- **Database:** MongoDB Atlas (Free: 512MB)
- **Total:** $0/month

### Small Production
- **Frontend:** Vercel Pro ($20/month)
- **Backend:** Railway Hobby ($5/month)
- **Database:** MongoDB Atlas M10 ($57/month)
- **Total:** ~$82/month

### Medium Production
- **Frontend:** Vercel Pro + CDN ($20/month)
- **Backend:** Railway Pro ($20/month)
- **Database:** MongoDB Atlas M20 ($115/month)
- **File Storage:** AWS S3 (~$5/month)
- **Total:** ~$160/month

---

## 🐛 Common Deployment Issues

### Issue 1: CORS Errors
**Solution:** Update `CLIENT_URL` in backend .env to match frontend URL

### Issue 2: MongoDB Connection Failed
**Solution:** 
- Check connection string
- Whitelist IP address in MongoDB Atlas
- Verify username/password

### Issue 3: File Upload Not Working
**Solution:**
- Check file size limits
- Verify uploads directory exists
- Check disk space on server

### Issue 4: Build Fails
**Solution:**
- Check Node.js version compatibility
- Clear node_modules and reinstall
- Check for missing dependencies

### Issue 5: 404 on Refresh
**Solution:** Configure SPA routing:
- Vercel: Add `vercel.json` with rewrites
- Netlify: Add `_redirects` file
- Nginx: Use `try_files`

---

## ✅ Post-Deployment Checklist

- [ ] Test all features in production
- [ ] Verify file uploads work
- [ ] Test folder creation/deletion
- [ ] Verify search functionality
- [ ] Check mobile responsiveness
- [ ] Test with different browsers
- [ ] Verify SSL certificate
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Document deployment process
- [ ] Share production URL

---

## 📞 Support & Resources

### Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Nginx Docs](https://nginx.org/en/docs/)

### Community
- [Stack Overflow](https://stackoverflow.com)
- [Dev.to](https://dev.to)
- [Reddit r/webdev](https://reddit.com/r/webdev)

---

## 🎉 Congratulations!

Your Mr.Note application is now deployed and accessible to the world! 🚀

**Next Steps:**
1. Share your production URL
2. Gather user feedback
3. Monitor performance
4. Plan new features
5. Keep dependencies updated

---

**Need help?** Check the troubleshooting section or reach out to the community!
