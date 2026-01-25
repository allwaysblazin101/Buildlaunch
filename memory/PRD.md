# Build Launch - Renovation Job Marketplace PRD

## Original Problem Statement
Build a complete, professional renovation job marketplace website for "Build Launch". Platform where homeowners in Mississauga, Toronto, and Brampton can post renovation jobs, and contractors can browse and bid on those jobs for free. Escrow system for payments with 10% platform fee. Business phone: 416-697-1728.

## Architecture
- **Backend**: FastAPI + MongoDB
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Payment**: Stripe escrow integration
- **Auth**: JWT-based authentication
- **Email**: Resend API for notifications

## User Personas
1. **Homeowners** - Post renovation jobs, fund escrow, accept bids, release payments
2. **Contractors** - Browse jobs, submit bids, get verified, receive payments
3. **Admin** - Manage users, jobs, resolve disputes

## Core Requirements (Static)
- [x] User registration (homeowner/contractor)
- [x] Job posting with location, category, budget, photos
- [x] Job browsing with filters
- [x] Bidding system (free for contractors)
- [x] Escrow payment via Stripe
- [x] Contractor verification (license, insurance)
- [x] Messaging system
- [x] Review/rating system
- [x] Contact page with phone 416-697-1728
- [x] Admin dashboard

## What's Been Implemented (Jan 2025)

### Session 1-2
- Complete backend API (35+ endpoints)
- Dark theme UI inspired by emergen.io
- Photo gallery on landing and job pages
- Homeowner & contractor dashboards
- Job posting with image upload
- Escrow payment flow with Stripe
- Contractor verification form
- In-app messaging
- Contact page with phone number
- Admin panel with user management

### Session 3 (Current)
- ✅ Terms of Service page (/terms)
- ✅ Privacy Policy page (/privacy)
- ✅ Footer links to Terms/Privacy
- ✅ Contractor public profile page (/contractors/:id)
- ✅ Email notifications via Resend API:
  - New bid notification to homeowner
  - Bid accepted notification to contractor
  - Escrow funded notification to homeowner
  - Payment released notification to contractor
- ✅ All routes properly configured in App.js

## Key Files
- `/app/backend/server.py` - All backend API logic
- `/app/frontend/src/App.js` - Main router
- `/app/frontend/src/pages/` - All page components
- `/app/backend/.env` - Environment variables (Stripe, Resend, JWT, Admin)

## P0 (Critical) - ✅ DONE
- User auth, job CRUD, bidding, payments, dashboards
- Admin panel, Terms/Privacy pages, Email notifications

## P1 (Important) - Backlog
- [ ] Real file uploads for job images (currently using URLs)
- [ ] Real-time messaging with WebSocket
- [ ] Advanced search filters (by contractor rating, price range)
- [ ] SMS notifications via Twilio

## P2 (Nice to Have) - Backlog
- [ ] Payment history export
- [ ] Contractor portfolio gallery
- [ ] Job templates for common renovations
- [ ] Mobile app (PWA or native)

## Testing Status
- Backend: 34/34 tests passing (100%)
- Frontend: All pages loading correctly
- Test report: `/app/test_reports/iteration_3.json`

## Credentials
- **Admin**: admin@buildlaunch.ca / BuildLaunch2024!
- **New users**: Register via /register page

## Production Readiness
- ✅ Core features complete
- ✅ Security (rate limiting, password validation)
- ✅ Legal pages (Terms, Privacy)
- ✅ Email notifications configured
- Deploy via Emergent platform Deploy button
