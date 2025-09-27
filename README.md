# Sofia Ruiz Makeup - Booking Platform

A modern, full-stack booking platform for Sofia Ruiz Makeup services. This application allows clients to book appointments, manage their bookings, and access exclusive content, while providing administrators with powerful tools to manage services, customers, and appointments.

![Sofia Ruiz Makeup Banner](https://via.placeholder.com/1200x400?text=Sofia+Ruiz+Makeup)

## ✨ Features

- **User Authentication**
  - Email/Password and Google Sign-In
  - Password reset functionality
  - Email verification
  - User profile management

- **Booking System**
  - Real-time availability checking
  - Service selection and customization
  - Booking management (view, reschedule, cancel)
  - Email confirmations and reminders

- **Admin Dashboard**
  - Customer management
  - Service management (CRUD operations)
  - Booking calendar and management
  - Business analytics

- **Responsive Design**
  - Mobile-first approach
  - Optimized for all device sizes

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js, Supabase Auth
- **Database**: Supabase
- **Email**: Brevo (Sendinblue)
- **Calendar Integration**: Google Calendar API
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI, Lucide Icons
- **Animations**: Framer Motion
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Cloud Platform project with Calendar API enabled
- Brevo (Sendinblue) account for email services

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/sofiRuizMakeUp.git
   cd sofiRuizMakeUp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Brevo (Sendinblue) Email
   BREVO_API_KEY=your_brevo_api_key
   
   # Google Calendar API
   GOOGLE_CALENDAR_CLIENT_EMAIL=your_calendar_client_email
   GOOGLE_CALENDAR_PRIVATE_KEY=your_calendar_private_key
   GOOGLE_CALENDAR_ID=your_calendar_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Screenshots

*(Add screenshots of your application here)*

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Made with ❤️ by [Your Name]
