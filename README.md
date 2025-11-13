# Madiba HealthConnect

**Health, Just a Click Away!**

A comprehensive healthcare management system designed to streamline healthcare access for Nelson Mandela University students, nurses, and administrators through digital medical consultations, efficient appointment booking, and health information services.

## 📋 Project Overview

Madiba HealthConnect addresses the inefficiencies in campus clinic services by introducing a role-based digital platform with triage capabilities. Instead of waiting days for basic medical assistance, students can receive immediate attention through teleconsultations with licensed nurses who assess whether in-person visits are necessary. The system provides separate dashboards for students, nurses, and administrators, each tailored to their specific needs.

### Key Features

- **Role-Based Access Control**: Separate dashboards for Students, Nurses, and Administrators
- **Student Portal**: Book appointments, view health news, manage profile
- **Nurse Dashboard**: Manage appointments, conduct consultations, update availability
- **Admin Dashboard**: Create nurses, assign appointments, manage system statistics and analytics
- **Smart Triage**: Nurses assess urgency and determine if physical checkups are needed
- **Appointment Management**: Complete booking, assignment, and tracking system
- **Email Notifications**: Automated email notifications via Resend API
  - Admin notification when student books appointment
  - Student confirmation when nurse is assigned
  - Student notification with prescription when consultation is complete
- **Prescription Management**: Nurses can add prescriptions visible to students
- **Weekend Restrictions**: Prevents weekend appointment bookings
- **Operating Hours Validation**: Checks clinic hours and displays appropriate messages
- **Analytics Dashboard**: Comprehensive appointment statistics and nurse performance metrics
- **Real-time Updates**: Live appointment status and availability management
- **Health News Feed**: Stay updated with campus health announcements and wellness tips
- **Responsive Design**: Fully accessible on mobile and desktop devices with hamburger menu
- **Cloud Deployment**: Live deployment on Render (backend) and Vercel (frontend)

## 🎥 System Demo & Walkthrough

Watch our comprehensive system demo to see Madiba HealthConnect in action:

<div align="center">
  <a href="https://youtu.be/1H5vqefcL6g">
    <img src="https://img.youtube.com/vi/1H5vqefcL6g/maxresdefault.jpg" alt="Madiba HealthConnect Demo" width="600" style="border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
  </a>
  <br>
  <em>Click the image above to watch the full system walkthrough</em>
</div>

## 🎯 Problem Statement

University students currently face:
- Appointments require at least 2 days advance booking
- Inefficient care delivery for minor health issues
- Long waiting periods for consultations that take only 15 minutes
- Limited immediate access to medical advice
- Poor coordination between students, nurses, and administrators
- Manual appointment scheduling leading to conflicts and delays
- Lack of centralized health information and news
- No automated notification system for appointment updates

## 💡 Solution

A comprehensive digital platform that enables:
- **For Students**: Immediate appointment booking with weekend restrictions, profile management, health news access, email notifications for appointment updates
- **For Nurses**: Efficient appointment management, consultation notes and prescriptions, availability control, patient interaction
- **For Administrators**: Nurse creation and management, appointment assignment, system oversight, analytics dashboard, health news management
- **System-wide**: Real-time updates, role-based security, centralized data management, automated workflows, email notifications

## 🚀 Technology Stack

### Frontend
- **Angular 17** - Modern component-based architecture with reactive forms
- **TypeScript** - Type-safe development with strict typing
- **HTML5 & CSS3** - Responsive UI design with modern styling
- **Angular Reactive Forms** - Advanced form validation and management
- **Angular Router** - Client-side routing with route guards
- **Angular HTTP Client** - API communication with interceptors
- **Chart.js** - Analytics dashboard charts and visualizations
- **FontAwesome** - Icon library (optional, can be removed)

### Backend & Services
- **ASP.NET Core 8.0** - High-performance web API framework
- **Entity Framework Core** - Object-relational mapping with migrations
- **PostgreSQL** - Production database (Render)
- **SQL Server LocalDB** - Local development database
- **ASP.NET Core Identity** - Authentication and authorization system
- **JWT Bearer Authentication** - Secure token-based authentication
- **Resend API** - Email notification service (HTTP API)
- **Docker** - Containerization for deployment

