# Azure Deployment Guide for Madiba HealthConnect

## Overview
This guide will walk you through deploying Madiba HealthConnect to Microsoft Azure using your student account.

## Prerequisites Completed ✅
- [x] Production configuration files created
- [x] CORS configured for Azure
- [x] Environment files for Angular configured
- [x] Services updated to use environment-based URLs

## What You'll Need
- Azure for Students account ($100 credit)
- Visual Studio 2022 (or Azure CLI)
- Your GitHub repository (for Static Web App deployment)

---

## Phase 2: Create Azure Resources

### Step 1: Create Azure SQL Database

1. **Go to Azure Portal**: https://portal.azure.com
2. **Click "Create a resource"** → Search for "SQL Database"
3. **Click "Create"**

#### Database Configuration:
- **Resource Group**: Create new → `rg-healthconnect`
- **Database Name**: `healthconnect-db`
- **Server**: Create new
  - **Server name**: `healthconnect-sql-server` (must be globally unique, add your initials if taken)
  - **Location**: Choose closest region (e.g., `South Africa North`)
  - **Authentication**: SQL Authentication
  - **Server admin login**: `healthadmin`
  - **Password**: Create a strong password (save this!)
  
- **Compute + Storage**: Click "Configure database"
  - **Service tier**: Basic (2GB, $5/month) - Recommended
  - OR DTU-based → Basic (2GB)
  
- **Backup storage redundancy**: `Locally-redundant backup storage`
- **Click "Review + Create"** → **Create**

#### Configure Firewall Rules:
1. Go to your SQL Server (not the database)
2. Click **"Networking"** (left menu)
3. **Firewall rules**:
   - Check: ✅ "Allow Azure services and resources to access this server"
   - Add your current IP address (click "Add client IP")
4. Click **"Save"**

#### Get Connection String:
1. Go to your database → **"Connection strings"**
2. Copy the **ADO.NET** connection string
3. Replace `{your_password}` with your actual password
4. Save this for later!

**Example Connection String:**
```
Server=tcp:healthconnect-sql-server.database.windows.net,1433;Initial Catalog=healthconnect-db;Persist Security Info=False;User ID=healthadmin;Password=YOUR_PASSWORD;MultipleActiveResultSets=True;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

---

### Step 2: Create App Service for Backend API

1. **Go to Azure Portal** → **"Create a resource"** → Search for "Web App"
2. **Click "Create"**

#### App Service Configuration:
- **Resource Group**: Select `rg-healthconnect`
- **Name**: `healthconnect-api` (must be globally unique, add your initials if taken)
  - This will be your API URL: `https://healthconnect-api.azurewebsites.net`
- **Publish**: `Code`
- **Runtime stack**: `.NET 8 (LTS)`
- **Operating System**: `Windows` (or Linux)
- **Region**: Same as your SQL Server (e.g., `South Africa North`)

#### App Service Plan:
- **Pricing plan**: 
  - For testing: `Free F1` (0 cost, limited performance)
  - Recommended: `Basic B1` (~$13/month, better performance)
  
- **Click "Review + Create"** → **Create**

#### Configure App Settings:
1. Go to your App Service → **"Configuration"** (left menu under Settings)
2. Click **"Connection strings"** tab
3. **Add connection string**:
   - **Name**: `DefaultConnection`
   - **Value**: Paste your SQL connection string from Step 1
   - **Type**: `SQLAzure`
   - Click **"OK"**

4. Click **"Application settings"** tab
5. **Add these settings** (click "+ New application setting" for each):

   | Name | Value |
   |------|-------|
   | `Jwt__Key` | `Generate-A-Strong-Random-Key-At-Least-32-Characters-Long` |
   | `Jwt__Issuer` | `HealthConnect.Server` |
   | `Jwt__Audience` | `HealthConnect.Client` |
   | `Email__SmtpHost` | `smtp.gmail.com` |
   | `Email__SmtpPort` | `587` |
   | `Email__SenderEmail` | `lesleyngcobo45@gmail.com` |
   | `Email__SenderName` | `Madiba HealthConnect` |
   | `Email__AdminEmail` | `s225171406@mandela.ac.za` |
   | `Email__AppPassword` | `dzxputupergkqtqb` |
   | `AllowedOrigins__0` | `https://YOUR-STATIC-WEB-APP-URL` (add after creating frontend) |

6. Click **"Save"** at the top

---

### Step 3: Create Static Web App for Frontend

1. **Go to Azure Portal** → **"Create a resource"** → Search for "Static Web App"
2. **Click "Create"**

#### Static Web App Configuration:
- **Resource Group**: Select `rg-healthconnect`
- **Name**: `healthconnect-frontend`
- **Plan type**: `Free`
- **Region**: Choose closest (e.g., `West Europe` or `East Asia`)
- **Source**: `GitHub`
  - Click **"Sign in with GitHub"**
  - **Organization**: Your GitHub username
  - **Repository**: Select your HealthConnect repository
  - **Branch**: `main` (or `master`)

#### Build Configuration:
- **Build Presets**: `Angular`
- **App location**: `/healthconnect.client`
- **Api location**: Leave empty
- **Output location**: `dist/healthconnect.client`

- **Click "Review + Create"** → **Create**

#### Get Static Web App URL:
1. Go to your Static Web App resource
2. Copy the **URL** (e.g., `https://happy-rock-1234567.azurestaticapps.net`)
3. **Save this URL**

#### Update Backend CORS:
1. Go back to your **App Service** (backend)
2. Go to **"Configuration"** → **"Application settings"**
3. Update `AllowedOrigins__0` with your Static Web App URL
4. Click **"Save"**

