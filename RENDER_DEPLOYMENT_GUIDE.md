# 🚀 Render Deployment Guide with Docker

## ✅ Prerequisites Completed

- [x] Dockerfile created in `HealthConnect.Server/`
- [x] .dockerignore created
- [x] PostgreSQL support added to backend
- [x] Program.cs updated to support both SQL Server and PostgreSQL

---

## 📋 Step-by-Step Deployment

### Step 1: Commit and Push Your Changes

Open Git Bash or use VS Code's Git integration:

```bash
git add .
git commit -m "Add Docker support and PostgreSQL for Render deployment"
git push origin main
```

---

### Step 2: Create PostgreSQL Database on Render (2 minutes)

1. Go to **https://render.com**
2. Sign in with GitHub (if not already)
3. Click **"New +"** → **"PostgreSQL"**

**Configuration:**
- **Name:** `healthconnect-db`
- **Database:** `healthconnect`
- **User:** `healthconnect`
- **Region:** Choose closest to you:
  - Europe: `Frankfurt (eu-central)`
  - US: `Oregon (us-west)`
  - Asia: `Singapore (southeast-asia)`
- **PostgreSQL Version:** 16 (default)
- **Instance Type:** **Free**

4. Click **"Create Database"**
5. Wait ~1 minute for it to provision

**Get Connection String:**
1. Click on your new database
2. Scroll to **"Connections"** section
3. Copy the **"Internal Database URL"**
   - It looks like: `postgresql://healthconnect:XXXXX@dpg-XXXXX/healthconnect`
4. **Save this!** You'll need it in Step 3

---

### Step 3: Deploy Backend API with Docker (5 minutes)

1. Click **"New +"** → **"Web Service"**
2. Click **"Build and deploy from a Git repository"** → **"Next"**
3. If not connected, click **"Connect GitHub"** and authorize
4. Find and select your **"Madiba-HealthConnect"** repository
5. Click **"Connect"**

**Configure the Service:**

#### Basic Settings:
- **Name:** `healthconnect-api`
- **Region:** **Same as your database** (important for performance!)
- **Branch:** `main`
- **Root Directory:** `HealthConnect.Server`

#### Build Settings:
- **Runtime:** **Docker** ⬅️ **VERY IMPORTANT!**
- Render will auto-detect your Dockerfile

#### Instance Settings:
- **Instance Type:** **Free**

#### Environment Variables:

Scroll down to **"Environment Variables"** and click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `ConnectionStrings__DefaultConnection` | [Paste your PostgreSQL Internal URL from Step 2] |
| `Jwt__Key` | `YourSuperSecretKeyThatIsAtLeast32CharactersLong123456` |
| `Jwt__Issuer` | `HealthConnect.Server` |
| `Jwt__Audience` | `HealthConnect.Client` |
| `Email__SmtpHost` | `smtp.gmail.com` |
| `Email__SmtpPort` | `587` |
| `Email__SenderEmail` | `lesleyngcobo45@gmail.com` |
| `Email__SenderName` | `Madiba HealthConnect` |
| `Email__AdminEmail` | `s225171406@mandela.ac.za` |
| `Email__AppPassword` | `dzxputupergkqtqb` |
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `AllowedOrigins__0` | `https://your-app.vercel.app` |

**Note:** We'll update `AllowedOrigins__0` after deploying the frontend in Step 5.

6. Click **"Create Web Service"**

**Monitor Deployment:**
- Render will start building your Docker image
- This takes 3-5 minutes the first time
- Watch the logs for:
  ```
  ✓ Building Docker image
  ✓ Pushing to registry
  ✓ Starting service
  ✓ Your service is live 🎉
  ```

**Get Your API URL:**
- Once deployed, you'll see your URL at the top
- Format: `https://healthconnect-api.onrender.com`
- **Copy and save this URL!**

---

### Step 4: Run Database Migrations (2 minutes)

Your database needs the schema. You have two options:

#### Option A: Automatic (Recommended)

The backend will automatically run migrations on first startup because of the seeding code in `Program.cs`.

**Verify it worked:**
1. Go to your Render web service → **"Logs"** tab
2. Look for messages like:
   ```
   Database migration successful
   Roles seeded successfully
   Admin user created
   ```

#### Option B: Manual (If automatic fails)

1. Go to your **PostgreSQL database** on Render
2. Click **"Connect"** → Copy the **External Database URL**
3. Install **Azure Data Studio** or **pgAdmin**
4. Connect using the external URL
5. Run the SQL script from `HealthConnect.Server/azure-deploy-schema.sql`

---

### Step 5: Deploy Frontend to Vercel (5 minutes)

1. Go to **https://vercel.com**
2. Sign in with GitHub (if not already)
3. Click **"Add New..."** → **"Project"**
4. Find and click **"Import"** on your **Madiba-HealthConnect** repo

**Configure Build Settings:**

- **Framework Preset:** Angular (or Other)
- **Root Directory:** `healthconnect.client`
- **Build Command:**
  ```bash
  npm install && npm run build
  ```
- **Output Directory:**
  ```
  dist/healthconnect.client
  ```
- **Install Command:**
  ```bash
  npm install
  ```

**Environment Variables:**
- **Name:** `NODE_ENV`
- **Value:** `production`

5. Click **"Deploy"**

**Wait for deployment** (2-3 minutes)

