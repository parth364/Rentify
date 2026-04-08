# 🏠 Rentify

> Campus-only peer-to-peer rental platform where students can list items, rent, chat, and leave reviews.

---

## 📂 Project Structure

```
rentify/
├── frontend/       → React (Vite) client app
├── backend/        → Node.js + Express API
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally (or a MongoDB Atlas URI)

### 1. Backend Setup

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Start dev server
npm run dev
```

Backend runs at: `http://localhost:4000`

### 2. Frontend Setup

```bash
cd frontend
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | List items (paginated, filterable) |
| GET | `/api/items/:id` | Get item details |
| POST | `/api/items` | Create item (auth) |
| PUT | `/api/items/:id` | Update item (owner) |
| DELETE | `/api/items/:id` | Delete item (owner) |

### Rentals
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rentals` | Create rental request |
| GET | `/api/rentals/mine` | Get my rentals |
| GET | `/api/rentals/received` | Get received requests |
| PATCH | `/api/rentals/:id/status` | Update rental status |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat` | Get conversations |
| GET | `/api/chat/:id` | Get messages |
| POST | `/api/chat/:id` | Send message |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Create review |
| GET | `/api/reviews/user/:userId` | Get user reviews |

---

## 🛡️ Security Features

- JWT authentication with bcrypt password hashing
- Helmet security headers
- Rate limiting on auth routes
- Zod input validation on all endpoints
- CORS configuration

---

## 🧰 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, React Router, Lucide Icons |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT + bcrypt |
| Validation | Zod |

---

## 📄 License

ISC
