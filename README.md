# Madiba HealthConnect

**Health, Just a Click Away!**

A responsive web application designed to streamline healthcare access for Nelson Mandela University students by providing digital medical consultations, efficient appointment booking, and health information services.

## 📋 Project Overview

Madiba HealthConnect addresses the inefficiencies in campus clinic services by introducing a triage-based digital platform. Instead of waiting days for basic medical assistance, students can receive immediate attention through teleconsultations with licensed nurses who assess whether in-person visits are necessary.

### Key Features

- **Tele-Consultation System**: Connect with licensed nurses via chat or phone
- **Smart Triage**: Nurses assess urgency and determine if physical checkups are needed
- **Manual Booking**: Schedule in-person appointments with preferred time slots
- **Health News Feed**: Stay updated with campus health announcements and wellness tips
- **Responsive Design**: Fully accessible on mobile and desktop devices

## 🎯 Problem Statement

University students currently face:
- Minimum 2-day wait times for clinic appointments
- Inefficient care delivery for minor health issues
- Long waiting periods for consultations that take only 15 minutes
- Limited immediate access to medical advice

## 💡 Solution

A digital platform that enables:
- Immediate medical consultations from registered nurses
- Efficient triage system to prioritize care
- Reduced physical clinic traffic
- Better appointment management for both students and healthcare providers

## 🚀 Technology Stack

### Frontend
- **Angular** - Main framework for component-based architecture
- **TypeScript** - Type-safe development
- **HTML5 & CSS3** - Responsive UI design
- **Reactive Forms** - Form validation and management

### Backend & Services
- **MongoDB Atlas** or **Firebase Firestore** - Database services
- **Formspree** - Form handling
- **Netlify** - Web hosting platform

### Development Tools
- **GitHub** - Version control and collaboration
- **Node.js** - Runtime environment
- **Angular CLI** - Development tooling

## 📦 Project Structure

```
healthconnect.client/
├── src/
│   ├── app/
│   │   ├── log-in/              # Login component
│   │   ├── forgot-password/     # Password reset component
│   │   ├── dashboard/           # Main dashboard component
│   │   ├── app-routing.module.ts
│   │   ├── app.module.ts
│   │   └── app.component.*
│   ├── assets/
│   │   └── logos/               # Application logos
│   ├── index.html
│   └── main.ts
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (`npm install -g @angular/cli`)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/lesley-2198/Madiba-HealthConnect.git
   cd healthconnect.client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   ng serve
   ```

4. **Access the application**
   Navigate to `http://localhost:4200/` in your browser

## 🎨 Application Features

### 1. Authentication System
- **Login**: Secure authentication using academic email (@mandela.ac.za)
- **Password Reset**: Email-based password recovery system
- **Form Validation**: Real-time input validation with error messages

### 2. Dashboard
- **User Profile**: Display student information (name, email, student number, campus, course)
- **Navigation Menu**: Easy access to all features
- **Responsive Layout**: Overlapping card design with modern aesthetics

### 3. Tele-Consultation
- **Chat Option**: Connect with health bot that escalates to nurses when needed
- **Call Option**: Direct phone consultation with clinic staff
- **Immediate Access**: No waiting period for basic medical advice

### 4. Manual Booking
- **Appointment Scheduling**: Select date, time, provider, and reason
- **Appointment Management**: View, reschedule, or cancel existing appointments
- **Email Notifications**: Optional reminders and confirmations
- **Provider Selection**: Choose from available nursing staff

### 5. Health News
- **Scrollable News Feed**: Campus and global health updates
- **Navigation Controls**: Browse through multiple news articles
- **External Links**: Access full articles from trusted health sources
- **Mobile-Friendly**: Touch-enabled scrolling on mobile devices

## 🔐 Security & Compliance

- **POPI Compliance**: Adherence to Protection of Personal Information Act regulations
- **Data Privacy**: Secure handling of student health information
- **Academic Email Validation**: Restricted access to university community
- **Consent Management**: Clear data collection and usage policies

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1024px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🚧 Development Roadmap

### Current Features (v1.0)
- ✅ User authentication
- ✅ Dashboard with profile display
- ✅ Tele-consultation interface
- ✅ Manual booking system
- ✅ Health news feed

### Planned Features
- [ ] Backend API integration
- [ ] Real-time chat functionality
- [ ] SMS/Email notification system
- [ ] Appointment history tracking
- [ ] Medical records access
- [ ] Multi-language support
- [ ] Chatbot AI integration

## 🧪 Testing

Run unit tests:
```bash
ng test
```

Run end-to-end tests:
```bash
ng e2e
```

## 🌐 Deployment

### Netlify Deployment

1. Build the production version:
   ```bash
   ng build --configuration production
   ```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Set build command: `ng build --configuration production`
   - Set publish directory: `dist/healthconnect.client`

---
## 🎓 Project Team

**The Three Musketeers** - Nelson Mandela University

<div align="center">

### **Lesley Ngcobo, Anam Kondile, Lisahluma Leve**
*Front-End Developer | Database Developer | Back-End Developer*

![Location](https://img.shields.io/badge/Location-South_Africa-FF6B6B?style=for-the-badge)
---

**Built with ❤️ for the Nelson Mandela University community**
