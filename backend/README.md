# Backend API Documentation & Setup Guide

Welcome to the backend service for **SIH26191**. This is a Node.js & Express RESTful API with MongoDB, JWT & Google OAuth 2.0 authentication, role-based access control (RBAC), and user management.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started & Setup](#getting-started--setup)
  - [1. Clone and Navigate](#1-clone-and-navigate)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Run the Application](#4-run-the-application)
- [Project Architecture & Structure](#project-architecture--structure)
- [API Endpoints & Documentation](#api-endpoints--documentation)
  - [Base URLs](#base-urls)
  - [Health Check](#health-check)
  - [Authentication Endpoints (`/api/v1/auth`)](#authentication-endpoints-apiv1auth)
  - [User Management Endpoints (`/api/v1/users`)](#user-management-endpoints-apiv1users)
- [Response & Error Format](#response--error-format)
- [Testing & Scripts](#testing--scripts)

---

## ✨ Features

- **Authentication & Authorization**:
  - Email/Password authentication with bcrypt password hashing.
  - JWT-based authentication (Access Token + Refresh Token flow via headers or HTTP-only cookies).
  - Google OAuth 2.0 integration with Passport.js.
  - Role-based authorization (`user`, `admin`).
- **User Management**:
  - Self-service profile fetch and update (`/me`).
  - Admin controls: paginated search/listing, view, update, and delete users.
- **Security & Validation**:
  - Request validation using Joi schemas.
  - HTTP header security with Helmet.
  - Rate limiting with Express Rate Limit.
  - Standardized error handling and responses.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Authentication**: JWT (`jsonwebtoken`), Passport (`passport`, `passport-google-oauth20`), `bcryptjs`
- **Validation**: [Joi](https://joi.dev/)
- **Logging**: Morgan & Winston

---

## ⚙️ Prerequisites

Ensure you have the following installed locally:

- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or a MongoDB Atlas connection URI)

---

## 🚀 Getting Started & Setup

### 1. Clone and Navigate

```bash
git clone <repository-url>
cd SIH26191/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to create a `.env` file:

```bash
cp .env.example .env
```

Open `.env` and configure your settings:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/my-nodejs-app

# JWT Secrets & Expiry
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_REFRESH_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN_DAYS=7

# Cookie & Password Hashing
COOKIE_SECRET=your_cookie_secret_key_here
BCRYPT_SALT_ROUNDS=10

# Google OAuth 2.0 (Optional for local testing)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

### 4. Run the Application

#### Development Mode (with auto-restart via nodemon)
```bash
npm run dev
```

#### Production Mode
```bash
npm start
```

The server will start listening at: `http://localhost:5000`

---

## 📂 Project Architecture & Structure

```
backend/
├── src/
│   ├── common/
│   │   ├── constants/       # HTTP status codes, messages
│   │   ├── middlewares/     # Error handler, validation, 404 handler
│   │   └── utils/           # ApiResponse, ApiError, asyncHandler, logger, JWT utils
│   ├── config/              # Database connection, passport OAuth setup
│   ├── features/
│   │   ├── auth/            # Auth controller, routes, service, validation, middleware
│   │   └── users/           # User controller, routes, service, repository, model, validation
│   ├── routes/              # Centralized route registration
│   ├── app.js               # Express application initialization
│   └── server.js            # Server entry point
├── .env.example
├── package.json
└── README.md
```

---

## 📖 API Endpoints & Documentation

### Base URLs
- **Health Check**: `http://localhost:5000/api/health`
- **API v1 Root**: `http://localhost:5000/api/v1`

---

### Health Check

#### `GET /api/health`
Checks server status and uptime.
- **Auth**: Public
- **Response**: `200 OK`
```json
{
  "status": "ok",
  "uptime": 12.345
}
```

---

### Authentication Endpoints (`/api/v1/auth`)

#### 1. Register User
`POST /api/v1/auth/register`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
  *(Note: Password must be minimum 8 characters and include at least 1 uppercase letter, 1 lowercase letter, and 1 digit).*
- **Response**: `201 Created`

#### 2. Login User
`POST /api/v1/auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "Password123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "662a...",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "authProvider": "local"
      },
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
  ```

#### 3. Refresh Access Token
`POST /api/v1/auth/refresh-token`
- **Auth**: Public (Requires refresh token via body or cookie)
- **Request Body** *(optional if sent via cookie)*:
  ```json
  {
    "refreshToken": "eyJhbGciOi..."
  }
  ```
- **Response**: `200 OK`

#### 4. Logout User
`POST /api/v1/auth/logout`
- **Auth**: Bearer Token / Authenticated
- **Response**: `200 OK`

#### 5. Get Current Session Info
`GET /api/v1/auth/me`
- **Auth**: Bearer Token / Authenticated
- **Response**: `200 OK`

#### 6. Google OAuth 2.0
- **Initiate Login**: `GET /api/v1/auth/google` (Redirects to Google Sign-In)
- **OAuth Callback**: `GET /api/v1/auth/google/callback` (Redirects to `${CLIENT_URL}/oauth/success?accessToken=...&refreshToken=...` or returns JSON if `?format=json`)

---

### User Management Endpoints (`/api/v1/users`)

> **Note**: All user endpoints require authentication. Include `Authorization: Bearer <accessToken>` header or access token cookie.

#### 1. Get Logged-in User Profile
`GET /api/v1/users/me`
- **Auth**: `user` or `admin`
- **Response**: `200 OK`

#### 2. Update Logged-in User Profile
`PATCH /api/v1/users/me`
- **Auth**: `user` or `admin`
- **Request Body**:
  ```json
  {
    "name": "John Updated",
    "avatar": "https://example.com/avatar.jpg"
  }
  ```
- **Response**: `200 OK`

#### 3. List Users (Admin Only)
`GET /api/v1/users`
- **Auth**: `admin`
- **Query Parameters**:
  - `page` *(optional, default: 1)*: Page number
  - `limit` *(optional, default: 10, max: 100)*: Items per page
  - `search` *(optional)*: Search query matching name or email
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Users fetched successfully",
    "data": {
      "users": [ ... ],
      "pagination": {
        "total": 50,
        "page": 1,
        "limit": 10,
        "totalPages": 5
      }
    }
  }
  ```

#### 4. Get User by ID (Admin Only)
`GET /api/v1/users/:id`
- **Auth**: `admin`
- **Response**: `200 OK`

#### 5. Update User by ID (Admin Only)
`PATCH /api/v1/users/:id`
- **Auth**: `admin`
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "avatar": "https://example.com/avatar.jpg"
  }
  ```
- **Response**: `200 OK`

#### 6. Delete User by ID (Admin Only)
`DELETE /api/v1/users/:id`
- **Auth**: `admin`
- **Response**: `200 OK`

---

## 📦 Standard Response & Error Format

### Success Response Format
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description message",
  "errors": [ ... ]
}
```

---

## 🧪 Available Scripts

Inside the `backend/` directory:

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Runs backend with nodemon hot-reloading |
| **Production Start** | `npm start` | Runs backend with standard Node runtime |
| **Testing** | `npm test` | Run test suite (Jest) |
