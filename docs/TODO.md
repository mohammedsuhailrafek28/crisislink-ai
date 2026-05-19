# TODO

## ✅ Completed
- [x] Verified the Expo app starts on port 8082 after dependency install
- [x] Installed react-native-web and react-dom for web support
- [x] Reconciled NestJS backend files and reorganized into `/backend/src/` structure
- [x] Created Expo Router route folders for `(auth)` and `(tabs)` in `/frontend/app/`
- [x] Organized frontend utilities into `/frontend/src/` (screens, components, store, lib, etc.)
- [x] Created comprehensive codebase organization guide
- [x] Created complete IMPLEMENTATION_ROADMAP.md with 8-phase plan
- [x] Analyzed app concept and feature gaps

## 🔄 PHASE 1: Core Auth & User Management (PRIORITY NOW)

### Progress
- [x] Added PostgreSQL `User` entity
- [x] Added auth controller/service for register, login, and current-user lookup
- [x] Added user controller/service for profile, search, follow, and unfollow
- [x] Added DTO validation and JWT/local strategies
- [ ] Wire frontend login/signup screens to the new backend endpoints
- [ ] Add a backend seed or migration for first-time local setup

### Backend Tasks
- [ ] Create User entity with all fields (email, password_hash, fullName, bio, profilePhoto, talentType, city, country, verified, etc.)
- [ ] Create password hashing utility (bcrypt)
- [ ] Implement `POST /auth/register` endpoint
- [ ] Implement `POST /auth/login` endpoint
- [ ] Implement `POST /auth/logout` endpoint
- [ ] Implement `GET /auth/me` endpoint (get current user)
- [ ] Implement `PATCH /users/:id/profile` endpoint
- [ ] Implement `GET /users/:id` endpoint (public profile)
- [ ] Implement `POST /users/follow/:id` endpoint
- [ ] Implement `POST /users/unfollow/:id` endpoint
- [ ] Implement `GET /users/search?q=name&skill=skill&city=city` endpoint
- [ ] Create DTOs for all endpoints (validation)
- [ ] Test all endpoints with Postman/Swagger

### Frontend Tasks
- [ ] Connect signup screen to `POST /auth/register`
- [ ] Connect login screen to `POST /auth/login`
- [ ] Implement JWT token storage in Zustand + SecureStore
- [ ] Create auth gate (redirect unauthed users to login)
- [ ] Create profile completion flow (5-step wizard)
- [ ] Display logged-in user info in header/profile
- [ ] Test end-to-end signup → login → home flow

### Database Tasks
- [ ] Create PostgreSQL database
- [ ] Run TypeORM migrations
- [ ] Verify schema created correctly
- [ ] Seed test data (optional)

### Checkpoints
- ✅ Can register new account
- ✅ Can login with credentials
- ✅ JWT stored in SecureStore
- ✅ Profile displays correctly after login
- ✅ Can update profile information

---

## 📅 PHASE 2: Social Feed (COMING NEXT)

- [ ] Post entity implementation
- [ ] Create post endpoint with image upload
- [ ] Feed infinite scroll endpoint
- [ ] Like/unlike endpoints
- [ ] Comment endpoints
- [ ] Frontend post creation modal
- [ ] Frontend feed UI with infinite scroll

---

## 📅 PHASE 3: Opportunities Board

- [ ] Expand Opportunity entity with missing fields
- [ ] Create opportunity endpoint
- [ ] List/filter opportunities endpoint
- [ ] Apply for opportunity endpoint
- [ ] View applications endpoint (employer)
- [ ] Accept/reject application
- [ ] Frontend UI for all above

---

## 📅 PHASE 4: Messaging & Chat

- [ ] Message entity
- [ ] Socket.IO room management
- [ ] Chat UI implementation
- [ ] Real-time message sync

---

## 📅 PHASE 5-8: Other Features

- [ ] Search & discovery
- [ ] Payments (Razorpay)
- [ ] Notifications (Firebase FCM)
- [ ] Collaborations (AI matching)

---

## 🔧 Infrastructure & Config

- [ ] Move backend controllers, services, and DTOs to proper `/backend/src/[module]/` folders
- [ ] Move frontend utilities from root `/src/` to `/frontend/src/`
- [ ] Update all import paths throughout codebase
- [ ] Create `.env.example` files for backend and frontend
- [ ] Delete old scattered root-level module files (auth.modules.ts, feed.modules.ts, etc.)
- [ ] Test backend startup: `cd backend && npm start`
- [ ] Test frontend startup: `cd frontend && npm start`
- [ ] Review npm audit report (26 vulnerabilities) and address if critical
- [ ] Set up Git branches (main, develop, feature branches)

---

## 🚀 Deployment & Release

- [ ] Set up PostgreSQL in production
- [ ] Configure environment variables for production
- [ ] Build APK using EAS or local build
- [ ] Test on physical Android device
- [ ] Deploy backend to production server
- [ ] Configure domain & SSL
- [ ] Set up monitoring & logging
