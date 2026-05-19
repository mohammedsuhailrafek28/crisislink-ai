# 🚀 Kinship App - Implementation Roadmap

**Last Updated:** May 19, 2026  
**Project Status:** Core foundation ready, full feature implementation in progress

---

## 📱 App Concept

**Kinship** = LinkedIn for creative & non-technical talent

A professional talent network where:
- 🎤 **Singers, dancers, chefs, photographers, artists** find paid gigs
- 🤝 **Employers/hirers** post opportunities & hire talent
- 💬 **Talent connects** with peers, builds portfolio, gets discovered
- 🎯 **AI matching** for collaborations & opportunities
- 💰 **Payment system** for seamless transactions

---

## 🏗️ Architecture Overview

### **Tech Stack**
- **Backend:** NestJS (TypeScript) + PostgreSQL + TypeORM
- **Frontend:** React Native + Expo Router + Zustand (state management)
- **Real-time:** Socket.IO (messaging)
- **File Storage:** AWS S3
- **Payments:** Razorpay
- **Notifications:** Firebase FCM
- **AI:** Vector embeddings for talent matching

### **Database Schema**

```
┌─────────────────────────────────────┐
│           User                       │
├─────────────────────────────────────┤
│ id (UUID)                           │
│ email, password_hash                │
│ fullName, bio, profilePhoto         │
│ talentType (singer/dancer/chef)     │
│ city, country, verified             │
│ createdAt, updatedAt                │
└─────────────────────────────────────┘
        ↓ ↑
   (followers/following)
        
┌─────────────────────────────────────┐
│    Opportunity (Gig/Job)            │
├─────────────────────────────────────┤
│ id, posted_by (User FK)             │
│ title, description                  │
│ talentType, city, country           │
│ budgetFrom, budgetTo, currency      │
│ eventDate, duration, status         │
│ applicationCount                    │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│ OpportunityApplication              │
├─────────────────────────────────────┤
│ id, opportunity_id, applied_by      │
│ status (pending/accepted/rejected)  │
│ portfolio_url, cover_letter         │
│ appliedAt                           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│           Post (Feed)               │
├─────────────────────────────────────┤
│ id, created_by (User FK)            │
│ content, image_url, video_url       │
│ likes_count, comments_count         │
│ createdAt                           │
└─────────────────────────────────────┘
        ↓
┌─────────────────────────────────────┐
│    Comment & Like                   │
├─────────────────────────────────────┤
│ id, post_id, user_id                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         Message (Chat)              │
├─────────────────────────────────────┤
│ id, sender_id, receiver_id          │
│ content, isRead, createdAt          │
└─────────────────────────────────────┘
```

---

## 📋 Implementation Phases

### **PHASE 1: Core Authentication & User Management** ⚠️ IN PROGRESS

**Duration:** 1-2 weeks  
**Goal:** Users can signup, login, create profiles

#### Backend Tasks
- [x] User entity (TypeORM with all fields)
- [x] Auth module with JWT
- [ ] Register endpoint (`POST /auth/register`)
- [ ] Login endpoint (`POST /auth/login`)
- [ ] Get current user (`GET /auth/me`)
- [ ] Update profile (`PATCH /users/:id/profile`)
- [ ] Get public profile (`GET /users/:id`)
- [ ] Follow/unfollow endpoints
- [ ] Search users by skill/city
- [ ] Password reset flow

#### Frontend Tasks
- [ ] Connect signup screen to backend
- [ ] Connect login screen to backend
- [ ] Store JWT token in Zustand + SecureStore
- [ ] Auth gate (redirect unauthed users)
- [ ] Profile creation flow (5-step wizard)
- [ ] Display logged-in user info

#### Testing Checkpoints
- ✅ Can register new account
- ✅ Can login
- ✅ JWT token stored securely
- ✅ Profile displays correctly
- ✅ Can update profile

---

### **PHASE 2: Social Feed** 📅 PLANNED (Weeks 2-3)

**Goal:** Users can post content, see feed, like & comment

#### Backend Tasks
- [ ] Post entity with full fields
- [ ] Create post endpoint
- [ ] Get feed (infinite scroll, pagination)
- [ ] Like/unlike post
- [ ] Add comment
- [ ] Delete post/comment
- [ ] Media upload integration (S3)

#### Frontend Tasks
- [ ] Post creation modal
- [ ] Image picker & upload
- [ ] Feed infinite scroll
- [ ] Like button & animation
- [ ] Comment section
- [ ] Delete confirmation

#### Testing Checkpoints
- ✅ Can create post with text & image
- ✅ Can see feed from followed users
- ✅ Like/comment works real-time

---

### **PHASE 3: Opportunities (Gigs) Board** 📅 PLANNED (Weeks 3-4)

**Goal:** Employers post jobs, talent applies, hiring works end-to-end

#### Backend Tasks
- [x] Opportunity entity (already exists)
- [ ] Create opportunity endpoint
- [ ] List opportunities (with filters)
- [ ] Get opportunity details
- [ ] Apply for opportunity
- [ ] Employer view applications
- [ ] Accept/reject application
- [ ] Update opportunity status
- [ ] Archive/delete opportunity

#### Frontend Tasks
- [ ] Post opportunity flow (for employers)
- [ ] Browse opportunities with filters (skill, city, budget)
- [ ] Opportunity detail page
- [ ] Application form (cover letter, portfolio)
- [ ] My applications history
- [ ] For employers: applications review page

#### Testing Checkpoints
- ✅ Can post gig as employer
- ✅ Can filter opportunities
- ✅ Can apply as talent
- ✅ Employer can see applicants

