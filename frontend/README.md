# Dragan Begovski  
Frontend - React Admin Dashboard  

## Overview
This is the frontend for the admin dashboard application.  
It is built with **React**, **TypeScript**, **Apollo Client**, and **React-Bootstrap**.  

The app consumes the backend GraphQL API and allows admins to manage users, view stats, and perform CRUD operations.  
Authentication is JWT-based and protected routes require a valid token stored in `localStorage`.  

### Key features:
- Login and registration forms
- JWT-based authentication
- Protected routes with redirect to login if no token
- User listing with **pagination handled by the backend** and search
- React-Bootstrap UI components
- GraphQL queries and mutations with Apollo Client
- Environment configuration via `.env`

## Tech Stack
- **Frontend:** React, TypeScript, React Router v7, React-Bootstrap
- **GraphQL:** Apollo Client
- **Auth:** JWT token stored in `localStorage`
- **UI/UX:** Bootstrap 5
- **Environment Variables:** dotenv
# 
## Setup

1. **Clone the repository**
```bash
git clone <repo-url>
cd frontend

Install dependencies
npm install

Create a .env file in the root folder (for API endpoint)
REACT_APP_GRAPHQL_URL=http://localhost:3000/graphql

Run the frontend
npm start

Usage
Navigate to /login to log in with an existing user.
Use /register to create a new user account (public mutation).
Upon successful login, a JWT token will be stored in localStorage.
Access protected routes like /users to view user lists and stats.
Pagination is handled by the backend; the frontend only sends page number and search query to the API.
Logout will remove the token and redirect back to /login.
Notes
JWT token in localStorage is required for accessing protected routes.
User roles (ADMIN / USER) control access to certain pages.
React-Bootstrap components provide responsive UI and forms.
Apollo Client handles GraphQL queries and mutations efficiently.
Pagination and filtering are managed by the backend API.
Author

Dragan Begovski
