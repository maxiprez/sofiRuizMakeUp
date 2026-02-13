# 💄 Sofia Ruiz Makeup – Booking Platform

A modern, full-stack booking platform for **Sofia Ruiz Makeup**.  
This production-ready application allows clients to book and manage appointments seamlessly, while providing administrators with powerful tools to control services, customers, and scheduling.

The system includes real-world architecture, background jobs, third-party integrations, role-based access control, and automated email reminders.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Email/Password registration
- Google Sign-In
- Email verification
- Password recovery
- Profile management
- Role-based access control (`user` and `admin`)
- Middleware-based route protection
- Secure session handling

---

### 📅 Booking System
- Real-time availability validation
- Service selection with dynamic duration handling
- Create, reschedule, and cancel appointments
- Full booking history per user
- Soft delete (logical deletion) for cancellations
- Automatic synchronization with Google Calendar
- Persistent storage using Supabase

---

### 📧 Automated Email System
- Booking confirmation emails
- Automatic reminder 24 hours before the appointment
- Cron Job running in production to trigger reminder logic
- Email delivery powered by **Resend**

---

### 🛠 Admin Dashboard
- Full service management (CRUD)
- Customer management
- Booking calendar management
- Appointment oversight and control
- Cancellation tracking
- Role-restricted access

---

### 📱 UX & Design
- Mobile-first approach
- Fully responsive layout
- Reusable and scalable component architecture
- Animations with Framer Motion
- UI built with Radix UI and Tailwind CSS
- Structured to evolve into a formal Design System

---

## 🧠 Technical Architecture

- Schema validation using Zod
- Form handling with React Hook Form
- Middleware for route protection and role enforcement
- Clear separation between business logic and UI
- Server Actions & API Routes for backend operations
- Secure integration with external APIs
- Optimized state and data handling
- Deployed to production on Vercel

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router), React 19, TypeScript  
- **Styling:** Tailwind CSS  
- **Authentication:** NextAuth.js + Supabase Auth  
- **Database:** Supabase  
- **Email Service:** Resend  
- **Calendar Integration:** Google Calendar API  
- **Validation:** Zod  
- **Forms:** React Hook Form  
- **UI Components:** Radix UI + Lucide Icons  
- **Animations:** Framer Motion  
- **Deployment:** Vercel  

---

## 🚀 Production Highlights

- Live production deployment
- Cron-based background jobs for automated reminders
- Google Calendar synchronization on booking creation
- Soft delete strategy for data integrity
- Role-based middleware protection
- Clean and scalable folder structure
- Environment variable security management

---

## 📌 Project Purpose

This project was built as a real-world production system to demonstrate:

- Full-stack architecture design
- Authentication and authorization patterns
- Background job execution
- Third-party API integrations
- Clean code practices
- Scalable system design
- Production deployment workflow

---

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by Maxi
