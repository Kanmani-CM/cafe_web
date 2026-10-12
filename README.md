# Aurora Café & Roastery

A modern, responsive full-stack café web application crafted with a warm, artisanal aesthetic and robust engineering. Features live table reservation management with slot availability, dynamic menu exploration with dietary filtering, guest inquiry communication, and a complete protected administrative management dashboard.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React
- **Backend**: Node.js, Express, TypeScript
- **Database & ORM**: PostgreSQL, Prisma ORM
- **Authentication**: Session-based authentication with bcrypt password hashing
- **Validation**: Zod schema validation (Client & Server)
- **API Architecture**: RESTful JSON API with rate limiting and security headers (Helmet, CORS)

---

## Features

### 1. Home Page (`/`)
- Café branding, logo, warm artisanal typography (Fraunces & Plus Jakarta Sans).
- Hero section with "Book a Table" and "View Our Menu" call-to-actions.
- Chef & Roaster featured items carousel/grid populated directly from the PostgreSQL backend.
- Roasting philosophy teaser, trust indicators (4.9★ from 1,200+ reviews), opening hours, and location card.

### 2. Menu Page (`/menu`)
- Food & drinks with titles, descriptions, pricing, high-resolution imagery, and categories.
- Real-time search by item title or ingredients.
- Category filters: **All**, **Coffee**, **Tea**, **Brunch**, **Pastries**, **Desserts**, **Beverages**.
- Dietary toggles: **Vegetarian**, **Vegan**, **Gluten-Free**, and **Popular / Featured**.
- Item detail modal with dish preparation and one-click table reservation link.
- Empty states, loading skeletons, and error retry states.

### 3. About Page (`/about`)
- The story of Aurora Café from vintage roaster to neighborhood haven.
- Guiding core values: Single-Origin Integrity, Regenerative Sourcing, Artisanal Bakehouse, Community Sanctuary.
- Artisan profiles: Head Roaster, Executive Pastry Chef, and Head Barista.
- Visual photo journal of café atmosphere.

### 4. Reservation Booking Page (`/reservations`)
- Date selector (disallows past dates).
- Party size selector (1 to 12 guests).
- **Dynamic Real-Time Slot Availability**: Fetches live capacity from `/api/reservations/available-slots?date=...&guests=...` and indicates remaining tables per time slot.
- Duplicate booking prevention for identical customer time slots and table capacity limits.
- Client and server-side Zod validation.
- **Booking Confirmation Card**: Displays unique reference code (e.g. `AUR-XXXX-XXXX`), date, time slot, assigned table, and download slip option.

### 5. Contact & Location Page (`/contact`)
- Contact form with client/server validation and rate limiting.
- Complete café contact details: Address, Phone, Email, Hours of Operation.
- Driving and transit directions with Google Maps links.
- Frequently Asked Questions (FAQ) accordion.

### 6. Admin Management Dashboard (`/admin`)
- Secure authentication via `/api/auth/login` and session management.
- **Overview Metrics**: Total menu offerings, today's bookings, pending reservations, unread guest inquiries, and recent activity log.
- **Menu Management**: Create new menu items, edit existing items, toggle availability (In Stock / Sold Out), and delete items.
- **Reservation Management**: Filter bookings by status (All, Confirmed, Pending, Cancelled, Completed) or search by reference code/customer; update status, assign tables, and cancel reservations.
- **Guest Inquiries**: View messages from the contact form, mark as read/unread, and delete inquiries.

---

## Project Structure