---

### **PHASE 4: Messaging & Real-time Chat** 📅 PLANNED (Weeks 4-5)

**Goal:** Real-time messaging between users

#### Backend Tasks
- [ ] Message entity
- [ ] Socket.IO room management
- [ ] Save messages to DB
- [ ] Message history endpoint
- [ ] Mark as read
- [ ] Typing indicators

#### Frontend Tasks
- [ ] Chat list screen
- [ ] Chat room screen
- [ ] Real-time message display
- [ ] Message input
- [ ] Online status

#### Testing Checkpoints
- ✅ Can send message
- ✅ Receive message real-time
- ✅ Can see message history

---

### **PHASE 5: Search & Discovery** 📅 PLANNED (Weeks 5-6)

**Goal:** Advanced search for talent, opportunities, connections

#### Backend Tasks
- [ ] Vector search setup (embeddings)
- [ ] Full-text search implementation
- [ ] Talent discovery endpoint (with AI matching)
- [ ] Filter by skill, experience, rating

#### Frontend Tasks
- [ ] Advanced search filters
- [ ] Search results display
- [ ] Talent cards with quick preview
- [ ] Apply filter UI

#### Testing Checkpoints
- ✅ Can search by skill
- ✅ Can filter by city/budget
- ✅ Results load fast

---

### **PHASE 6: Payments & Subscriptions** 📅 PLANNED (Weeks 6-7)

**Goal:** Razorpay integration for hiring & payments

#### Backend Tasks
- [ ] Payment entity
- [ ] Create order endpoint
- [ ] Verify payment
- [ ] Webhook handling
- [ ] Subscription management
- [ ] Payout to talent

#### Frontend Tasks
- [ ] Hiring checkout flow
- [ ] Payment modal
- [ ] Invoice history
- [ ] Earnings dashboard (for talent)

#### Testing Checkpoints
- ✅ Can process payment
- ✅ Payment confirmation

---

### **PHASE 7: Notifications & Engagement** 📅 PLANNED (Weeks 7-8)

**Goal:** Firebase FCM push notifications

#### Backend Tasks
- [ ] Firebase FCM setup
- [ ] Notification entity
- [ ] Send notifications on key events
- [ ] Device token management

#### Frontend Tasks
- [ ] Request permission for push
- [ ] Handle notification taps
- [ ] Notification badge

---

### **PHASE 8: Collaborations (AI Matching)** 📅 PLANNED (Weeks 8-9)

**Goal:** AI suggests group projects

#### Backend Tasks
- [ ] Talent embedding vectors
- [ ] Collaboration AI matching
- [ ] Group project creation
- [ ] Member management

#### Frontend Tasks
- [ ] AI-matched suggestions
- [ ] Accept/decline collaboration
- [ ] Collaboration details

---

## 🎯 Current Status by Module

### ✅ Complete (Foundation)
- Project structure
- Expo Router navigation
- Backend module scaffolding
- Database connection configured
- Basic entities defined

### ⚠️ In Progress
- User entity fields
- Auth endpoints
- Frontend auth flow

### ❌ Not Started
- Controller implementations
- Service business logic
- Frontend screen connections
- API integration

---

## 🔧 Environment Setup

### Backend Environment Variables (`.env`)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=kinship
DB_PASS=kinship_password
DB_NAME=kinship_db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES=7d

# AWS S3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=kinship-uploads

# Razorpay
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx

# Firebase
FIREBASE_PROJECT_ID=xxx
FIREBASE_PRIVATE_KEY=xxx

# Node
NODE_ENV=development
API_PORT=3000
```

### Frontend Environment Variables (`.env.local`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## 📊 Success Metrics

### MVP (Minimum Viable Product)
- [ ] Users can signup/login
- [ ] Users can create profiles (skills, bio, photo)
- [ ] Users can post content to feed
- [ ] Employers can post opportunities
- [ ] Talent can apply for opportunities
- [ ] Messaging between users works
- [ ] App deployable as APK

### Phase 2 (Enhanced)
- [ ] Advanced search/discovery
- [ ] Payments working
- [ ] Push notifications
- [ ] AI-matching for collabs

### Phase 3 (Production Ready)
- [ ] Ratings & reviews
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Scaling & performance optimization

---

## 🚨 Known Gaps

1. **User Skills** – No M2M relationship for skills yet
2. **Ratings/Reviews** – Not in schema
3. **Verification** – Email verification not implemented
4. **File Uploads** – S3 not wired up yet
5. **Error Handling** – Need consistent error response format
6. **Validation** – Input validation DTOs needed
7. **Rate Limiting** – No rate limiting on API
8. **CORS** – Need to configure properly for frontend

---

## 🔗 Related Docs

- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) – Navigation & quick setup
- [TODO.md](TODO.md) – Task checklist
- [DEVELOPMENT_DIARY.md](DEVELOPMENT_DIARY.md) – Day-by-day progress
- [CODEBASE_ORG.md](CODEBASE_ORG.md) – File structure details

---

## 📞 Quick Commands

```bash
# Backend
cd backend && npm start                    # Run on port 3000

# Frontend
cd frontend && npm start                   # Expo dev server
npm run web                                # Web testing

# Database (assuming psql installed)
createdb kinship_db
psql -U kinship -d kinship_db < schema.sql

# Git
git add .
git commit -m "docs: add implementation roadmap"
git push origin main
```

---

**Next Action:** Start PHASE 1 → Build User entity + Auth endpoints
