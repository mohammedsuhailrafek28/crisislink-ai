# 📋 Codebase Structure at a Glance

## Quick Navigation

### 🔧 Backend (NestJS REST API + WebSocket)
```
backend/src/
├── app.module.ts          # Root module (imports all feature modules)
├── main.ts                # App initialization, port 3000
│
├── ai/                    # Vector embeddings, AI matching, coaching
├── auth/                  # JWT authentication, Passport strategies
├── collaborations/        # Talent matching, group projects
├── feed/                  # Posts, likes, comments (infinite scroll)
├── messages/              # Real-time chat (Socket.IO on /chat)
├── notifications/         # Firebase FCM push + Bull queue
├── opportunities/         # Gigs board, applications, hiring
├── payments/              # Razorpay orders, subscriptions
├── search/                # Talent discovery search
├── upload/                # AWS S3 integration
└── users/                 # User profiles, connections, skills
```

**To work on backend:**
```bash
cd backend
npm install
npm start               # Runs on http://localhost:3000/api/v1
```

**API Documentation:** http://localhost:3000/docs (Swagger)

---

### 📱 Frontend (React Native + Expo Router)
```
frontend/
├── app/                   # Expo Router - Navigation structure
│   ├── _layout.tsx       # Root layout, providers setup
│   ├── index.tsx         # Auth gate (redirect logic)
│   ├── (auth)/           # Auth screens (Stack)
│   │   ├── onboarding.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/           # Main app (Bottom tabs)
│   │   ├── feed.tsx
│   │   ├── explore.tsx
│   │   ├── create.tsx
│   │   ├── gigs.tsx
│   │   ├── collabs.tsx
│   │   ├── messages.tsx
│   │   └── profile.tsx
│   ├── profile/[id].tsx  # Dynamic routes
│   ├── chat/[userId].tsx
│   ├── post/[id].tsx
│   └── booking/[talentId].tsx
│
├── src/
│   ├── screens/          # Screen component logic (exported in app/)
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks (useQuery, useMutation, etc.)
│   ├── store/           # Zustand state management
│   │   └── auth.store.ts (user state, login, logout)
│   ├── lib/             # API client, Socket.IO setup
│   ├── constants/       # COLORS, FONTS, theme
│   ├── types/           # TypeScript interfaces
│   └── utils/           # Helper functions
│
└── app.config.js        # Expo configuration
```

**To work on frontend:**
```bash
cd frontend
npm install
npm start               # Press 'w' for web (http://localhost:8081)
                        # Press 'a' for Android emulator
                        # Press 'i' for iOS simulator
                        # Scan QR for Expo Go on device
```

---

## 🔄 Development Workflow

### Adding a New Backend Module
1. Create folder: `backend/src/[feature]/`
2. Add files:
   ```
   [feature]/
   ├── [feature].module.ts
   ├── [feature].controller.ts
   ├── [feature].service.ts
   ├── entities/
   │   └── [entity].entity.ts
   ├── dto/
   │   └── create-[feature].dto.ts
   └── __tests__/
       └── [feature].service.spec.ts
   ```
3. Import in `app.module.ts` imports array
4. Use `@nestjs/swagger` decorators for API docs

### Adding a Frontend Feature
1. Create route file: `frontend/app/[feature].tsx`
2. Create component in `frontend/src/components/`
3. If needed, create hook in `frontend/src/hooks/`
4. Use existing stores or create new in `frontend/src/store/`
5. Reference in app layout if adding new navigation tab

---

## 🔗 Connection Points

### Frontend ↔ Backend Communication
1. **REST API**: `frontend/src/lib/api.ts` (axios client)
   ```typescript
   GET  /api/v1/feed
   POST /api/v1/feed (create post)
   POST /api/v1/feed/:id/like
   ```

2. **WebSocket**: `frontend/src/lib/socket.ts` (Socket.IO client)
   ```typescript
   emit('send_message', { receiverId, content })
   on('new_message', (msg) => {})
   on('user_typing', (data) => {})
   ```

3. **Push Notifications**: Device registers FCM token
   ```typescript
   POST /api/v1/notifications/register-token
   { token: "...", platform: "ios" | "android" }
   ```

---

## 📦 Dependencies

### Backend (`backend/package.json`)
- `@nestjs/*` - Framework & modules
- `@nestjs/bull` - Job queue for notifications, AI jobs
- `typeorm` - Database ORM
- `firebase-admin` - Push notifications
- `razorpay` - Payment processing
- `socket.io` - Real-time chat
- `@nestjs/swagger` - API documentation

### Frontend (`frontend/package.json`)
- `expo` - Development platform
- `expo-router` - File-based routing
- `react-native` - Framework
- `zustand` - State management
- `@tanstack/react-query` - Data fetching & caching
- `axios` - HTTP client
- `socket.io-client` - Real-time chat client

---

## ⚙️ Environment Variables

### Backend (`.env`)
```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=kinship
DB_PASS=kinship
DB_NAME=kinship_db

JWT_SECRET=your-secret-key-here
JWT_EXPIRES=7d

RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'

OPENAI_API_KEY=sk-...

AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
S3_BUCKET=kinship-media-prod

NODE_ENV=development
PORT=3000
```

### Frontend (`.env` / `.env.local`)
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000/api/v1    # Android emulator
# or
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1   # Web
```

---

## 🚀 Common Commands

```bash
# Backend
cd backend && npm start                     # Start API server
npm run typeorm:migration:generate          # Generate DB migration
npm run typeorm:migration:run               # Run migrations
npm test                                    # Run tests

# Frontend
cd frontend && npm start                    # Start dev server
npm run web                                 # Run on web (port 8081)
npm run build:apk                           # Build APK for Android
npm run build:aab                           # Build AAB for Play Store
npm run build:ios                           # Build for iOS

# Testing
npm test                                    # Both layers
npm test --watch                            # Watch mode

# Deployment
# Backend: GitHub Actions → ECR → ECS
# Frontend: EAS Build → App Store / Play Store
git push origin main                        # Triggers CI/CD
```

---

## 📖 Documentation

- **[CODEBASE_ORG.md](./CODEBASE_ORG.md)** - Detailed module descriptions
- **[REORGANIZATION_SUMMARY.md](./REORGANIZATION_SUMMARY.md)** - Before/after structure
- **[API README](../backend/README.md)** - Backend-specific setup
- **[App README](../frontend/README.md)** - Frontend-specific setup

---

**Last Updated:** May 17, 2026 | **Version:** 1.0 (Reorganized)
