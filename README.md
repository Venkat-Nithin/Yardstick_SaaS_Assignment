# Cloud-Based Multi-Tenant Notes Application (MERN Stack)

This project is a **multi-tenant SaaS Notes Application** built with the MERN stack (MongoDB, Express, React, Node.js). It offers secure, scalable note management for multiple companies (tenants), including strict data isolation, robust role-based access, and feature gating by subscription.

## Overview

This SaaS system allows multiple organizations to manage notes in secure, isolated environments. Tenants can invite users, control access by role, and manage subscription plans that gate access to premium features. The application uses a shared database strategy with tenant differentiation and robust access control.

## Architecture

The system comprises two deployable components and a shared MongoDB:

1. **Backend** (Node.js/Express): RESTful API with JWT authentication, role-based authorization, and note CRUD operations.
2. **Frontend** (React/Vite): Performs authentication, renders tenant- and user-aware UI, and interacts with the backend API.
3. **Database** (MongoDB): All tenant data is stored in shared collections, partitioned by a `tenantId` field, enforcing isolation.

Data flow is strictly tenant-aware using middleware that enforces tenant boundaries for all requests.

## Key Features

- **Multi-Tenancy:** Shared MongoDB collections, isolated by `tenantId` field for all resources.
- **Authentication & Authorization:**
  - JWT-based login for stateless security.
  - Role-based access with Admin and Member roles.
  - Admins can upgrade plans and invite users; Members can only manage notes.
- **Subscription Gating:**
  - Free Plan: Max 3 notes/tenant.
  - Pro Plan: Unlimited notes.
- **Notes API (CRUD):**
  - Full create, read, update, and delete (CRUD) support for notes.
- **User Invitation:** Admins invite users by email to join the same tenant.
- **Deployment:**
  - Backend: Render.
  - Frontend: Vercel.

## Setup and Deployment

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB (local or Atlas)
- Render account (backend deployment)
- Vercel account (frontend deployment)

### Backend Setup

1. Clone the repo, enter the backend directory.
2. Install dependencies: npm install

3. Create `.env` with required environment variables:

MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your_super_secret_key


4. Seed test data: node seed.js


5. Start the server: node server.js


The API runs at `http://localhost:3000`.

### Frontend Setup

1. Navigate to the frontend directory.
2. Install dependencies: npm install

3. Create `.env` with: 
VITE_API_URL=http://localhost:3000/api


4. Start the development server: npm run dev


App available at `http://localhost:5173`.

## Usage

- **Admins** can invite users, upgrade plans, and manage all tenant notes.
- **Members** can only perform note CRUD actions within their tenant limits.
- All API requests require an `Authorization` header in the format: Bearer <JWT token>

## Test Accounts

The seed script creates these test accounts—all use the password "password":

| Email               | Role   | Tenant |
|---------------------|--------|--------|
| admin@acme.test     | Admin  | Acme   |
| user@acme.test      | Member | Acme   |
| admin@globex.test   | Admin  | Globex |
| user@globex.test    | Member | Globex |

## API Endpoints

### Authentication

- `POST /api/auth/login` — Login for JWT token.
- `POST /api/auth/invite` — (Admin only) Invite user by email.

### Notes CRUD

- `POST /api/notes` — Create a note.
- `GET /api/notes` — List tenant notes.
- `GET /api/notes/:id` — Retrieve a single note.
- `PUT /api/notes/:id` — Update a note.
- `DELETE /api/notes/:id` — Delete a note.

### Tenant Management

- `POST /api/tenants/:slug/upgrade` — (Admin only) Upgrade tenant subscription.

## Multi-Tenancy Design

This application uses the "shared database, shared schema with tenantId" model:

- Every document (note, user, etc.) includes a `tenantId` property.
- Middleware enforces tenant filtering at the database and API level.
- This model:
- Is cost-effective and easy to maintain.
- Scales well with a high number of tenants.
- Streamlines updates by changing a single database schema.
- Subscription enforcement, RBAC, and tenant isolation are handled in backend logic and middleware.

## Links

- **Frontend deployed link:** [https://saasfrontend-f90oxdium-venkat-nithin-ms-projects.vercel.app/](https://saasfrontend-f90oxdium-venkat-nithin-ms-projects.vercel.app/)
- **Backend deployed link:** [https://yardstick-saas-assignment.onrender.com/](https://yardstick-saas-assignment.onrender.com/)
- **Github Repository link:** [https://github.com/Venkat-Nithin/Yardstick_SaaS_Assignment](https://github.com/Venkat-Nithin/Yardstick_SaaS_Assignment)