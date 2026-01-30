# EquipTrack - Equipment Rental Management System

## Overview

EquipTrack is a full-stack equipment rental management application designed for construction companies to track project equipment rentals, invoices, and costs. The system provides dashboard analytics, project management, equipment catalog maintenance, rental tracking, invoice management, and reporting capabilities with role-based access control.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming (light/dark mode support)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for dashboard visualizations

The frontend follows a page-based architecture with reusable components. Pages are located in `client/src/pages/` and shared components in `client/src/components/`. The application uses a sidebar navigation pattern with authentication context for role-based UI rendering.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Session-based authentication using express-session with bcrypt password hashing
- **File Uploads**: Multer for handling document uploads (invoices, PDFs)
- **PDF Generation**: Puppeteer for report generation

The backend follows a modular structure:
- `server/routes.ts` - API route definitions
- `server/storage.ts` - Data access layer with storage interface
- `server/auth.ts` - Authentication middleware and helpers
- `server/db.ts` - Database connection setup

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` - contains all table definitions and Zod schemas
- **Migrations**: Managed via Drizzle Kit (`drizzle-kit push`)

Key entities:
- Users (with role-based access: admin, manager, viewer)
- Projects (construction projects with status tracking)
- Equipment Catalog (equipment types with vendor and cost info)
- Rentals (links equipment to projects with date ranges)
- Invoices (with file attachment support)
- Activity Logs and Settings

### Authentication & Authorization
- Session-based auth stored in PostgreSQL via connect-pg-simple
- Three user roles: admin (full access), manager (edit access), viewer (read-only)
- Middleware functions: `requireAuth`, `requireRole`, `canEdit`, `isAdmin`

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: esbuild bundles server code, Vite builds client assets
- **Build Output**: `dist/` directory with `index.cjs` (server) and `public/` (client assets)

## External Dependencies

### Database
- PostgreSQL (connection via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe queries
- connect-pg-simple for session storage

### File Storage
- Local filesystem (`uploads/` directory) for invoice attachments

### Third-Party Libraries
- Puppeteer for server-side PDF generation
- Recharts for data visualization
- date-fns for date manipulation
- Zod for runtime validation across client and server

### Replit-Specific Integrations
- `@replit/vite-plugin-runtime-error-modal` for error overlay
- `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-dev-banner` for development features