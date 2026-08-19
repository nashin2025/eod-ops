# AtollEventManager to eod-ops Cloning Instructions

## Overview
This document provides step-by-step instructions to clone the AtollEventManager application to a new application named "eod-ops" with Replit-specific features removed, configured for Vercel deployment with Supabase database.

## What Has Been Prepared
1. **Clone Script**: `clone_eod_ops.ps1` - PowerShell script automating the cloning process
2. **Supabase Auth Placeholder**: `supabaseAuth.ts` - Basic authentication framework
3. **Analysis Complete**: All Replit-specific files identified for removal

## Manual Cloning Steps

### 1. Create Destination Directory
```powershell
mkdir C:\Users\Nashin\Desktop\eod-ops
```

### 2. Copy Files (Excluding Replit-Specific)
```powershell
$src = "C:\Users\Nashin\Desktop\AtollEventManager"
$dst = "C:\Users\Nashin\Desktop\eod-ops"
robocopy $src $dst /MIR /XF replit.md "server\replitAuth.ts" ".replit" /XD ".git" "node_modules" "bin" "obj" /R:2 /W:5
```

### 3. Update package.json
- Change name from "rest-express" to "eod-ops"
- Remove Replit devDependencies:
  - `@replit/vite-plugin-cartographer`
  - `@replit/vite-plugin-runtime-error-modal`

### 4. Update vite.config.ts
- Remove `import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';`
- Remove `runtimeErrorOverlay()` from plugins array
- Remove the conditional cartographer import block

### 5. Update server/routes.ts
- Change import from `"./replitAuth"` to `"./supabaseAuth"`

### 6. Handle .replit File
- If copied, delete the `.replit` file from the eod-ops directory

### 7. Copy Supabase Auth Implementation
- Copy `supabaseAuth.ts` from `C:\Users\Nashin\Desktop\eod\` to `C:\Users\Nashin\Desktop\eod-ops\server\`
- OR implement your own Supabase authentication (see below)

### 8. Install Dependencies
```powershell
cd C:\Users\Nashin\Desktop\eod-ops
npm install
```

### 9. Set Up Environment Variables
Create a `.env` file in the eod-ops directory with:
```
DATABASE_URL=your_supabase_postgresql_connection_string
SESSION_SECRET=your_session_secret_here
# For Supabase Auth (if implementing):
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 10. Implement Supabase Authentication (Critical)
Replace the placeholder `supabaseAuth.ts` with a proper implementation that:
- Uses Supabase Auth (email/password, social providers, etc.)
- Maintains compatibility with the existing session storage
- Provides `/api/login`, `/api/logout`, and `/api/auth/user` endpoints
- Sets `req.session.userId` on successful login
- Works with the existing `storage.getUser()` function

## Testing
```powershell
cd C:\Users\Nashin\Desktop\eod-ops
npm run dev
```

## Vercel Deployment Preparation
1. Ensure all environment variables are set in Vercel dashboard
2. The application should build with `npm run build`
3. Output will be in `dist/` directory
4. Configure Vercel to serve from `dist/public`

## Files Excluded (Replit-Specific)
- `replit.md` - Replit documentation
- `server/replitAuth.ts` - OpenID Connect Replit authentication
- `.replit` - Replit configuration file
- `.git/` - Git repository (you'll want to init a new one)
- `node_modules/` - Dependencies (fresh install)
- `bin/` and `obj/` - Build artifacts

## Next Steps After Cloning
1. Implement proper Supabase authentication in `supabaseAuth.ts`
2. Test all application features:
   - User authentication (login/logout/session)
   - Event creation and management
   - Island and equipment features
   - Real-time chat functionality
   - Milestone/badge system
   - File upload/storage
3. Apply "ui/ux-pro-max" enhancements as desired
4. Deploy to Vercel with Supabase backend

## Troubleshooting
- If you encounter import errors, check that all dependencies are installed
- Verify database connection string format for Supabase PostgreSQL
- Ensure session secret is set and matches between sessions
- Check that table names in Supabase match the Drizzle schema

---

**Important**: The authentication system is the most critical part to implement correctly. The placeholder provides session management compatibility but requires actual Supabase Auth integration for login/logout functionality.