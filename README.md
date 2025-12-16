# Byte Blogger

A modern blog platform built with Next.js, featuring a rich text editor, authentication, and admin dashboard.

## Features

- 📝 Rich text blog editor with TipTap
- 🔐 Google OAuth authentication
- 👤 User profiles and role-based access
- 🏷️ Tag management system
- 📊 Post analytics (views, likes)
- 📌 Pin/unpin posts
- 🌓 Dark mode support
- 📱 Responsive design

## Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** NextAuth.js v5
- **Styling:** Tailwind CSS
- **Editor:** TipTap
- **File Uploads:** UploadThing
- **UI Components:** Radix UI

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   AUTH_SECRET=your_auth_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Set up the database:
   ```bash
   npm run db:push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── (home)/      # Public blog pages
│   ├── admin/       # Admin dashboard
│   └── api/         # API routes
├── components/      # React components
├── server/          # Server-side code
│   ├── auth/       # Authentication configuration
│   └── db/         # Database schema and connection
└── lib/            # Utility functions
```

## License

Private project - All rights reserved