**Get Your Frontend URL:**
- Once deployed, Vercel shows your URL
- Format: `https://madiba-healthconnect.vercel.app`
- **Copy this URL!**

---

### Step 6: Connect Frontend and Backend (2 minutes)

#### Update Frontend API URL:

1. In your local code, open:
   ```
   healthconnect.client/src/environments/environment.prod.ts
   ```

2. Update with your Render API URL:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://healthconnect-api.onrender.com/api'
     // Replace with YOUR actual Render URL from Step 3
   };
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "Update production API URL for Render"
   git push origin main
   ```

4. **Vercel automatically redeploys!** (takes 1-2 minutes)

#### Update Backend CORS:

1. Go to **Render Dashboard** → Your **healthconnect-api** service
2. Click **"Environment"** tab (left sidebar)
3. Find the variable `AllowedOrigins__0`
4. Click **"Edit"** (pencil icon)
5. Update value to your Vercel URL:
   ```
   https://madiba-healthconnect.vercel.app
   ```
   (Use YOUR actual Vercel URL from Step 5)
6. Click **"Save Changes"**
7. Render automatically redeploys! (takes 1-2 minutes)

---

### Step 7: Test Your Application! 🎉

1. **Open your Vercel URL** in a browser
2. **Register** a new student account
3. **Login** as the student
4. **Book an appointment**
5. **Check admin email** → Should receive notification
6. **Login as admin:**
   - Email: `admin@healthconnect.com`
   - Password: `Admin@123`
7. **Assign a nurse** to the appointment
8. **Check student email** → Should receive assignment notification
9. **Login as nurse** (use one of the nurses you created)
10. **Mark consultation complete**
11. **Check student email** → Should receive completion notification

---

## 🐛 Troubleshooting

### Backend Won't Start?

**Check Render Logs:**
1. Render Dashboard → Your service → **"Logs"** tab
2. Look for error messages

**Common Issues:**
- **Database connection failed:** Check `ConnectionStrings__DefaultConnection` is correct
- **Port binding error:** Render automatically sets `PORT` variable, your Dockerfile uses 8080
- **Missing environment variables:** Double-check all variables are set

### CORS Errors?

1. Verify `AllowedOrigins__0` in Render **exactly** matches your Vercel URL
2. No trailing slash in URLs
3. Must include `https://`
4. After changing, wait for Render to redeploy (check Logs tab)

### Database Migration Failed?

**Manual Migration:**
1. Go to Render → Your PostgreSQL database
2. Click **"Connect"** → Get external URL
3. Use Azure Data Studio or pgAdmin to connect
4. Run the SQL script manually

### Frontend Can't Reach API?

1. Check `environment.prod.ts` has correct Render URL
2. Verify Render service is running (green dot)
3. Test API directly in browser:
   ```
   https://healthconnect-api.onrender.com/api/auth/login
   ```
   Should return 401 or similar (means API is working)

### Free Tier Limitations:

**Render Free Tier:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds (cold start)
- This is normal! Just wait for it to wake up

**Solution for cold starts:**
- Upgrade to paid tier ($7/month) for always-on
- Or accept the 30-second delay on first load

---

## 💰 Cost Breakdown

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| **Render Web Service** | Free | $0 | 750 hours/month |
| **Render PostgreSQL** | Free | $0 | 90 days, then $7/month |
| **Vercel Frontend** | Free | $0 | Forever for personal projects |
| **Total** | | **$0** | For first 90 days! |

**After 90 days:**
- PostgreSQL: $7/month
- Or create a new free database (another 90 days)
- Or upgrade to paid tier

---

## 🎯 Your Deployment URLs

**Fill these in after deployment:**

- **Frontend (Vercel):** `https://_________________.vercel.app`
- **Backend (Render):** `https://_________________.onrender.com`
- **Database (Render):** Internal URL (in environment variables)

---

## 🚀 Next Steps

### Custom Domain (Optional):
- **Vercel:** Settings → Domains → Add your domain
- **Render:** Settings → Custom Domain → Add your domain

### Monitoring:
- **Render:** Built-in metrics and logs in dashboard
- **Vercel:** Analytics tab for frontend performance

### Automatic Deployments:
- **Both platforms** auto-deploy when you push to GitHub!
- No manual deployment needed after initial setup
- Just `git push` and both update automatically

---

## ✅ Deployment Checklist

- [ ] PostgreSQL database created on Render
- [ ] Backend deployed to Render with Docker
- [ ] All environment variables configured
- [ ] Database migrations ran successfully
- [ ] Frontend deployed to Vercel
- [ ] Frontend API URL updated
- [ ] Backend CORS configured
- [ ] Full application tested end-to-end
- [ ] Email notifications working

---

## 🎉 Success!

Your Madiba HealthConnect application is now live and accessible worldwide!

**Share your links:**
- Students can access: Your Vercel URL
- Admin and nurses can login at the same URL
- All data is stored securely in PostgreSQL

---

## 📞 Support

**Render Issues:**
- Docs: https://render.com/docs
- Community: https://community.render.com

**Vercel Issues:**
- Docs: https://vercel.com/docs
- Support: Built-in chat in dashboard

**Need help?** Check the logs first - they're very detailed and usually point to the exact issue!

---

**Congratulations on deploying your application! 🎉🚀**