### Development Tools
- **GitHub** - Version control and collaboration
- **Node.js** - Frontend runtime environment
- **Angular CLI** - Development tooling and build processes
- **.NET CLI** - Backend development and database management
- **Entity Framework CLI** - Database migration management
- **Docker** - Containerization and deployment

### Deployment Platforms
- **Render** - Backend API hosting (PostgreSQL + Docker)
- **Vercel** - Frontend hosting (Angular SPA)

## 📦 Project Structure

```
📁 Madiba-HealthConnect/
│
├── 🖥️ HealthConnect.Server/               # ASP.NET Core Backend
│   │
│   ├── 📂 Controllers/                    # API Controllers
│   │   ├── AuthController.cs              # Handles user authentication (login/register)
│   │   └── AppointmentsController.cs      # Manages appointment endpoints
│   │
│   ├── 📂 Data/
│   │   └── ApplicationDbContext.cs        # Entity Framework Core database context
│   │
│   ├── 📂 Models/                         # Entity & domain models
│   │   ├── ApplicationUser.cs             # Extended Identity user model
│   │   └── Appointment.cs                 # Appointment entity model (includes Prescription field)
│   │
│   ├── 📂 DTOs/                           # Data Transfer Objects (request/response shaping)
│   │   ├── LoginDto.cs
│   │   ├── RegisterDto.cs
│   │   ├── RegisterNurseDto.cs
│   │   └── AppointmentDto.cs
│   │
│   ├── 📂 Services/                       # Backend services
│   │   ├── RoleServices.cs                # Handles role creation & user-role seeding
│   │   └── EmailService.cs                # Resend API email notification service
│   │
│   ├── 📂 Configuration/
│   │   └── ResendSettings.cs              # Resend API configuration
│   │
│   ├── 📂 Migrations/                     # Entity Framework migrations
│   │   └── [Migration files]              # Database schema migrations
│   │
│   ├── Dockerfile                         # Docker container configuration
│   ├── .dockerignore                      # Docker build exclusions
│   ├── Program.cs                         # Application entry point & configuration
│   ├── appsettings.json                   # Default configuration
│   ├── appsettings.Development.json       # Local development configuration
│   └── appsettings.Production.json        # Production configuration (gitignored)
│
├── 🌐 healthconnect.client/                # Angular Frontend
│   │
│   ├── 📂 src/
│   │   │
│   │   ├── 📂 app/
│   │   │   ├── dashboard/                 # Student dashboard components
│   │   │   ├── nurse-dashboard/           # Nurse dashboard components
│   │   │   ├── admin-dashboard/           # Admin dashboard components
│   │   │   ├── analytics-dashboard/       # Analytics dashboard component
│   │   │   ├── log-in/                    # Login & authentication UI
│   │   │   ├── create-account/            # Student account registration UI
│   │   │   ├── 📂 services/               # Angular service layer (HTTP & logic)
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── appointment.service.ts
│   │   │   │   └── nurse.service.ts
│   │   │   ├── 📂 guards/                 # Route protection logic
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── app-routing.module.ts      # Angular routing configuration
│   │   │   └── app.module.ts              # Root Angular module
│   │   │
│   │   ├── 📂 environments/               # Environment configurations
│   │   │   ├── environment.ts             # Default environment
│   │   │   ├── environment.development.ts # Development environment
│   │   │   └── environment.prod.ts        # Production environment (Vercel)
│   │   │
│   │   └── 📂 assets/                     # Images, icons, and static resources
│   │
│   ├── angular.json                       # Angular configuration
│   └── package.json                       # Dependencies and scripts
│
├── 📘 README.md                            # Project overview and documentation
├── 📘 RENDER_DEPLOYMENT_GUIDE.md           # Deployment guide for Render
├── ⚙️ global.json                          # .NET SDK version specification
└── ⚙️ .gitignore                           # Git exclusions
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Angular CLI** (`npm install -g @angular/cli`)
- **.NET 8.0 SDK** (specifically 8.0.406 as specified in `global.json`)
- **SQL Server LocalDB** (for local development) OR **PostgreSQL** (optional, for matching production)
- **Git**
- **Docker** (optional, for containerized deployment)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/lesley-2198/Madiba-HealthConnect.git
   cd Madiba-HealthConnect
   ```

