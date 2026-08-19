# Atoll Event Manager - Web App

A web-based recreation of the Atoll Event Manager application, built with Next.js 14, Supabase, and deployed on Vercel.

## Features

- **Authentication**: Google OAuth via Supabase Auth
- **Role-Based Access Control**: Admin, Coordinator, Agent, Attachment roles with granular permissions
- **Event Management**: Create, view, update, and archive conservation events
- **Equipment Management**: Track equipment inventory with transfers and audit logs
- **Island Map**: Interactive Leaflet map with event markers and location tracking
- **Real-time Chat**: WebSocket-based team chat with audio messages
- **Milestones**: Gamified island visit and atoll exploration achievements
- **User Approval**: Admin approval workflow for new users
- **Data Export**: CSV/JSON export for events, users, equipment, and islands

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Maps**: Leaflet, react-leaflet
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter

## Project Structure

```
webapp/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── pending/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── events/
│   │   │   ├── members/
│   │   │   ├── equipment/
│   │   │   ├── map/
│   │   │   ├── archive/
│   │   │   ├── admin/
│   │   │   └── profile/
│   │   ├── [eventShare]/
│   │   └── api/
│   │       ├── auth/
│   │       ├── users/
│   │       ├── events/
│   │       ├── equipment/
│   │       ├── chat/
│   │       ├── islands/
│   │       ├── milestones/
│   │       ├── export/
│   │       ├── archive/
│   │       ├── admin/
│   │       └── upload/
│   ├── components/
│   │   ├── ui/
│   │   ├── providers.tsx
│   │   ├── event-form.tsx
│   │   └── equipment-form.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   ├── queryClient.ts
│   │   └── utils.ts
│   ├── hooks/
│   ├── types/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── permissions.ts
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── middleware.ts
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── drizzle.config.ts
├── vercel.json
└── .env.example
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
cd webapp
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Run the SQL from `supabase/migrations/001_initial_schema.sql`
4. Enable Google OAuth in **Authentication > Providers**
5. Create a storage bucket named `profiles` for profile pictures

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=your-session-secret-here
ADMIN_EMAILS=admin@example.com
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### 4. Create First Admin User

Run this SQL in Supabase SQL Editor to make your first user an admin:

```sql
UPDATE users SET role = 'admin', approval_status = 'approved' WHERE email = 'your-email@example.com';
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Database Schema

The app uses the following main tables:
- `users` - User accounts with roles and approval status
- `events` - Conservation events with location data
- `islands` - Maldives islands with coordinates
- `event_participants` - Event attendance tracking
- `equipment` - Equipment inventory
- `equipment_transfers` - Equipment movement tracking
- `equipment_audit_log` - Equipment change history
- `chat_messages` - Team chat messages
- `user_chat_read_status` - Chat read receipts
- `island_visits` - User visit history
- `island_visit_equipment` - Equipment used during visits
- `user_milestones` - Achievement tracking

## Role Permissions

| Permission | Admin | Coordinator | Agent | Attachment |
|------------|-------|-------------|-------|------------|
| View Events | ✓ | ✓ | ✓ | ✓ |
| Create Events | ✓ | ✓ | ✓ | ✗ |
| Edit Events | ✓ | ✓ | ✓ | ✗ |
| Delete Events | ✓ | ✓ | ✗ | ✗ |
| Manage Members | ✓ | ✓ | ✗ | ✗ |
| View Map | ✓ | ✓ | ✓ | ✓ |
| Check-in | ✓ | ✓ | ✓ | ✓ |
| Check-in with Equipment | ✓ | ✓ | ✓ | ✗ |
| View Equipment | ✓ | ✓ | ✓ | ✓ |
| Manage Equipment | ✓ | ✓ | ✓ | ✗ |
| Transfer Equipment | ✓ | ✓ | ✓ | ✗ |
| Access Admin Panel | ✓ | ✗ | ✗ | ✗ |

## Migration from Original App

To migrate data from the original AtollEventManager:

1. Export data from the original app using the export features
2. Import CSV/JSON data into Supabase using the Supabase dashboard or CLI
3. Ensure user emails match between systems for continuity

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Type check
npm run typecheck

# Database migrations
npm run db:generate
npm run db:push
```

## License

Private - All rights reserved
