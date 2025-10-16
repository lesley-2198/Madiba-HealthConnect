# Madiba HealthConnect

**Health, Just a Click Away!**

A comprehensive healthcare management system designed to streamline healthcare access for Nelson Mandela University students, nurses, and administrators through digital medical consultations, efficient appointment booking, and health information services.

## 📋 Project Overview

Madiba HealthConnect addresses the inefficiencies in campus clinic services by introducing a role-based digital platform with triage capabilities. Instead of waiting days for basic medical assistance, students can receive immediate attention through teleconsultations with licensed nurses who assess whether in-person visits are necessary. The system provides separate dashboards for students, nurses, and administrators, each tailored to their specific needs.

### Key Features

- **Role-Based Access Control**: Separate dashboards for Students, Nurses, and Administrators
- **Student Portal**: Book appointments, view health news, manage profile
- **Nurse Dashboard**: Manage appointments, conduct consultations, update availability
- **Admin Dashboard**: Create nurses, assign appointments, manage system statistics
- **Smart Triage**: Nurses assess urgency and determine if physical checkups are needed
- **Appointment Management**: Complete booking, assignment, and tracking system
- **Weekend Restrictions**: Prevents weekend appointment bookings
- **Real-time Updates**: Live appointment status and availability management
- **Health News Feed**: Stay updated with campus health announcements and wellness tips
- **Responsive Design**: Fully accessible on mobile and desktop devices

## 🎯 Problem Statement

University students currently face:
- Minimum 2-day wait times for clinic appointments
- Inefficient care delivery for minor health issues
- Long waiting periods for consultations that take only 15 minutes
- Limited immediate access to medical advice
- Poor coordination between students, nurses, and administrators
- Manual appointment scheduling leading to conflicts and delays
- Lack of centralized health information and news

## 💡 Solution

A comprehensive digital platform that enables:
- **For Students**: Immediate appointment booking with weekend restrictions, profile management, health news access
- **For Nurses**: Efficient appointment management, consultation notes, availability control, patient interaction
- **For Administrators**: Nurse creation and management, appointment assignment, system oversight, health news management
- **System-wide**: Real-time updates, role-based security, centralized data management, automated workflows

## 🚀 Technology Stack

### Frontend
- **Angular 17** - Modern component-based architecture with reactive forms
- **TypeScript** - Type-safe development with strict typing
- **HTML5 & CSS3** - Responsive UI design with modern styling
- **Angular Reactive Forms** - Advanced form validation and management
- **Angular Router** - Client-side routing with route guards
- **Angular HTTP Client** - API communication with interceptors

### Backend & Services
- **ASP.NET Core 8.0** - High-performance web API framework
- **Entity Framework Core** - Object-relational mapping with migrations
- **SQL Server LocalDB** - Local development database
- **ASP.NET Core Identity** - Authentication and authorization system
- **JWT Bearer Authentication** - Secure token-based authentication
- **AutoMapper** - Object-to-object mapping

### Development Tools
- **GitHub** - Version control and collaboration
- **Node.js** - Frontend runtime environment
- **Angular CLI** - Development tooling and build processes
- **.NET CLI** - Backend development and database management
- **Entity Framework CLI** - Database migration management

## 📦 Project Structure

```
📁 Madiba-HealthConnect/
├── 🖥️ HealthConnect.Server/               # ASP.NET Core Backend
│   ├── 📂 Controllers/                    # API Controllers
│   │   ├── AuthController.cs              # Handles user authentication (login/register)
│   │   └── AppointmentsController.cs      # Manages appointment endpoints
│   │
│   ├── 📂 Data/
│   │   └── ApplicationDbContext.cs        # Entity Framework Core database context
│   │
│   ├── 📂 Models/                         # Entity & domain models
│   │   ├── ApplicationUser.cs             # Extended Identity user model
│   │   └── Appointment.cs                 # Appointment entity model
│   │
│   ├── 📂 DTOs/                           # Data Transfer Objects (request/response shaping)
│   │   ├── LoginDto.cs
│   │   ├── RegisterDto.cs
│   │   └── AppointmentDto.cs
│   │
│   ├── 📂 Services/
│   │   └── RoleService.cs                 # Handles role creation & user-role seeding
│   │
│   ├── Program.cs                         # Application entry point & configuration
│   └── appsettings.json                   # Environment & database configurations
│
├── 🌐 healthconnect.client/                # Angular Frontend
│   ├── 📂 src/
│   │   ├── 📂 app/
│   │   │   ├── dashboard/                 # Student dashboard components
│   │   │   ├── nurse-dashboard/           # Nurse dashboard components
│   │   │   ├── admin-dashboard/           # Admin dashboard components
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
│   │   └── 📂 assets/                     # Images, icons, and static resources
│   │
│   └── angular.json / package.json        # Angular configuration & dependencies
│
└── 📘 README.md                           # Project overview and documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Angular CLI** (`npm install -g @angular/cli`)
- **.NET 8.0 SDK**
- **SQL Server LocalDB** (included with Visual Studio)
- **Git**

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/lesley-2198/Madiba-HealthConnect.git
   cd healthconnect.client
   ```