<details>
<summary>⚙️ Backend Setup (ASP.NET Core)</summary>

2. **Navigate to backend directory**
   ```bash
   cd HealthConnect.Server
   ```

3. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

4. **Configure database connection**
   
   For **SQL Server LocalDB** (default for local development):
   - Edit `appsettings.json` or `appsettings.Development.json`
   - Ensure connection string: `"Server=(localdb)\\mssqllocaldb;Database=HealthConnectDb;Trusted_Connection=true;MultipleActiveResultSets=true"`

   For **PostgreSQL** (to match production):
   - Edit `appsettings.json` or `appsettings.Development.json`
   - Set connection string: `"Host=localhost;Database=healthconnect;Username=postgres;Password=postgres"`

5. **Create and apply database migrations**
   ```bash
   # Delete old migrations if switching database providers
   # Then create new migrations for your chosen database
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

6. **Configure Resend API (for email notifications)**
   - Get your Resend API key from https://resend.com/api-keys
   - Update `appsettings.json` or `appsettings.Development.json`:
   ```json
   "Resend": {
     "ApiKey": "your-resend-api-key",
     "FromEmail": "onboarding@resend.dev",
     "FromName": "Madiba HealthConnect",
     "AdminEmail": "your-email@gmail.com"
   }
   ```
   **Note:** Resend free tier only sends to your verified email address. For testing, use your own email for both admin and student accounts.

7. **Run the backend server**
   ```bash
   dotnet run
   ```
   
   The backend will be available at `https://localhost:7000` or `http://localhost:5000`

</details>

<details>
<summary>🌐 Frontend Setup (Angular)</summary>

2. **Navigate to frontend directory**
   ```bash
   cd healthconnect.client
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   
   For **local development**, ensure `src/environments/environment.ts` has:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'https://localhost:40443/api'
   };
   ```

   For **production**, `src/environments/environment.prod.ts` should have:
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'https://your-render-backend-url.onrender.com/api'
   };
   ```

5. **Run development server**
   ```bash
   ng serve
   ```
   
   Navigate to `http://localhost:4200/` in your browser

</details>

### Default Login Credentials

>**Admin Account:**
>- Email: `admin@healthconnect.com`
>- Password: `Admin@123`

>**Test Nurse Accounts:**
>- Email: `nurse1@mandela.ac.za`
>- Password: `Nurse@123`
>- *(Additional test nurses can be created via Admin Dashboard)*

>**Student Accounts:**
>- Create via the registration page
>- Email must be a valid format (validation enforced)

## 🎨 Application Features

### 1. Authentication System
- **Multi-Role Login**: Students, Nurses, and Administrators
- **JWT Token Management**: Secure authentication with automatic token refresh
- **Route Guards**: Protected routes based on user roles
- **Email Validation**: Email format validation
- **Password Requirements**: Configurable security policies

### 2. Student Dashboard
- **Profile Management**: Display and update student information
- **Appointment Booking**: 
  - Schedule appointments with weekend restrictions
  - Operating hours validation (9 AM - 6 PM, Monday-Friday)
  - Time slot selection with conflict prevention
  - Success/warning modal based on booking time
- **Appointment History**: View past and upcoming appointments with status
- **Prescription View**: View prescription and instructions from completed consultations
- **Health News**: Access campus health announcements
- **Logout Functionality**: Secure session termination

### 3. Nurse Dashboard
- **Dashboard Overview**: View all assigned appointments with details
- **Appointment Management**: 
  - View assigned appointments
  - Start consultation (automatically opens consultation form)
  - Add internal consultation notes (private)
  - Add prescription and instructions (visible to student)
  - Mark appointments as complete
- **Availability Control**: Toggle availability for new appointments
- **Patient Information**: Access student details including phone number
- **Real-time Updates**: Live appointment status changes
- **Consultation Interface**: 
  - Separate fields for internal notes and prescriptions
  - Follow-up appointment scheduling
  - Automatic email notification when consultation is marked complete

### 4. Admin Dashboard
- **Nurse Management**: 
  - Create new nurse accounts with full details (name, email, specialization, employee number, etc.)
  - View all nurses with their availability status
  - Inline creation form matching application styling
