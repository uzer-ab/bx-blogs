# BlogHub - Full Stack Blog Application

A full-stack blog platform built with React, Redux, Node.js, Express, and MongoDB. Features include user authentication with JWT sessions, rich text editing with Quill, and Material-UI design.

### Live at:

`https://uzzair/online`

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with session management
- **Rich Text Editor**: Create and edit blog posts with Quill WYSIWYG editor
- **Blog Management**: Create, read, update, and delete blog posts
- **Authorization**: Only blog owners can edit/delete their posts
- **Pagination**: Efficient data loading with pagination support
- **Responsive Design**: Mobile-first design using Material-UI components
- **Session Management**: Token-based sessions with revocation support
- **Form Validation**: Client-side validation for better UX

## 📋 Tech Stack

### Frontend

- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router v7** - Client-side routing
- **Material-UI (MUI)** - Component library
- **Tailwind CSS v4** - Utility-first CSS
- **React Quill** - Rich text editor
- **Axios** - HTTP client
- **Vite** - Build tool

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing

## 🏗️ Architecture

### Authentication Flow

1. User registers/logs in
2. Server generates JWT token and creates a session in MongoDB
3. Token is sent to client and stored in Redux state + localStorage
4. Each API request includes token in Authorization header
5. Server validates token and checks if session is active
6. Sessions can be revoked anytime (logout)

### Authorization

- All users can view blog posts
- Only authenticated users can create posts
- Only post owners can edit/delete their own posts
- Protected routes redirect to login if not authenticated

### State Management

- **Redux Slices**:
  - `authSlice`: User authentication state and token
  - `blogSlice`: Blog posts and pagination data
- **Persistence**: Auth state synced with localStorage
- **Session Check**: Silent authentication check on app mount

## 📁 Project Structure

```
├── backend/
|   ├── ...
|   ├── ...
├── client/
|   ├── ...
|   ├── ...
└── README.md

```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file:

```
    DATABASE_URL=
    JWT_SECRET=
    PORT=1234
```

4. Start the server: `npm start`

The backend will run on `http://localhost:1234`

### Frontend Setup

1. Navigate to client directory: `cd client`
2. Install dependencies: `npm install`
3. Create `.env` file:

```
    API_URL=
    MODE="development"
```

The frontend will run on `http://localhost:5173`

## 📡 API Documentation

Base URL: `http://localhost:1234/api/v1`

### Authentication Endpoints

#### Register User

```
POST /auth/register
Content-Type: application/json

{
"name": "John Doe",
"email": "john@example.com",
"password": "12345"
}
```

**Response:**

```
{
"success": true,
"message": "User Created!",
"data": {
"_id": "694dd2a84adf4d18cb9a9edd",
"name": "John Doe",
"email": "john@example.com",
"is_active": true,
"createdAt": "2025-12-26T00:11:20.964Z",
"updatedAt": "2025-12-26T00:11:20.964Z"
}
}
```

#### Login

```
POST /auth/login
Content-Type: application/json

{
"email": "john@example.com",
"password": "12345"
}
```

**Response:**

```
{
"success": true,
"message": "Login Successful",
"data": {
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"_id": "694dd2a84adf4d18cb9a9edd",
"name": "John Doe",
"email": "john@example.com",
"is_active": true
}
}
}
```

#### Check Session

```
GET /auth/session
Authorization: Bearer {token}
```

**Response:**

```
{
"success": true,
"message": "OK",
"data": {
"user": {
"_id": "694dd2a84adf4d18cb9a9edd",
"name": "John Doe",
"email": "john@example.com"
}
}
}
```

#### Logout

```
GET /auth/logout
Authorization: Bearer {token}
```

### Blog Endpoints

#### Create Blog

```
POST /blogs
Authorization: Bearer {token}
Content-Type: application/json

{
"title": "My First Blog",
"content": "<p>This is the blog content</p>"
}
```

**Response:**

```
{
"success": true,
"message": "OK",
"data": {
"blog": {
"_id": "694dd30f4adf4d18cb9a9ee8",
"title": "My First Blog",
"content": "<p>This is the blog content</p>",
"author": "694dd2a84adf4d18cb9a9edd",
"createdAt": "2025-12-26T00:13:03.030Z"
},
"message": "Blog Posted"
}
}
```

