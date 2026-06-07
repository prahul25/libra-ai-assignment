# Libra AI — Expense Tracker

Full-stack expense tracking application with JWT authentication, category management, and analytics dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4, Recharts |
| Backend | Node.js, Express 4, Mongoose, JWT (access + refresh tokens) |
| Database | MongoDB Atlas |
| Auth | bcryptjs, JSON Web Tokens with rotation |

## Project Structure

```
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # UI components (Layout, Login, Register, Dashboard, ExpenseList, ExpenseForm, ExpenseFilter, PrivateRoute)
│   │   ├── context/         # React context providers (Auth, Theme, Toast)
│   │   ├── services/        # Axios API client with token refresh interceptor
│   │   ├── App.tsx          # Root component with routing
│   │   ├── main.tsx         # Entry point
│   │   ├── types.ts         # TypeScript interfaces
│   │   └── index.css        # Tailwind entry, theme CSS variables
│   ├── .env                 # VITE_API_URL for production builds
│   ├── vite.config.ts       # Vite config with Tailwind plugin and API proxy
│   └── package.json
│
├── server/                  # Express backend
│   ├── controllers/         # Route handlers (auth, expense, dashboard)
│   ├── middleware/          # JWT auth middleware
│   ├── models/              # Mongoose schemas (User, Expense)
│   ├── routes/              # Express routers (auth, expenses)
│   ├── config/              # Database connection
│   ├── index.js             # Server entry point
│   ├── Procfile             # Render deployment config
│   └── package.json
│
└── README.md
```

## Features

- **JWT Authentication** — Register, login, logout with access token (1h) and refresh token (7d) rotation
- **Expense CRUD** — Create, read, update, delete expenses with categories
- **Category Management** — Food, Transport, Shopping, Entertainment, Bills, Healthcare, Education, Other
- **Search & Filter** — Search by description, filter by category
- **Dashboard** — Total spending, monthly breakdown, bar chart, donut chart by category, recent transactions
- **Dark / Light Theme** — Persistent theme toggle with smooth transitions
- **Toast Notifications** — Success/error feedback with auto-dismiss
- **Responsive Design** — Mobile-friendly with glassmorphism UI
- **Pagination** — 10 expenses per page

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)

### Environment Variables

**Server** (`server/.env`):

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

**Client** (`client/.env` — optional, only for production builds):

```env
VITE_API_URL=https://your-backend-url.com
```

### Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Development

```bash
# Terminal 1 — Start backend (port 5000)
cd server
npm run dev

# Terminal 2 — Start frontend (port 3000, proxies /api → localhost:5000)
cd client
npm run dev
```

Open `http://localhost:3000` in your browser.

### Production Build

```bash
cd client
npm run build
# Output in client/dist/
```

## API Reference

All API endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Expenses

All expense endpoints require authentication (Bearer token).

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | List expenses (supports `search`, `category`, `page`, `limit`) |
| GET | `/api/expenses/dashboard` | Dashboard stats (total, monthly, recent) |
| GET | `/api/expenses/:id` | Get single expense |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

## Postman Collection

Import [`postman_collection.json`](./postman_collection.json) into Postman. Uses `{{base_url}}` variable — set it to `http://localhost:5000` (local) or `https://libra-ai-assignment.onrender.com` (production).

## Deployment

### Backend (Render)

1. Push repo to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com) → New Web Service
3. Connect your repo, set root to `server/`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`)
7. Deploy

### Frontend (Vercel / Netlify / Render Static)

1. Build: `cd client && npm run build`
2. Set `VITE_API_URL` to your backend URL during build
3. Deploy the `client/dist` folder

## License

MIT