- **Appointment Assignment**: 
  - View pending appointments
  - View assigned appointments
  - Inline assignment form within appointment cards
  - Assign nurses to pending appointments
  - Automatic email notification to student when nurse is assigned
- **System Statistics**: Overview of appointments, nurses, and students
- **Analytics Dashboard**: 
  - Comprehensive appointment statistics
  - Nurse performance metrics
  - Time slot utilization charts
  - Appointment trends visualization
  - Accessible from "Reports & Analytics" section
- **Health News Management**: Create and publish health announcements

### 5. Appointment System
- **Smart Scheduling**: Prevent weekend bookings automatically
- **Operating Hours Validation**: Checks clinic hours (9 AM - 6 PM, Monday-Friday)
- **Time Slot Management**: Organized appointment time slots
- **Status Tracking**: Pending → Assigned → Completed workflow
- **Conflict Prevention**: Automatic validation of appointment conflicts
- **Real-time Assignment**: Instant appointment assignment to nurses
- **Prescription Field**: Nurses can add prescriptions visible to students

### 6. Email Notification System
- **Resend API Integration**: HTTP-based email delivery
- **Admin Notification**: Email sent to admin when student books appointment
  - Includes: Student name, number, phone, date, time, consultation type, symptoms
- **Assignment Confirmation**: Email sent to student when nurse is assigned
  - Includes: Appointment details, assigned nurse name and specialization
- **Consultation Complete**: Email sent to student when consultation is marked complete
  - Includes: Appointment summary, prescription and instructions (if provided)
- **HTML Email Templates**: Professional, responsive email design
- **Error Handling**: Comprehensive logging and error tracking

### 7. Analytics Dashboard
- **Appointment Statistics**: 
  - Total appointments by status
  - Appointments by nurse
  - Time slot utilization
  - Appointment trends over time
- **Nurse Performance**:
  - Appointments per nurse
  - Average consultation time
  - Nurse availability status
- **Interactive Charts**: Chart.js visualizations
- **Admin-Only Access**: Protected by role-based authorization

## 🔐 Security & Compliance

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Granular access control
- **POPI Compliance**: Adherence to Protection of Personal Information Act
- **Data Privacy**: Secure handling of student health information
- **Email Validation**: Input validation and sanitization
- **HTTPS Enforcement**: Secure data transmission
- **Input Validation**: Comprehensive server-side validation
- **CORS Configuration**: Properly configured for production deployment
- **Environment Variables**: Sensitive data stored in environment variables, not committed to repository

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1024px
- **Mobile**: Below 768px (with hamburger menu)
- **Small Mobile**: Below 480px

Mobile features:
- Hamburger menu for navigation
- Responsive appointment cards
- Touch-friendly buttons and forms
- Optimized layout for small screens

## 🧪 Testing

### Backend Testing
```bash
cd HealthConnect.Server
dotnet test
```

### Frontend Testing
```bash
cd healthconnect.client
ng test
```

### End-to-End Testing
```bash
cd healthconnect.client
ng e2e
```

### Email Notification Testing
1. Use your own email for both admin and student test accounts (Resend free tier limitation)
2. Test the complete flow:
   - Student books appointment → Check admin email
   - Admin assigns nurse → Check student email
   - Nurse completes consultation → Check student email with prescription

## 🚀 Deployment

### Production URLs
- **Frontend (Vercel)**: https://madiba-health-connect.vercel.app
- **Backend API (Render)**: https://madiba-healthconnect.onrender.com
- **Database**: PostgreSQL on Render

<details>
<summary>⚙️ Backend Setup (Render)</summary>

1. **Create Render PostgreSQL Database**
   - Go to Render dashboard
   - Create new PostgreSQL database
   - Copy the `DATABASE_URL` connection string

2. **Create Render Web Service**
   - Connect GitHub repository
   - Set root directory: `HealthConnect.Server`
   - Build command: `docker build -t healthconnect-backend .`
   - Start command: `docker run -p 10000:8080 healthconnect-backend`
   - OR use Docker deployment method