#### Update Frontend API URL:
1. In your local code, open `healthconnect.client/src/environments/environment.prod.ts`
2. Update the `apiUrl`:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://healthconnect-api.azurewebsites.net/api'
   };
   ```
3. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Update production API URL"
   git push
   ```

---

## Phase 3: Deploy Database Schema

### Generate SQL Script from Migrations

**Option A: Using PowerShell/Terminal:**
```powershell
cd HealthConnect.Server
dotnet ef migrations script -o deploy-schema.sql
```

**Option B: Using Package Manager Console in Visual Studio:**
```powershell
Script-Migration -Output deploy-schema.sql
```

This creates a `deploy-schema.sql` file with all your migrations.

### Deploy to Azure SQL Database

1. **Install Azure Data Studio** (if you don't have it): https://aka.ms/azuredatastudio
2. **Open Azure Data Studio**
3. **Connect to Azure SQL**:
   - Click "New Connection"
   - **Server**: `healthconnect-sql-server.database.windows.net`
   - **Authentication type**: `SQL Login`
   - **User name**: `healthadmin`
   - **Password**: Your SQL password
   - **Database**: `healthconnect-db`
   - Click **"Connect"**

4. **Open** the `deploy-schema.sql` file
5. **Click "Run"** to execute the script
6. **Verify**: Check that tables were created:
   ```sql
   SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;
   ```

The database will automatically seed roles and the admin user when the backend first runs.

---

## Phase 4: Deploy Backend API

### Using Visual Studio (Easiest):

1. **Right-click** on `HealthConnect.Server` project
2. **Click "Publish..."**
3. **Target**: `Azure`
4. **Specific target**: `Azure App Service (Windows)` or `(Linux)`
5. **Select** your `healthconnect-api` App Service
6. **Click "Finish"** → **"Publish"**

Visual Studio will build and deploy your application.

### Using Azure CLI (Alternative):

```bash
cd HealthConnect.Server
dotnet publish -c Release
cd bin/Release/net8.0/publish
az webapp deployment source config-zip --src publish.zip --resource-group rg-healthconnect --name healthconnect-api
```

### Verify Deployment:

1. Go to your App Service URL: `https://healthconnect-api.azurewebsites.net`
2. You should see a basic page or 404 (expected, no home route)
3. Test the API: `https://healthconnect-api.azurewebsites.net/api/auth/login`
   - Should return a 401 Unauthorized or similar (means API is working)

---

## Phase 5: Deploy Frontend

The frontend deploys **automatically** via GitHub Actions when you push to the repository!

### Monitor Deployment:

1. Go to your **GitHub repository** → **"Actions"** tab
2. You should see a workflow running (triggered by your earlier commit)
3. Wait for it to complete (takes 2-5 minutes)

### Update Configuration (if needed):

If you need to make changes to the build configuration:

1. Go to your Static Web App in Azure Portal
2. Click **"Configuration"** → **"Application settings"**
3. You can add environment variables here if needed

---

## Phase 6: Final Testing

### Test the Application:

1. **Open your Static Web App URL**: `https://happy-rock-1234567.azurestaticapps.net`
2. **Register a new student account**
3. **Login as student** → Book an appointment
4. **Check admin email** → Should receive notification
5. **Login as admin** (credentials from seeding)
6. **Assign nurse** to the appointment
7. **Check student email** → Should receive assignment notification
8. **Login as nurse** → Mark consultation complete
9. **Check student email** → Should receive completion notification

### Common Issues:

#### CORS Errors:
- Verify `AllowedOrigins__0` in App Service settings matches your Static Web App URL exactly
- Restart the App Service after changing settings

#### Database Connection Errors:
- Check SQL Server firewall allows Azure services
- Verify connection string is correct in App Service Configuration
- Check SQL Server admin password

#### Email Not Working:
- Verify all `Email__*` settings in App Service Configuration
- Check Gmail app password is correct
- Review App Service logs for errors

#### 500 Errors:
- Check App Service logs: Go to App Service → "Log stream"
- Look for specific error messages

---

## Cost Monitoring

### Check Your Spending:

1. Go to Azure Portal → **"Cost Management + Billing"**
2. **"Cost analysis"** → View your spending
3. Set up **budget alerts** to avoid surprises

### Expected Costs (with student credit):

- **Static Web App**: FREE
- **App Service Basic B1**: ~$13/month
- **SQL Database Basic**: ~$5/month
- **Total**: ~$18/month (covered by your $100 credit for 5+ months)

### Free Tier Option:

- **Static Web App**: FREE
- **App Service Free F1**: FREE (slower, limited)
- **SQL Database Free**: NOT AVAILABLE (minimum $5/month)
- **Total**: ~$5/month

---

## Next Steps

1. Set up custom domain (optional)
2. Enable Application Insights for monitoring
3. Set up automated backups for database
4. Configure CI/CD for backend (GitHub Actions)
5. Add SSL certificate (automatic with Static Web Apps)

## Support Resources

- Azure Documentation: https://docs.microsoft.com/azure
- Azure for Students: https://azure.microsoft.com/free/students/
- ASP.NET Core Deployment: https://docs.microsoft.com/aspnet/core/host-and-deploy/azure-apps/

---

## Troubleshooting

If you encounter issues during deployment, check:
1. Azure Portal logs
2. Browser console for frontend errors
3. App Service log stream for backend errors
4. Network tab for API request/response details

Need help? The error messages in Azure logs are usually very descriptive!