#### Get All Blogs (with Pagination)

**Response:**

```
{
"success": true,
"message": "OK",
"data": {
"blogs": [
{
"_id": "694dd30f4adf4d18cb9a9ee8",
"title": "My First Blog",
"content": "<p>Blog content</p>",
"author": {
"_id": "694dd2a84adf4d18cb9a9edd",
"name": "John Doe",
"email": "john@example.com"
},
"createdAt": "2025-12-26T00:13:03.030Z"
}
],
"pagination": {
"total": 15,
"hasNext": true,
"page": 1
}
}
}
```

#### Get Blog by ID

```
GET /blogs/user?page=1&size=10
Authorization: Bearer {token}
```

#### Update Blog

```
PUT /blogs/:id
Authorization: Bearer {token}
Content-Type: application/json

{
"title": "Updated Title",
"content": "<p>Updated content</p>"
}
```

#### Delete Blog

```
DELETE /blogs/:id
Authorization: Bearer {token}
```

## 🔧 Postman Collection

Import the provided Postman collection to test all API endpoints:

1. Open Postman
2. Click "Import" → "Raw text"
3. Paste the collection JSON from above
4. Create environment with variable: `auth_token`

The collection includes:

- Auto-extraction of JWT token on login
- Auto-extraction of blog ID on creation
- Pre-configured Authorization headers

## 📝 cURL Examples

### Register

```
curl -X POST http://localhost:1234/api/v1/auth/register
-H "Content-Type: application/json"
-d '{"name":"John Doe","email":"john@example.com","password":"12345"}'
```

### Login

```
curl -X POST http://localhost:1234/api/v1/auth/login
-H "Content-Type: application/json"
-d '{"email":"john@example.com","password":"12345"}'
```

### Create Blog

```
curl -X POST http://localhost:1234/api/v1/blogs
-H "Content-Type: application/json"
-H "Authorization: Bearer YOUR_TOKEN_HERE"
-d '{"title":"My Blog","content":"<p>Content here</p>"}'
```

### Get All Blogs

```
curl http://localhost:1234/api/v1/blogs?page=1&size=10
```

## 🗄️ Database Schema

### User Schema

```
{
name: String,
email: String (unique, indexed),
password: String (hashed),
is_active: Boolean (indexed),
timestamps: true
}
```

### Blog Schema

```
{
title: String,
content: String,
author: ObjectId (ref: User),
deleted: Boolean (soft delete),
timestamps: true
}
// Indexes: { deleted: 1, author: 1, createdAt: -1 }
```

### Session Schema

```
{
userId: ObjectId (ref: User),
userAgent: String,
ip: String,
revoked: Boolean,
expiresAt: Date (TTL index),
timestamps: true
}
// Indexes: { userId: 1, revoked: 1, expiresAt: 1 }, { expiresAt: 1 (TTL) }
```

## 🔐 Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- Session-based token revocation
- Protected routes on frontend
- Authorization middleware on backend
- Soft delete for blogs
- Input validation on client and server
- Environment variables for sensitive data

## 🎨 Key Features Explained

### Session Management

- JWT tokens contain user ID and session ID
- Sessions stored in MongoDB with TTL (auto-deletion)
- Logout revokes session, making token invalid
- Silent session check on app mount

### Pagination

- Query parameters: `page` (default: 1), `size` (default: 10)
- Response includes: `total`, `hasNext`, `page`
- Frontend can implement infinite scrolling

### Rich Text Editor

- Quill editor with toolbar customization
- Supports: headings, bold, italic, lists, links, images, code blocks
- HTML content stored in database
- Rendered with `dangerouslySetInnerHTML` (sanitized)

## 📦 Dependencies

### Backend

- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv

### Frontend

- react & react-dom
- @reduxjs/toolkit & react-redux
- react-router-dom
- @mui/material
- tailwindcss
- react-quill-new
- axios
- sonner (toast notifications)
- lucide-react (icons)

## 🚀 Deployment (AWS EC2 + MongoDB Atlas)

### Infrastructure

- **Server**: AWS EC2
- **Database**: MongoDB Atlas
- **Domain**: uzzair.online
- **IP**: AWS Elastic IP
