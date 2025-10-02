# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Inspired Analyst" - a Next.js 15 consulting business website with a Calendly-integrated booking system. The site offers consulting services with different meeting types and pricing tiers.

## Key Commands

### Development
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Database Setup
- **MongoDB required**: Set `MONGODB_URI` environment variable
- Database: `inspired-analyst`
- Newsletter collection: `newsletter`

### Testing
No test framework is currently configured.

## Architecture

### Framework & Stack
- **Next.js 15** with App Router (src/app/ directory structure)
- **React 19** with TypeScript
- **Tailwind CSS v4** for styling
- **MongoDB 6.20.0** for data persistence
- **Calendly integration** for meeting scheduling

### Project Structure
```
src/
├── app/
│   ├── layout.tsx              # Root layout with navigation and font setup
│   ├── page.tsx                # Homepage with services grid and pricing
│   ├── book/page.tsx           # Booking page with Calendly integration
│   ├── admin/newsletter/page.tsx # Newsletter admin dashboard
│   ├── api/newsletter/route.ts # Newsletter API endpoints (POST/GET/PUT)
│   ├── globals.css             # Global styles with Tailwind and theme variables
│   └── favicon.ico
└── components/
    └── NewsletterSubscription.tsx # Newsletter signup component
```

### Key Components & Features

#### Navigation (layout.tsx:30-54)
- Simple header with brand name and "Book Meeting" CTA
- Responsive design with dark mode support

#### Homepage Services (page.tsx:29-84)
- Four service tiers: Initial Consultation ($50), Extended Consultation ($75), Strategy Workshop ($150), Follow-up Session ($75)
- Grid layout with pricing cards
- Newsletter subscription component integrated at bottom

#### Booking System (book/page.tsx)
- **Client-side component** with React hooks for state management
- Dynamic Calendly URL generation based on selected meeting type
- Meeting type configuration array with IDs matching Calendly events
- Calendly base URL: `https://calendly.com/maxpace94`
- Newsletter subscription component integrated at bottom

#### Newsletter System
- **NewsletterSubscription component** (components/NewsletterSubscription.tsx:47-95)
  - Email validation and form submission
  - Loading states and error handling
  - Calls `/api/newsletter` endpoint
- **Newsletter API** (api/newsletter/route.ts)
  - POST: Subscribe new email (creates document with `unsent` status)
  - GET: Retrieve all subscribers (for admin)
  - PUT: Update subscriber status (`sent`/`unsent`)
  - MongoDB integration with duplicate email checking
- **Admin Dashboard** (admin/newsletter/page.tsx)
  - View all newsletter subscribers in table format
  - Toggle subscriber status between `sent`/`unsent`
  - Real-time subscriber count

### Styling & Theming
- Uses Tailwind CSS v4 with custom theme configuration
- CSS custom properties for background/foreground colors
- Automatic dark mode support via `prefers-color-scheme`
- Geist font family (sans and mono) loaded via next/font/google

### External Dependencies
- **Calendly widget script**: Dynamically loaded in booking page
- **Geist fonts**: Google Fonts integration

## Development Notes

#### Database Schema
- **Newsletter Collection** (`inspired-analyst.newsletter`)
  ```typescript
  {
    id: string,           // Custom ID (timestamp + random)
    email: string,        // Lowercase email
    status: 'sent' | 'unsent',
    createdAt: Date,
    updatedAt: Date
  }
  ```

#### Environment Variables
- `MONGODB_URI` - Required for database connection

#### API Endpoints
- `POST /api/newsletter` - Subscribe email (returns 409 if duplicate)
- `GET /api/newsletter` - List all subscribers (admin)
- `PUT /api/newsletter` - Update subscriber status

#### Calendly Integration Details
- Meeting types in `book/page.tsx:6-39` must match Calendly event slugs
- Current event IDs: `initial-consultation`, `initial-consultation-1`, `strategy-workshop`, `follow-up-session`
- Widget loads via iframe with dynamic URL construction

#### Styling Considerations
- Color classes use template literals (e.g., `border-${meeting.color}-500`) - may need Tailwind safelist for dynamic colors
- Dark mode classes throughout components

#### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json:22)