```
/
├── client/                     # Frontend Vite + React application
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Badge, Modal, etc.
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # Home, Menu, About, Reservations, Contact
│   │   │   └── admin/          # AdminLoginPage, AdminDashboardPage
│   │   ├── services/           # api.ts, menuService, reservationService, authService
│   │   ├── types/              # TypeScript interface contracts
│   │   ├── App.tsx             # Main routing and application layout
│   │   ├── index.css           # Tailwind CSS v4 & custom design tokens
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts          # Vite proxy & Tailwind plugin configuration
│
├── server/                     # Backend Express + TypeScript application
│   ├── src/
│   │   ├── controllers/        # auth, menu, reservation, contact, stats
│   │   ├── middleware/         # auth, validate, rateLimiter, errorHandler
│   │   ├── routes/             # REST route definitions
│   │   ├── services/           # table allocation & reservation service
│   │   ├── validators/         # Zod schemas
│   │   ├── app.ts              # Express configuration
│   │   └── server.ts           # Server bootstrap
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema models
│   │   └── seed.ts             # Initial tables, menu items & admin seed
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example                # Root environment reference
├── package.json                # Root workspace orchestration
└── README.md
```

---

## Local Setup & Development Instructions

### Prerequisites
- **Node.js** (v18.0 or newer)
- **PostgreSQL** running locally on port 5432

### 1. Installation
Install all dependencies across root, server, and client with one command:
```bash
npm run install:all
```
*(Or navigate to `server` and `client` respectively and run `npm install`)*

### 2. Environment Configuration
Review `.env.example` in both the root and `server/` directory:
```bash
# In server/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cafe_db?schema=public"
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
SESSION_SECRET="aurora_cafe_session_secret_key"
ADMIN_EMAIL="admin@auroracafe.com"
ADMIN_PASSWORD="AdminPassword123!"
```

### 3. Database Migration & Seed
Run Prisma to create all PostgreSQL tables and seed sample data:
```bash
# From root or inside server/
npm run prisma:push --prefix server
npm run prisma:seed --prefix server
```

The seed script will populate:
- **Default Administrator**: `admin@auroracafe.com` (Password: `AdminPassword123!`)
- **10 Dining Tables**: Indoor, Window, Patio, and Terrace arrangements with varying guest capacities
- **19 Artisanal Menu Items**: Complete with categories, prices, dietary tags, and photos
- **Sample Reservations**: Pre-configured upcoming bookings
- **Sample Guest Inquiries**: Initial catering inquiries

### 4. Running the Development Servers
From the root directory, start both backend and frontend concurrently:
```bash
npm run dev
```
- **Backend API**: `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)
- **Frontend App**: `http://localhost:5173`

Alternatively, you can run them individually:
```bash
# In terminal 1:
npm run dev:server

# In terminal 2:
npm run dev:client
```

### 5. Running Production Builds
```bash
npm run build
```
This compiles the backend TypeScript into `server/dist/` and the frontend bundle into `client/dist/`.

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Authenticate staff/admin
- `POST /api/auth/logout` - Invalidate session
- `GET /api/auth/me` - Current session user profile

### Menu Items
- `GET /api/menu` - Query menu items (supports `?category=`, `?search=`, `?vegetarian=`, `?vegan=`, `?glutenFree=`, `?popular=`)
- `GET /api/menu/:id` - Fetch item details
- `POST /api/menu` - Create item (Admin only)
- `PUT /api/menu/:id` - Update item (Admin only)
- `DELETE /api/menu/:id` - Delete item (Admin only)

### Reservations
- `POST /api/reservations` - Book a table (Duplicate checks & automatic table allocation)
- `GET /api/reservations/available-slots?date=YYYY-MM-DD&guests=N` - Get slot availability
- `GET /api/reservations` - List all reservations (Admin only)
- `PATCH /api/reservations/:id/status` - Update reservation status (Admin only)
- `DELETE /api/reservations/:id` - Cancel/remove reservation (Admin only)

### Inquiries & Contact
- `POST /api/contact` - Submit guest message (Rate-limited)
- `GET /api/contact` - List all inquiries (Admin only)
- `PATCH /api/contact/:id/read` - Mark read/unread (Admin only)
- `DELETE /api/contact/:id` - Delete inquiry (Admin only)

### Admin Stats
- `GET /api/admin/stats` - Summary dashboard metrics (Admin only)
