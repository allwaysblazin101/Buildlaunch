# Build Launch - Renovation Job Marketplace PRD

## Original Problem Statement
Build a complete, professional renovation job marketplace website for "Build Launch". Platform where homeowners in Mississauga, Toronto, and Brampton can post renovation jobs, and contractors can browse and bid on those jobs for free. Escrow system for payments with 10% platform fee. Business phone: 416-697-1728.

## Architecture
- **Backend**: FastAPI + MongoDB
- **Frontend**: React + Tailwind CSS + Shadcn UI
- **Payment**: Stripe escrow integration
- **Auth**: JWT-based authentication

## User Personas
1. **Homeowners** - Post renovation jobs, fund escrow, accept bids, release payments
2. **Contractors** - Browse jobs, submit bids, get verified, receive payments

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

## What's Been Implemented (Jan 2025)
- Complete backend API (21 endpoints)
- Dark theme UI inspired by emergen.io
- Photo gallery on landing and job pages
- Homeowner & contractor dashboards
- Job posting with image upload
- Escrow payment flow with Stripe
- Contractor verification form
- In-app messaging
- Contact page with phone number

## P0 (Critical) - ✅ DONE
- User auth, job CRUD, bidding, payments, dashboards

## P1 (Important) - Backlog
- Email notifications
- Real-time chat updates
- Contractor profile public page

## P2 (Nice to Have) - Backlog
- Job categories filtering
- Search by contractor specialty
- Payment history export

## Next Tasks
- Implement email notifications for job updates
- Add contractor public profile page
- Real-time messaging with WebSocket