<details>
<summary>⚙️ Backend Setup (ASP.NET Core)</summary>

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Create and update database**
   ```bash
   dotnet ef database update
   ```

4. **Run the backend server**
   ```bash
   dotnet run
   ```
   
   The backend will be available at `https://localhost:7000` or `http://localhost:5000`

</details>

<details>
<summary>🌐 Frontend Setup (Angular)</summary>

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update dependencies**
   ```bash
   npm update
   ```

4. **Run development server**
   ```bash
   ng serve
   ```
   
   Navigate to `http://localhost:4200/` in your browser
</details>

### Default Login Credentials

>**Admin Account:**
>- Email: `admin@mandela.ac.za`
>- Password: `Admin123!`

>**Test Nurse Account:**
>- Email: `nurse1@mandela.ac.za`
>- Password: `Nurse123!`

## 🎨 Application Features

### 1. Authentication System
- **Multi-Role Login**: Students, Nurses, and Administrators
- **JWT Token Management**: Secure authentication with automatic token refresh
- **Route Guards**: Protected routes based on user roles
- **Mandela Email Validation**: Restricted access to university community
- **Password Requirements**: Configurable security policies

### 2. Student Dashboard
- **Profile Management**: Display and update student information
- **Appointment Booking**: Schedule appointments with weekend restrictions
- **Appointment History**: View past and upcoming appointments
- **Health News**: Access campus health announcements
- **Logout Functionality**: Secure session termination

### 3. Nurse Dashboard
- **Appointment Management**: View assigned and pending appointments
- **Consultation Interface**: Add notes and update appointment status
- **Availability Control**: Toggle availability for new appointments
- **Patient Information**: Access student details and medical history
- **Real-time Updates**: Live appointment status changes

### 4. Admin Dashboard
- **Nurse Management**: Create new nurse accounts with full details
- **Appointment Assignment**: Assign pending appointments to available nurses
- **System Statistics**: Overview of appointments, nurses, and students
- **Health News Management**: Create and publish health announcements
- **User Management**: Monitor system usage and user activity

### 5. Appointment System
- **Smart Scheduling**: Prevent weekend bookings automatically
- **Time Slot Management**: Organized appointment time slots
- **Status Tracking**: Pending → Assigned → Completed workflow
- **Conflict Prevention**: Automatic validation of appointment conflicts
- **Real-time Assignment**: Instant appointment assignment to nurses

## 🔐 Security & Compliance

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Granular access control
- **POPI Compliance**: Adherence to Protection of Personal Information Act
- **Data Privacy**: Secure handling of student health information
- **Academic Email Validation**: Restricted access to university community
- **HTTPS Enforcement**: Secure data transmission
- **Input Validation**: Comprehensive server-side validation

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1024px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

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

## 🚀 Deployment

### Backend Deployment
1. **Build for production:**
   ```bash
   dotnet publish -c Release
   ```

2. **Deploy to Azure/IIS:**
   - Configure connection strings for production database
   - Set up SSL certificates
   - Configure environment variables

### Frontend Deployment
1. **Build for production:**
   ```bash
   ng build --configuration production
   ```

2. **Deploy to Netlify/Vercel:**
   - Connect GitHub repository
   - Set build command: `ng build --configuration production`
   - Set publish directory: `dist/healthconnect.client`

## 🚧 Development Roadmap

### Completed Features (v1.0)
- ✅ Multi-role authentication system
- ✅ Student dashboard with appointment booking
- ✅ Nurse dashboard with appointment management
- ✅ Admin dashboard with nurse creation
- ✅ Weekend booking restrictions
- ✅ Real-time appointment assignment
- ✅ Role-based access control
- ✅ JWT token management
- ✅ Database migrations and seeding

### In Progress
- 🔄 Email notification system
- 🔄 Advanced appointment filtering
- 🔄 Health news management
- 🔄 System statistics dashboard

### Planned Features (v2.0)
- [ ] Real-time chat functionality
- [ ] SMS notification system
- [ ] Medical records access
- [ ] Chatbot AI integration
- [ ] Advanced reporting system
- [ ] Integration with university systems

## 🐛 Known Issues

- Nurse creation requires backend endpoint for fetching all nurses
- Email notifications not yet implemented
- Password recovery functionality pending
- Advanced appointment filtering in development

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
