# Admin Panel with Role-Based Access Control

A MERN stack application that implements role-based access control for admin users. The application allows super admins to manage sub-admins and provides different access levels based on user roles.

## Features

- User authentication with JWT
- Role-based access control (Super Admin and Sub Admin)
- Protected routes based on user roles
- Modern UI with Material-UI components
- Responsive design
- Secure password handling
- Admin management system

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/admin-panel
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

## Creating a Super Admin

To create the first super admin, you'll need to use MongoDB Compass or the MongoDB shell to manually update a user's role to 'superAdmin'. Here's how:

1. Create a regular user through the registration process
2. Use MongoDB Compass or the MongoDB shell to update the user's role:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "superAdmin" } }
   )
   ```

## Usage

1. Access the application at `http://localhost:3000`
2. Log in with your admin credentials
3. Super admins will have access to:
   - Dashboard
   - Manage Sub-Admins page
4. Sub-admins will have access to:
   - Dashboard only

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login user
- POST `/api/auth/register` - Register new admin (Super Admin only)
- GET `/api/auth/me` - Get current user info

### Admin Management
- GET `/api/admin/sub-admins` - Get all sub-admins (Super Admin only)
- PATCH `/api/admin/sub-admins/:id/status` - Update sub-admin status (Super Admin only)
- DELETE `/api/admin/sub-admins/:id` - Delete sub-admin (Super Admin only)

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control
- Secure password storage
- Token expiration

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - React Router
  - Axios
  - Context API

- Backend:
  - Node.js
  - Express
  - MongoDB
  - Mongoose
  - JWT
  - bcrypt 