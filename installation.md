# Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** (for cloud database) - [Sign up here](https://www.mongodb.com/cloud/atlas)

---

### STEP 1: Install Node.js and Dependencies

#### Update system

`sudo apt update && sudo apt upgrade -y`

#### Install Node.js 20.x

```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

#### Verify installation

```
node --version
npm --version
```

#### Install PM2 (process manager)

`sudo npm install -g pm2`

#### Install Git

`sudo apt install git -y`

#### Install Nginx

`sudo apt install nginx -y`

### STEP 2: Clone Repository and Setup Backend

- **Clone repository**

```
cd ~
git clone https://github.com/uzer-ab/bx-blogs.git
```

- **Navigate to backend**
  `cd bx-blogs/backend`

- **Install dependencies**
  `npm install`

- **Create environment file:** `nano .env`

#### Paste this

```
PORT=1234
MONGO_URI=mongodb+srv://bloghub_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bloghub?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_random_jwt_secret_key_min_32_characters_12345
JWT_EXPIRES_IN=2h
NODE_ENV=production
```

#### Start backend with PM2:

```
#Start the application**
pm2 start index.js --name bloghub-api

#Configure PM2 to start on boot
pm2 startup
# Copy and run the command it shows (starts with sudo)

# Save PM2 configuration
pm2 save

# Check statua
pm2 status

# View logs (Ctrl+C to exit)
pm2 logs bloghub-api
```

### STEP 3: Configure Nginx

```
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/bloghub
```

##### Paste this configuration:

```
server {
    listen 80;
    server_name uzzair.online www.uzzair.online;

    location /api/ {
        proxy_pass http://localhost:1234;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/bloghub;
        try_files $uri $uri/ /index.html;
    }
}

```

##### Enable the site:

```
# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Enable bloghub site
sudo ln -s /etc/nginx/sites-available/bloghub /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### STEP 4: Setup SSL Certificate

```
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d uzzair.online -d www.uzzair.online
```

### STEP 5: Build and Deploy Frontend

**On Your LOCAL Machine (not EC2):**

```
# Navigate to client directory
cd /path/to/your/local/bx-blogs/client

# Create production environment file
nano .env.production
```

**Paste this:**

```
API_URL=https://uzzair.online/api/v1
MODE="development"
```

**Install dependencies and build:**

```
# Install dependencies (if not already done)
npm install

# Build for production
npm run build
```

**Upload to EC2:**

```
# Upload dist folder (replace with your key and IP)
scp -i /path/to/YOUR_KEY_FILE.pem -r dist ubuntu@YOUR_ELASTIC_IP:/tmp/bloghub-dist

# Example:
# scp -i ~/Downloads/aws-key.pem -r dist ubuntu@54.123.45.67:/tmp/bloghub-dist
```

### STEP 6: Deploy Frontend on EC2

```
# Create web directory
sudo mkdir -p /var/www/bloghub

# Copy files
sudo cp -r /tmp/bloghub-dist/* /var/www/bloghub/

# Set permissions
sudo chown -R www-data:www-data /var/www/bloghub
sudo chmod -R 755 /var/www/bloghub

# Verify files
ls -la /var/www/bloghub

# Restart Nginx
sudo systemctl restart nginx
```

## 🎉 You're Done!

Your application is now deployed at:

- **Frontend**: https://uzzair.online
- **Backend API**: https://uzzair.online/api/v1

---

### Common Commands for Future Reference

```
# SSH into EC2
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP

# Check backend status
pm2 status
pm2 logs bloghub-api

# Restart backend
pm2 restart bloghub-api

# Check Nginx status
sudo systemctl status nginx
sudo nginx -t

# View Nginx logs
sudo tail -f /var/log/nginx/error.log

# Update backend code
cd ~/bx-blogs/backend
git pull
npm install
pm2 restart bloghub-api

# Update frontend (on local machine)
cd client
npm run build
scp -i your-key.pem -r dist ubuntu@YOUR_ELASTIC_IP:/tmp/bloghub-dist

# Deploy updated frontend (on EC2)
sudo rm -rf /var/www/bloghub/*
sudo cp -r /tmp/bloghub-dist/* /var/www/bloghub/
sudo systemctl restart nginx
```
