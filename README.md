# ⚡ TaskFlow — Full-Stack Productivity & Task Manager

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Security-JWT%20%2B%20Bcrypt-FF6B6B" alt="Security" />
  <img src="https://img.shields.io/badge/Styling-Vanilla%20CSS%20Design%20System-6366F1" alt="Vanilla CSS" />
</p>

TaskFlow is a state-of-the-art, high-performance task management web application crafted with a modern MERN stack. Designed with a glassmorphic aesthetic, dark/light theme switching, intelligent priority tracking, subtask checklists, and a complete trash & recovery lifecycle.

---

## ✨ Key Features

- 🎨 **Glassmorphism & Rich Design System**: Bespoke Vanilla CSS design tokens with adaptive dark and light themes, smooth spring micro-animations, and ambient glowing backdrops.
- ⚡ **Instant Demo Access**: One-click demo login so anyone can try out the application immediately without creating credentials manually.
- 🎯 **Intelligent Productivity Analytics**: Real-time progress bar, completion rate calculation, active/completed counters, and motivational productivity status.
- 🔥 **Priorities & Categorization**:
  - Four priority levels: `Urgent` 🔥, `High` 🔴, `Medium` 🟡, and `Low` 🟢.
  - Six categories: `Work` 💼, `Personal` 👤, `Study` 📚, `Health` 🏃, `Finance` 💰, and `Ideas` 💡.
- 📋 **Subtasks & Checklist Progress**: Add granular checklist steps to any task, toggle progress inline, and view fractional step completion badges.
- 📅 **Relative Due Date Tracking**: Dynamic badges for `Overdue`, `Due Today`, `Tomorrow`, and upcoming days.
- 🔍 **Real-Time Filtering & Search**: Instant fuzzy title & description search, category filters, priority filters, status tabs (`All`, `In Progress`, `Completed`), and multiple sort orders.
- 🗑️ **Trash & Disaster Recovery System**:
  - Soft-deletion preserves deleted items with recovery capability.
  - Dedicated Trash Bin with single task restore, bulk restore, and permanent deletion.
  - Confirmation modals preventing accidental permanent deletion.
- ⏰ **Automated Cron Maintenance**: Built-in background cron job (using `node-cron`) automatically purges trash items older than 30 days every night at midnight.
- 🎉 **Confetti Celebrations**: Satisfying celebratory confetti bursts powered by `canvas-confetti` when conquering tasks.
- 🛡️ **Robust Security**: Password hashing with `bcryptjs`, JWT token authentication with auto-refresh / auto-expiry protection, and Express input validators.

---

## 📁 Project Architecture

```
To-do-App/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB connection & Cron job scheduler
│   │   ├── controller/      # Auth & Todo route controllers
│   │   ├── middleware/      # JWT auth, centralized error, & validation handlers
│   │   ├── models/          # Mongoose User & Todo schemas
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Business logic & database operations
│   │   ├── utils/           # ApiError, ApiResponse, asyncHandler, token generator
│   │   ├── validators/      # express-validator schemas
│   │   ├── app.js           # Express app setup & middleware
│   │   └── server.js        # Server bootstrap entry point
│   ├── .env.example         # Template for backend environment variables
│   ├── .gitignore           # Backend gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, TaskItem, TaskModal, ProductivityStats, ProtectedRoute
│   │   ├── context/         # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/           # Login, Signup, Todos, Trash
│   │   ├── services/        # Axios API client with bearer token interceptor
│   │   ├── App.jsx          # Route configuration
│   │   ├── index.css        # Core design system tokens & animations
│   │   └── main.jsx         # React DOM mount point
│   ├── index.html           # HTML template with Google Fonts (Outfit & Plus Jakarta Sans)
│   ├── .env.example         # Template for frontend environment variables
│   ├── .gitignore           # Frontend gitignore
│   └── package.json
│
├── .gitignore               # Root gitignore
└── README.md                # Project documentation
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port `27017` (e.g. `mongodb://127.0.0.1:27017/todoapp`) or a MongoDB Atlas connection string.

---

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

   Default `.env` configuration:
   ```env
   ENV=development
   PORT=3000
   SERVER_URL=http://localhost:3000
   MONGO_URI="mongodb://127.0.0.1:27017/todoapp"
   JWT_SECRET="super_secret_jwt_key_todo_app_2026_!@#$"
   JWT_EXPIRES_IN="7d"
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The backend will start on **`http://localhost:3000`**.

---

### 3. Frontend Setup

1. Open a second terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will start on **`http://localhost:5173`**.

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```
   Click **"Instant Demo Login"** to start exploring immediately!

---

## 🔌 API Endpoints Reference

### Authentication (`/v1`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/v1/register` | Register a new user | No |
| `POST` | `/v1/login` | Login and receive JWT token | No |
| `POST` | `/v1/logout` | Invalidate current session | Yes |

### Tasks & Productivity (`/v1/todos`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/v1/todos` | Fetch tasks (supports `search`, `category`, `priority`, `sort`) | Yes |
| `POST` | `/v1/todos` | Create a new task (with priority, category, due date, subtasks) | Yes |
| `GET` | `/v1/todos/:id` | Fetch task details by ID | Yes |
| `PATCH` | `/v1/todos/:id` | Update task fields (completed, title, notes, priority, subtasks) | Yes |
| `DELETE` | `/v1/todos/:id` | Soft-delete task (move to trash) | Yes |

### Trash Management (`/v1/todos`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/v1/todos/trash` | View all soft-deleted tasks | Yes |
| `PATCH` | `/v1/todos/restore/:id` | Restore a single deleted task | Yes |
| `PATCH` | `/v1/todos/restore-all` | Restore all trash tasks | Yes |
| `DELETE` | `/v1/todos/permanent/:id` | Permanently delete a task from database | Yes |
| `DELETE` | `/v1/todos/empty-trash` | Permanently clear the entire trash bin | Yes |

---

## 🧪 Testing & Verification

- **Production Build Check**:
  ```bash
  cd frontend
  npm run build
  ```
  *(Verified build passes in under 500ms with zero errors).*

- **Database Health Check**:
  Visit `http://localhost:3000/` in your browser. You will receive:
  ```json
  {
    "success": true,
    "message": "Todo API is running smoothly",
    "timestamp": "2026-11-01T..."
  }
  ```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
