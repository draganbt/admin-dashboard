# Dragan Begovski

# Backend - NestJS GraphQL App

## Overview

This is the backend for the admin dashboard application built with **NestJS**, **GraphQL**, **TypeORM**, and **PostgreSQL**.  
It provides user authentication, registration, and management functionality. Passwords are **hashed** using bcrypt.  

The backend exposes a GraphQL API for the frontend to consume.  

Key features:
- JWT-based authentication
- User roles (ADMIN, USER)
- User registration with hashed passwords
- GraphQL queries and mutations for users
- Pagination and filtering support
- Configurable via `.env` file
- Works with Docker for easy setup

---

## Tech Stack

- **Backend:** NestJS, TypeScript, GraphQL (Apollo)
- **Database:** PostgreSQL via TypeORM
- **Auth:** JWT with Passport
- **Password Security:** bcrypt hashing
- **Environment Variables:** dotenv

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd backend

Install dependencies
npm install


Create a .env file in the root with the following variables:

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=nestgraphql

JWT_SECRET=supersecretkey123
JWT_EXPIRES_IN=1h
PORT=3000

Run PostgreSQL
Either locally or via Docker:

docker run --name nest-backend-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nestgraphql -p 5432:5432 -d postgres

Run the backend
npm run start:dev

For production build:

npm run build
npm run start:prod
