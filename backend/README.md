# ⚙️ TaskFlow Backend API

RESTful API service built with **Express 5**, **Node.js**, **Mongoose 9**, **JWT authentication**, and **node-cron**.

## 📦 Features
- JWT Bearer Authentication with auto-protection middleware.
- Soft-delete architecture with automated cron purge (daily midnight purge for items in trash > 30 days).
- Centralized error handler and validation middleware using `express-validator`.
- Resilient MongoDB connection with local fallback.

## 🛠️ Environment Variables (.env)
```env
ENV=development
PORT=3000
SERVER_URL=http://localhost:3000
MONGO_URI=mongodb://127.0.0.1:27017/todoapp
JWT_SECRET=super_secret_jwt_key_todo_app_2026_!@#$
JWT_EXPIRES_IN=7d
```

## 🚀 Running the Server
```bash
# Install dependencies
npm install

# Start in development mode (with nodemon)
npm run dev

# Start in production mode
npm start
```
