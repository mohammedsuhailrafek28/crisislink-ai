# Codebase Organization Guide

## 🏗️ Overall Structure

```
kinship_android/
├── backend/                    # NestJS REST API & WebSocket server
│   ├── src/
│   │   ├── app.module.ts      # Main application module
│   │   ├── main.ts            # Application entry point
│   │   ├── ai/                # AI embeddings & matching
│   │   ├── auth/              # JWT authentication
│   │   ├── collaborations/    # Collab matching & management
│   │   ├── feed/              # Posts, likes, comments
│   │   ├── messages/          # Real-time chat (Socket.IO)
│   │   ├── notifications/     # Push notifications (Firebase FCM)
│   │   ├── opportunities/     # Gigs & applications
│   │   ├── payments/          # Razorpay integration
│   │   ├── search/            # Talent search
│   │   ├── upload/            # AWS S3 file uploads
│   │   ├── users/             # User profiles & relationships
│   │   └── common/            # Shared utilities, guards, interceptors
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                   # React Native + Expo
│   ├── app/                   # Expo Router navigation structure
│   │   ├── _layout.tsx        # Root layout + providers
│   │   ├── index.tsx          # Auth gate (redirect to feed or onboarding)
│   │   ├── auth/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx
│   │   │   └── onboarding.tsx
│   │   ├── (tabs)/            # Bottom tab navigator
│   │   │   ├── _layout.tsx
│   │   │   ├── feed.tsx
│   │   │   ├── explore.tsx
│   │   │   ├── create.tsx
│   │   │   ├── gigs.tsx
│   │   │   ├── collabs.tsx
│   │   │   ├── messages.tsx
│   │   │   └── profile.tsx
│   │   ├── profile/[id].tsx   # User profile detail
│   │   ├── chat/[userId].tsx  # Message thread
│   │   ├── post/[id].tsx      # Post detail
│   │   ├── booking/[talentId].tsx
│   │   ├── notifications.tsx
│   │   └── ai-coach.tsx
│   │
│   ├── src/                   # React Native utilities & shared code
│   │   ├── screens/           # Screen components (re-exported from app routes)
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── store/             # Zustand state management
│   │   ├── lib/               # API client, utilities
│   │   ├── constants/         # Theme colors, strings
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Helper functions
│   │
│   ├── assets/                # Images, icons, fonts
│   ├── package.json
│   ├── tsconfig.json
│   ├── app.config.js          # Expo config
│   └── .env.example
│
├── docs/                      # Project documentation
│   ├── TODO.md               # Task tracking
│   ├── DEVELOPMENT_DIARY.md  # Development log
│   └── CODEBASE_ORG.md       # This file
│
├── assets/                    # Root-level assets (deprecated - use frontend/assets)
├── app.config.js              # Deprecated - use frontend/app.config.js
├── package.json              # Root monorepo package (meta only)
└── README.md                 # Project overview
```

## 📱 Frontend Structure Explained

### `/app` - Expo Router Routes
- **Root Layout** (`_layout.tsx`): Provides QueryClient, Gesture handlers, SafeArea, Socket.IO
- **Auth Gate** (`index.tsx`): Redirects to `(tabs)/feed` if authenticated, else `(auth)/onboarding`
- **Auth Stack** (`(auth)/_layout.tsx`): Registration and login flows
- **Tabs** (`(tabs)/_layout.tsx`): Bottom navigation for 7 main sections
- **Dynamic Routes**: Profile, chat, post details use `[id]` or `[userId]`

### `/src` - Utilities & Shared Code
- **screens/**: Screen component implementations (duplicate logic structure from app/)
- **components/**: Reusable UI building blocks (PostCard, UserCard, etc.)
- **hooks/**: Custom hooks for API queries, state synchronization
- **store/**: Zustand stores for auth, cache, UI state
- **lib/**: axios API client, Socket.IO initialization
- **constants/**: COLORS, FONTS, theme definitions
- **types/**: TypeScript interfaces for Post, User, etc.

## 🔧 Backend Structure Explained

Each module follows NestJS conventions:

```
ai/
├── ai.module.ts           # Module definition
├── ai.controller.ts       # API endpoints
├── ai.service.ts          # Business logic
├── ai-match.service.ts    # Sub-service for matching
├── ai-coach.service.ts    # Sub-service for coaching
├── entities/              # Database entities
│   ├── talent-embedding.entity.ts
│   └── ai-insight.entity.ts
└── dto/                   # Data Transfer Objects
    └── create-insight.dto.ts
```

### Key Modules:

| Module | Purpose | Key Entities |
|--------|---------|--------------|
| **ai** | Vector embeddings, collab matching, coaching tips | TalentEmbedding, AiInsight |
| **auth** | JWT, registration, login | - |
| **collaborations** | Talent matching, invite system | Collaboration, CollabMember |
| **feed** | Posts, likes, comments | Post, PostLike, Comment |
| **messages** | Real-time chat (Socket.IO) | Message |
| **notifications** | Push notifications (Firebase FCM + Bull queue) | Notification, DeviceToken |
| **opportunities** | Gig board, applications | Opportunity, OpportunityApplication |
| **payments** | Razorpay integration, subscriptions | Payment, Subscription |
| **search** | Talent search by skill/city/name | - (queries User) |
| **upload** | AWS S3 file uploads | - |
| **users** | User profiles, connections, skills | User, UserSkill, Connection, Review |

## 🔗 API Routes (v1)

All routes prefixed with `/api/v1`:

```
POST   /auth/register
POST   /auth/login
GET    /auth/me

GET    /feed
POST   /feed
POST   /feed/:id/like
POST   /feed/:id/comments

GET    /search/talent?q=&category=&city=

GET    /opportunities
POST   /opportunities/:id/apply

GET    /collaborations/suggested
POST   /collaborations

GET    /messages/:userId
WS     /chat (Socket.IO namespace)

POST   /notifications/register-token
GET    /notifications

POST   /payments/tip
POST   /payments/booking
POST   /payments/subscribe
POST   /payments/verify
```

## ✅ Migration Checklist

- [x] Created `/backend/src/` with all module structures
- [x] Created `/frontend/app/` with Expo Router routes
- [x] Organized `/frontend/src/` utilities
- [x] Moved entities to proper locations
- [ ] Move controllers, services, and DTOs from old locations
- [ ] Update all import paths to point to new backend structure
- [ ] Delete old scattered files at root level
- [ ] Create backend/.env.example
- [ ] Create frontend/.env.example
- [ ] Update package.json in backend and frontend

## 🚀 Next Steps

1. **Move remaining backend files** (controllers, services, DTOs) to `/backend/src/[module]/`
2. **Move frontend utilities** from `src/` to `frontend/src/`
3. **Update all import paths** throughout the codebase
4. **Create .env files** from examples
5. **Install backend dependencies** (`npm install` in `/backend/`)
6. **Install frontend dependencies** (`npm install` in `/frontend/`)
7. **Test backend startup**: `cd backend && npm start`
8. **Test frontend startup**: `cd frontend && npm start`

## 📝 Import Path Examples

**Before (Messy):**
```typescript
import { FeedService } from '../feed.modules';
import { User } from '../src/users/entities/user.entity';
```

**After (Organized):**
```typescript
// In backend code:
import { FeedService } from '@/feed/feed.service';
import { User } from '@/users/entities/user.entity';

// In frontend code:
import { useAuthStore } from '@/store/auth.store';
import { PostCard } from '@/components/PostCard';
```

---

**Last Updated:** May 17, 2026
