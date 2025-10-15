**Product Requirements Document (PRD)**

**Product Name**: KiwiMarket (MVP)

**Overview**:
KiwiMarket is a local-only web marketplace for trading unopened products with others nearby, benchmarked from Danggeun Market. The MVP version focuses on conveying the concept through a minimal and clean interface with basic core features, optimized for simplicity.

---

### 1. Goals
- Allow users to list unopened items for sale
- Enable real-time chat between nearby users
- Display a simple UI that demonstrates the concept of local delivery

---

### 2. Key Features (MVP Scope)

#### User Authentication
- Email-based authentication using Supabase Auth
- No guest browsing; users must be logged in to view or interact

#### Product Listing
- Users can post items for sale by inputting:
  - Title (text)
  - Description (text)
  - Price (number)
- No image upload, categorization, or tags in MVP

#### Location Filtering
- Users manually input their address during signup or onboarding
- Listings are only visible to users in the same manually-defined area (e.g. same neighborhood or district)
- No GPS, no automated geolocation

#### Communication
- Real-time 1:1 chat between buyers and sellers using Supabase Realtime
- Chat initiated from product detail pages
- Simple chat UI (text only)

#### Transaction & Delivery
- No in-app or online payment
- No transaction status tracking
- A "Request Delivery" button is shown for concept purposes only (no function)

---

### 3. Design Guidelines
- Background color: White
- Point color: Kiwi green (light green tone)
- Text: Black
- UI Elements: Sharp-cornered (not rounded)
- Layout: Card-style product listings
- Responsive: Mobile-friendly layout using flex/grid structure in Next.js

---

### 4. Tech Stack
- **Frontend**: Next.js
- **Backend/DB/Auth**: Supabase
- **Deployment**: Vercel

---

### 5. Out of Scope (MVP)
- Image uploads
- Payment system (Toss, Stripe, etc.)
- Delivery API integration
- Location permission/GPS tracking
- Ratings, reviews, or user profiles
- Push notifications

---

### 6. Success Criteria (for MVP)
- User can sign up and log in via email
- User can post a product with title, description, and price
- Other users in the same area can view that listing
- Users can start a real-time chat about a product
- UI displays delivery concept via button (non-functional)
- Clean, mobile-optimized, visually aligned with branding