3. **Configure Environment Variables on Render**
   ```bash
   DATABASE_URL=<your-postgresql-connection-string>
   Resend__ApiKey=<your-resend-api-key>
   Resend__FromEmail=onboarding@resend.dev
   Resend__FromName=Madiba HealthConnect
   Resend__AdminEmail=<admin-email-for-testing>
   Jwt__Key=<your-jwt-secret-key>
   Jwt__Issuer=HealthConnect.Server
   Jwt__Audience=HealthConnect.Client
   ```

4. **Deploy**
   - Render will automatically build and deploy from Dockerfile
   - Migrations run automatically on startup

</details>
  
<details>
<summary>⚙️ Frontend Setup (Vercel)</summary>
   
1. **Connect GitHub Repository**
   - Go to Vercel dashboard
   - Import repository
   - Set root directory: healthconnect.client
   
2. **Configure Build Settings**
   -Build command: `npm install && npm run build`
   - Output directory: `dist/healthconnect.client`
   - Install command: `npm install`

3. **Configure Environment Variables**
   - `API_URL`: Your Render backend URL (e.g., `https://madiba-healthconnect.onrender.com`)

4. **Deploy**
   - Vercel will automatically build and deploy
   - Update `environment.prod.ts` with your Render backend URL

</details>

<details>
<summary>Docker Deployment (Alternate)</summary>
   
1. **Build Backend Image**
   ```bash
   cd HealthConnect.Server
   docker build -t healthconnect-backend.
   ```

2. **Run Container**
   ```bash
   docker run -p 8080:8080 \
     -e DATABASE_URL="your-postgresql-connection-string" \
     -e Resend__ApiKey="your-resend-api-key" \
     healthconnect-backend
   ```

</details>

## 🚧 Development Roadmap

### Completed Features (v1.0)
- ✅ Multi-role authentication system
- ✅ Student dashboard with appointment booking
- ✅ Nurse dashboard with appointment management
- ✅ Admin dashboard with nurse creation and assignment
- ✅ Weekend booking restrictions
- ✅ Operating hours validation
- ✅ Real-time appointment assignment
- ✅ Role-based access control
- ✅ JWT token management
- ✅ Database migrations and seeding (SQL Server & PostgreSQL)
- ✅ Email notification system (Resend API)
- ✅ Prescription field and management
- ✅ Analytics dashboard
- ✅ Mobile responsive design with hamburger menu
- ✅ Cloud deployment (Render + Vercel)
- ✅ Docker containerization
- ✅ Environment-based configuration

### In Progress
- 🔄 Advanced appointment filtering
- 🔄 Enhanced analytics features

### Planned Features (v2.0)
- [ ] SMS notification system
- [ ] Real-time chat functionality
- [ ] Medical records access
- [ ] Chatbot AI integration
- [ ] Advanced reporting system
- [ ] Integration with university systems
- [ ] Multi-language support
- [ ] Appointment reminders

## 🐛 Known Issues & Limitations

- Resend Free Tier: Can only send emails to your verified email address (for testing, use your own email for both admin and student accounts)
- Domain Verification: To send emails to any recipient, verify a domain on Resend.com
- Database Provider: Migrations are provider-specific (SQL Server vs PostgreSQL). When switching providers, delete old migrations and create new ones.

## 📝 Important Notes

### Email Configuration
- Resend free tier only sends to your verified email address
- For production, verify a domain on Resend.com to send to any email
- Update `Resend__AdminEmail` in environment variables for testing

### Database Configuration
- Local development uses SQL Server LocalDB by default
- Production uses PostgreSQL on Render
- Migrations are provider-specific - don't mix SQL Server and PostgreSQL migrations

### Environment Variables
- Never commit `appsettings.Production.json to Git`
- Use environment variables on Render for production secrets
- Local development uses `appsettings.Development.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎓 Project Team

**The Three Musketeers** - Nelson Mandela University

<div align="center">

### **Lesley Ngcobo, Anam Kondile, Lisahluma Leve**
*Front-End Developer | Database Developer | Back-End Developer*

![Location](https://img.shields.io/badge/Location-South_Africa-FF6B6B?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech_Stack-Angular%20%7C%20ASP.NET%20Core%20%7C%20SQL%20Server-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active%20Development-green?style=for-the-badge)

---

**Built with ❤️ for the Nelson Mandela University community**

*Last Updated: October 2025*
</div>
