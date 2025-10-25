# Azure Deployment Checklist

## ✅ Phase 1: Preparation (COMPLETED)

- [x] Created `appsettings.Production.json`
- [x] Configured CORS in `Program.cs`
- [x] Created `environment.prod.ts` for Angular
- [x] Updated all services to use environment-based URLs
- [x] Generated SQL deployment script: `azure-deploy-schema.sql`

---

## 🚀 Phase 2: Create Azure Resources (DO THIS NOW)

### 1. Create Azure SQL Database
**Portal**: https://portal.azure.com → Create Resource → SQL Database

**Configuration:**
- Resource Group: `rg-healthconnect` (create new)
- Database Name: `healthconnect-db`
- Server: Create new
  - Server name: `healthconnect-sql-server-[YOUR-INITIALS]`
  - Location: `South Africa North`
  - Admin: `healthadmin`
  - Password: **[Create strong password and save it!]**
- Tier: **Basic (2GB)** - $5/month
- Firewall: Allow Azure services ✅

**Save for later:**
- [ ] Connection string
- [ ] Server name
- [ ] Admin password

---

### 2. Create App Service (Backend API)
**Portal**: Create Resource → Web App

**Configuration:**
- Resource Group: `rg-healthconnect`
- Name: `healthconnect-api-[YOUR-INITIALS]`
- Runtime: `.NET 8 (LTS)`
- Region: `South Africa North`
- Plan: **Basic B1** (recommended) or Free F1

**Your API URL will be:**
```
https://healthconnect-api-[YOUR-INITIALS].azurewebsites.net
```

**Save this URL:** _______________________________________

---

### 3. Create Static Web App (Frontend)
**Portal**: Create Resource → Static Web App

**Configuration:**
- Resource Group: `rg-healthconnect`
- Name: `healthconnect-frontend`
- Plan: **Free**
- Source: **GitHub**
- Repository: Your HealthConnect repo
- Branch: `main`
- Build preset: **Angular**
- App location: `/healthconnect.client`
- Output location: `dist/healthconnect.client`

**Your Frontend URL will be:**
```
https://[auto-generated].azurestaticapps.net
```

**Save this URL:** _______________________________________

---

## 📝 Phase 3: Configure App Settings

### In App Service → Configuration → Connection Strings:
Add connection string named `DefaultConnection` with the value from your Azure SQL Database.

### In App Service → Configuration → Application Settings:
Add these settings (one by one):

```
Jwt__Key = [Generate-A-Strong-Random-32-Character-Key]
Jwt__Issuer = HealthConnect.Server
Jwt__Audience = HealthConnect.Client
Email__SmtpHost = smtp.gmail.com
Email__SmtpPort = 587
Email__SenderEmail = lesleyngcobo45@gmail.com
Email__SenderName = Madiba HealthConnect
Email__AdminEmail = s225171406@mandela.ac.za
Email__AppPassword = dzxputupergkqtqb
AllowedOrigins__0 = [YOUR-STATIC-WEB-APP-URL]
```

**Don't forget to click SAVE!**

---

## 💾 Phase 4: Deploy Database

1. Install **Azure Data Studio**: https://aka.ms/azuredatastudio
2. Connect to your Azure SQL Server
3. Open `HealthConnect.Server/azure-deploy-schema.sql`
4. Execute the script
5. Verify tables were created

---

## 🚀 Phase 5: Deploy Backend

**Using Visual Studio:**
1. Right-click `HealthConnect.Server` project
2. Click **"Publish..."**
3. Select Azure → Azure App Service
4. Select your `healthconnect-api` service
5. Click **"Publish"**

---

## 🎨 Phase 6: Deploy Frontend

### Update Production API URL:
1. Open `healthconnect.client/src/environments/environment.prod.ts`
2. Replace `YOUR-APP-SERVICE-NAME` with your actual App Service name:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://healthconnect-api-[YOUR-INITIALS].azurewebsites.net/api'
   };
   ```

### Push to GitHub:
```bash
git add .
git commit -m "Configure production environment for Azure"
git push
```

The Static Web App will automatically deploy via GitHub Actions!

---

## ✅ Phase 7: Final Testing

Visit your Static Web App URL and test:

1. [ ] Student registration
2. [ ] Student login
3. [ ] Book appointment
4. [ ] Admin receives email notification
5. [ ] Admin login
6. [ ] Admin assigns nurse
7. [ ] Student receives assignment email
8. [ ] Nurse login
9. [ ] Nurse marks consultation complete
10. [ ] Student receives completion email

---

## 🐛 Troubleshooting

### CORS Errors?
- Check `AllowedOrigins__0` matches your Static Web App URL exactly
- Restart App Service

### Database Connection Errors?
- Verify connection string in App Service
- Check SQL Server firewall settings

### Email Not Working?
- Verify all Email__* settings in App Service
- Check App Service logs

---

## 📊 Cost Estimate

- Static Web App: **FREE**
- App Service (Basic B1): **~$13/month**
- SQL Database (Basic): **~$5/month**
- **Total: ~$18/month** (covered by your $100 student credit)

---

## 📚 Important Files Created

- `appsettings.Production.json` - Production config (secrets go in Azure Portal, not here!)
- `environment.prod.ts` - Frontend production config
- `azure-deploy-schema.sql` - Database schema script
- `AZURE_DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- `.gitignore` - Updated to protect sensitive files

---

## 🎓 Your Student Credit

You have **$100 credit** that renews annually while you're a student. This deployment will cost approximately $18/month, giving you **5+ months of hosting**!

---

**Need detailed instructions?** See `AZURE_DEPLOYMENT_GUIDE.md` for step-by-step walkthrough.

**Ready to deploy?** Start with Phase 2 above!

