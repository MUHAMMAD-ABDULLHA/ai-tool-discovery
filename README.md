# AI Tool Discovery Platform

A production-ready, full-stack web application for discovering, curating, and managing AI tools. Built with React 19, Express 5, MongoDB, and modern tooling.

---

## Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Authentication & Authorization](#authentication--authorization)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend       │────▶│   Database      │
│   (React 19)    │     │   (Express 5)   │     │   (MongoDB)     │
│   Vite + TS     │     │   REST API      │     │   Mongoose      │
│   Redux Toolkit │     │   JWT Auth      │     │   Aggregations  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   External      │
                       │   Services      │
                       │  - Stripe       │
                       │  - Cloudinary   │
                       └─────────────────┘
```

**Design Principles**
- **Separation of concerns**: Routes → Controllers → Models → Services
- **Defense in depth**: Middleware for auth, validation, error handling
- **Observability**: Structured logging, analytics events, health checks
- **Security first**: Helmet-ready, CORS configured, rate-limit ready, input sanitization

---

## Features

### 🔍 Discovery & Search
| Feature | Description | Endpoint |
|---------|-------------|----------|
| **Full-text Search** | Search across name, description, category with regex | `GET /tools?search=` |
| **Category Filtering** | Browse tools by category | `GET /tools/category/:category` |
| **Smart Recommendations** | Top-rated tools per category, excluding current | `GET /tools/recommendations` |
| **Pagination-ready** | Cursor-based or offset pagination (extendable) | — |
| **Trending/Featured** | Admin-curated featured tools sort first | `GET /tools` |

### 🛠 Tool Management (Creators)
| Feature | Description | Endpoint |
|---------|-------------|----------|
| **Submit Tool** | Name, logo, category, description, pricing, use cases, integrations, link | `POST /tools` |
| **My Tools Dashboard** | List, edit, delete own submissions | `GET /tools/user/my-tools` |
| **Update Tool** | Partial updates with protected field guards | `PUT /tools/:id` |
| **Delete Tool** | Cascades to reviews, analytics | `DELETE /tools/:id` |
| **Tool Analytics** | Impressions, clicks, daily views (30d), reviews | `GET /tools/:id/analytics` |

### ⭐ Reviews & Ratings
| Feature | Description | Endpoint |
|---------|-------------|----------|
| **Create Review** | 1-5 stars + text, one per user per tool | `POST /reviews/tools/:toolId` |
| **Update/Delete Own** | Author-only mutations | `PUT/DELETE /reviews/:reviewId` |
| **Helpful Votes** | Community curation signal | `PUT /reviews/:reviewId/helpful` |
| **Report Review** | Flag spam/inappropriate content | `POST /reviews/:reviewId/report` |
| **Admin Moderation** | Approve/hide, bulk delete, view reported | `/admin/reviews/*` |

### 📚 Bookmarks & Collections
| Feature | Description | Endpoint |
|---------|-------------|----------|
| **Create Collection** | Named, user-scoped collections | `POST /bookmarks` |
| **Add/Remove Tools** | Manage collection contents | `POST /bookmarks/add-tool`, `remove-tool` |
| **List Collections** | All user collections with counts | `GET /bookmarks` |
| **Delete Collection** | Removes collection and references | `DELETE /bookmarks/:collectionId` |

### 💳 Monetization & Payments
| Feature | Description | Endpoint |
|---------|-------------|----------|
| **Premium Listings** | Featured placement via Stripe Checkout | `POST /payments/checkout` |
| **Webhook Handling** | `checkout.session.completed` → auto-feature | `POST /payments/webhook` |
| **Payment Status** | Poll session status | `GET /payments/status/:sessionId` |
| **Affiliate Links** | Admin-managed per-tool tracking URLs | `PUT /admin/monetization/affiliate/:id` |
| **Sponsored Tools** | Admin-curated sponsored placements | `/admin/monetization/sponsored/*` |

### 👑 Admin Panel
| Domain | Capabilities |
|--------|--------------|
| **Tool Moderation** | List all, pending queue, approve/reject with reason, edit content, delete |
| **User Management** | List users, ban/unban with audit trail, verify/unverify creators |
| **Category Management** | CRUD categories, reorder, deactivate |
| **Analytics Dashboard** | Platform stats, tool popularity, signups over time, bounce rate, top searches, traffic, review stats |
| **Content Moderation** | Flagged content queue, tool reports, review reports |
| **Monetization Control** | Featured/sponsored management, affiliate links |

### 🔐 Authentication & Security
| Feature | Implementation |
|---------|----------------|
| **JWT Access Tokens** | Short-lived (1d), signed with RS256-ready secret |
| **Refresh Tokens** | HttpOnly cookie + DB storage, rotation on use (7d) |
| **Role-Based Access** | `user`, `startup`, `admin` with middleware guards |
| **Password Security** | bcryptjs, 12 rounds, timing-safe comparison |
| **Account Protection** | Ban status, active/inactive status, admin creation only |
| **Input Validation** | Mongoose schema validation, regex email, min-length password |

### 📊 Analytics & Observability
- **Tool-level**: Impressions, clicks, conversions, daily views (30d aggregation)
- **Platform-level**: Signups, traffic, bounce rate, top search queries, review velocity
- **Event-driven**: `ToolAnalytics` collection with `eventType` enum for extensibility

### 🖼 Asset Management
- **Cloudinary Integration**: Signed uploads, transformations, optimized delivery
- **Multi-format**: Logos, screenshots, demo videos
- **CDN-ready**: Automatic format/quality optimization

---

## Tech Stack

### Frontend
| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 19.1.1 |
| Build Tool | Vite | 7.1.2 |
| State Management | Redux Toolkit + Redux Persist | 2.11.0 / 6.0.0 |
| Alternative State | Zustand | 5.0.8 |
| Routing | React Router DOM | 7.8.2 |
| Styling | Tailwind CSS v4 + PostCSS | 4.1.13 |
| HTTP Client | Axios | 1.11.0 |
| Charts | Recharts | 3.5.1 |
| Icons | Lucide React | 0.555.0 |
| Linting | ESLint 9 + React Hooks/Refresh plugins | 9.33.0 |

### Backend
| Category | Technology | Version |
|----------|------------|---------|
| Runtime | Node.js | ≥18 (ESM) |
| Framework | Express | 5.1.0 |
| Database | MongoDB + Mongoose | 8.17.1 |
| Auth | JWT (jsonwebtoken) + bcryptjs | 9.0.2 / 3.0.2 |
| Payments | Stripe | 20.0.0 |
| Media | Cloudinary | 2.8.0 |
| Uploads | Multer | 2.0.2 |
| Config | dotenv | 17.2.1 |
| Dev Tooling | Nodemon | — |

---

## Project Structure

```
ai-tool-discovery/
├── backend/
│   ├── controllers/          # Request handlers, business logic
│   │   ├── adminController.js
│   │   ├── analyticsController.js
│   │   ├── bookmarkController.js
│   │   ├── monetizationController.js
│   │   ├── paymentController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT verify, role guards, refresh
│   ├── model/                # Mongoose schemas
│   │   ├── Tool.js
│   │   ├── User.js
│   │   ├── Review.js
│   │   ├── ToolAnalytics.js
│   │   ├── Bookmark.js
│   │   ├── Category.js
│   │   ├── Payment.js
│   │   ├── Newsletter.js
│   │   ├── Asset.js
│   │   ├── ToolReport.js
│   │   └── SearchQuery.js
│   ├── routes/               # API route definitions
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookmarkRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── newsletterRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── toolAnalyticsRoutes.js
│   │   ├── toolRoutes.js
│   │   └── assetRoutes.js
│   ├── cloudinary/
│   │   └── config.js
│   ├── db/
│   │   └── db.js
│   ├── uploads/              # Local temp storage (dev)
│   ├── server.js             # App entry, middleware, route mounting
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instances, endpoint wrappers
│   │   ├── components/       # Reusable UI components
│   │   │   ├── LandingPage/
│   │   │   ├── Tools/
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ProtectedLayout.jsx
│   │   │   ├── Bookmarks.jsx
│   │   │   ├── ToolList.jsx
│   │   │   ├── ToolDetail.jsx (page)
│   │   │   ├── ToolForm.jsx
│   │   │   ├── ToolEditModal.jsx
│   │   │   ├── SaveToolModal.jsx
│   │   │   ├── PremiumListingModal.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── Newsletter.jsx
│   │   │   └── ToolRecommendations.jsx
│   │   ├── hooks/            # Custom React hooks (RTK Query style)
│   │   │   ├── Tools.js
│   │   │   ├── Bookmarks.js
│   │   │   ├── Auth.js
│   │   │   └── Analytics.js
│   │   ├── pages/            # Route-level components
│   │   │   ├── Login.jsx
│   │   │   ├── Registration.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreatorDashboard.jsx
│   │   │   ├── ToolDetail.jsx
│   │   │   ├── ToolAnalytics.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── slices/           # Redux Toolkit slices
│   │   │   ├── authSlice.js
│   │   │   ├── toolSlice.js
│   │   │   ├── bookmarkSlice.js
│   │   │   ├── assetSlice.js
│   │   │   └── analyticsSlice.js
│   │   ├── store/            # Redux store config + persistence
│   │   │   ├── store.js
│   │   │   ├── AuthStore.js
│   │   │   ├── ToolStore.js
│   │   │   ├── BookmarkStore.js
│   │   │   ├── AssetStore.js
│   │   │   └── AnalyticsStore.js
│   │   ├── App.jsx           # Route definitions
│   │   ├── main.jsx          # Entry point
│   │   ├── index.css         # Tailwind imports
│   │   └── App.css
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── eslint.config.js
│   └── package.json
│
├── AI_Tool_Discovery_Platform_Scope_Document.md
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB ≥ 6 (local or Atlas)
- Stripe account (for payments)
- Cloudinary account (for assets)

### Installation

```bash
# Clone and install dependencies
git clone <repo-url>
cd ai-tool-discovery

# Backend
cd backend
npm install
cp .env.example .env   # See Environment Variables below

# Frontend
cd ../frontend
npm install
```

### Development

```bash
# Terminal 1: Backend (port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

### Production Build

```bash
# Frontend
cd frontend
npm run build    # Outputs to dist/

# Backend
cd backend
npm start        # Runs server.js
```

---

## Environment Variables

### Backend (`backend/.env`)

```bash
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-tool-discovery

# JWT (use strong secrets in production!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=1d
REFRESH_TOKEN_SECRET=your-refresh-secret-different-from-jwt
REFRESH_TOKEN_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (for CORS, redirects)
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## API Reference

### Base URL
```
Development:  http://localhost:5000
Production:   https://api.yourdomain.com
```

### Authentication
All protected routes require `Authorization: Bearer <access_token>` header.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **Auth** |
| POST | `/auth/register` | Public | Register user (user/startup) |
| POST | `/auth/login` | Public | Login, returns access + refresh tokens |
| POST | `/auth/refresh` | Public | Rotate refresh token, issue new access |
| GET | `/auth/profile` | Required | Current user profile |
| POST | `/auth/logout` | Required | Revoke refresh token |
| **Tools (Public)** |
| GET | `/tools` | Public | List approved tools (search, sort) |
| GET | `/tools/recommendations` | Public | Smart recommendations |
| GET | `/tools/category/:category` | Public | Filter by category |
| GET | `/tools/:id` | Public | Single tool detail |
| **Tools (Creator)** |
| POST | `/tools` | Required | Submit new tool |
| GET | `/tools/user/my-tools` | Required | My submissions |
| PUT | `/tools/:id` | Owner | Update own tool |
| DELETE | `/tools/:id` | Owner | Delete own tool |
| GET | `/tools/:id/analytics` | Owner | Tool analytics dashboard |
| POST | `/tools/:id/report` | Required | Report tool |
| **Reviews** |
| GET | `/reviews/tools/:toolId` | Public | Tool reviews |
| POST | `/reviews/tools/:toolId` | Required | Create review |
| PUT | `/reviews/:reviewId` | Author | Update review |
| DELETE | `/reviews/:reviewId` | Author | Delete review |
| PUT | `/reviews/:reviewId/helpful` | Required | Mark helpful |
| POST | `/reviews/:reviewId/report` | Required | Report review |
| GET | `/reviews/users/me/reviews` | Required | My reviews |
| **Bookmarks** |
| POST | `/bookmarks` | Required | Create collection |
| POST | `/bookmarks/add-tool` | Required | Add tool to collection |
| POST | `/bookmarks/remove-tool` | Required | Remove tool from collection |
| GET | `/bookmarks` | Required | List my collections |
| DELETE | `/bookmarks/:collectionId` | Required | Delete collection |
| **Payments** |
| POST | `/payments/checkout` | Required | Create Stripe Checkout session |
| POST | `/payments/webhook` | Stripe | Webhook handler |
| GET | `/payments/status/:sessionId` | Required | Check payment status |
| **Newsletter** |
| POST | `/newsletter` | Public | Subscribe email |
| **Categories** |
| GET | `/categories` | Public | List all categories |
| **Admin** (requires `admin` role) |
| GET | `/admin/tools` | Admin | All tools (any status) |
| GET | `/admin/tools/pending` | Admin | Pending moderation |
| PUT | `/admin/tools/:id/approve` | Admin | Approve tool |
| PUT | `/admin/tools/:id/reject` | Admin | Reject with reason |
| PUT | `/admin/tools/:id` | Admin | Edit any tool |
| DELETE | `/admin/tools/:id` | Admin | Delete any tool |
| GET | `/admin/users` | Admin | List users |
| PUT | `/admin/users/:id/ban` | Admin | Ban user |
| PUT | `/admin/users/:id/unban` | Admin | Unban user |
| PUT | `/admin/users/:id/verify` | Admin | Verify creator |
| PUT | `/admin/users/:id/unverify` | Admin | Unverify creator |
| GET | `/admin/flagged-content` | Admin | Flagged queue |
| GET | `/admin/reports` | Admin | Tool reports |
| GET | `/admin/categories` | Admin | All categories |
| POST | `/admin/categories` | Admin | Create category |
| PUT | `/admin/categories/:id` | Admin | Update category |
| DELETE | `/admin/categories/:id` | Admin | Delete category |
| GET | `/admin/analytics/*` | Admin | Platform analytics |
| GET/PUT/DELETE | `/admin/monetization/*` | Admin | Featured/sponsored/affiliate |
| GET/PUT | `/admin/reviews/*` | Admin | Review moderation |

### Response Format

```json
// Success
{ "data": { ... }, "meta": { "page": 1, "total": 100 } }

// Error
{ "error": "Human-readable message", "code": "ERROR_CODE", "details": {} }
```

---

## Authentication & Authorization

### Token Flow

```
┌─────────┐     ┌──────────────┐     ┌──────────────┐
│ Client  │────▶│  /auth/login │────▶│ Access Token │ (1d, JWT)
└─────────┘     └──────────────┘     └──────────────┘
                   │                        │
                   │ Refresh Token          │ Authorization Header
                   │ (HttpOnly Cookie + DB) │
                   ▼                        ▼
            ┌──────────────┐         ┌──────────────┐
            │ /auth/refresh│────────▶│ New Access   │
            └──────────────┘         └──────────────┘
```

### Roles & Permissions

| Role | Can Submit Tools | Can Access Admin | Can Manage Payments | Can Moderate |
|------|------------------|------------------|---------------------|--------------|
| `user` | ❌ | ❌ | ❌ | ❌ |
| `startup` | ✅ | ❌ | ✅ (own) | ❌ |
| `admin` | ✅ | ✅ | ✅ (all) | ✅ |

### Middleware Chain

```javascript
// authMiddleware.js
authenticateToken    // Validates JWT, attaches req.user
requireRole(["admin"])  // Guards admin routes
refreshToken         // Handles token rotation
```

---

## Deployment

### Docker (Recommended)

```dockerfile
# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  mongo:
    image: mongo:7
    volumes: [mongo-data:/data/db]
  backend:
    build: ./backend
    env_file: ./backend/.env
    depends_on: [mongo]
  frontend:
    build: ./frontend
    ports: ["80:80"]
    depends_on: [backend]
volumes:
  mongo-data:
```

### Manual Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong, unique `JWT_SECRET` and `REFRESH_TOKEN_SECRET` (≥32 chars)
- [ ] Configure MongoDB with authentication, TLS
- [ ] Set up Stripe webhook endpoint (`/payments/webhook`)
- [ ] Configure Cloudinary signed uploads
- [ ] Enable CORS for production domain only
- [ ] Set up reverse proxy (Nginx/Traefik) with SSL
- [ ] Configure logging (Winston/Pino) + log aggregation
- [ ] Set up monitoring (Prometheus/Grafana or Datadog)
- [ ] Run `npm run build` on frontend, serve static files via CDN

---

## Contributing

1. **Branch naming**: `feat/`, `fix/`, `chore/`, `docs/` + short description
2. **Commits**: Conventional Commits (`feat: add tool recommendations`)
3. **PRs**: 
   - Link related issue
   - Include screenshots for UI changes
   - Ensure `npm run lint` passes (both frontend/backend)
   - Add tests for new endpoints
4. **Code Style**:
   - ESLint + Prettier (configured)
   - TypeScript-style JSDoc for complex functions
   - No `any` types in frontend

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- Inspired by [There's An AI For That](https://theresanaiforthat.com/)
- Built with ❤️ using React, Express, MongoDB, and the open-source ecosystem