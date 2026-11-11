# Doctor Tracker – Backend

A secure and scalable healthcare management backend built with **Node.js, Express.js, TypeScript, MongoDB, and Mongoose**. Doctor Tracker provides authenticated administrative operations for managing doctors and patients, assigning patients to doctors, searching and filtering records, and generating dashboard analytics. It follows a modular architecture with RESTful APIs, request validation, and JWT-based authentication.

## Features

- Secure authentication using JWT and HttpOnly cookies
- Password hashing with bcrypt
- Doctor management (Create, Read, Update, Delete)
- Patient management (Create, Read, Update, Delete)
- Assign patients to doctors
- Search, filtering, and pagination
- Doctor-wise patient management
- Dashboard overview and analytics
- Date-based doctor and patient statistics
- Request validation using Zod
- Secure HTTP headers using Helmet
- CORS and cookie-based authentication

## Technology Stack

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Zod
- Helmet
- Cookie Parser

## Project Structure

```text
src/
├── app/
├── config/
├── middlewares/
├── modules/
│   ├── auth/
│   ├── doctor/
│   ├── patient/
│   └── dashboard/
├── routes/
├── utils/
├── app.ts
└── server.ts
```

## Installation Guide

### 1. Clone the Repository

```bash
git clone YOUR_BACKEND_REPOSITORY_URL
cd doctor-tracker-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory.

Use the following `.env.example` as a starting point:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/doctor-tracker
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Make sure the variable names match your backend configuration.

### 4. Run the Development Server

```bash
npm run dev
```

Backend API will run at:

```text
http://localhost:5000
```

## API Base URL

```text
http://localhost:5000/api
```

## API Modules

| Module | Endpoint | Description |
|---|---|---|
| Authentication | `/api/auth` | Admin authentication |
| Doctors | `/api/doctor` | Doctor management |
| Patients | `/api/patient` | Patient management |
| Dashboard | `/api/dashboard` | Dashboard analytics |

### Dashboard Analytics Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/overview` | Total doctors and patients |
| GET | `/api/dashboard/patients-per-doctor` | Patient count per doctor |
| GET | `/api/dashboard/doctor-patient-distribution` | Doctor-wise distribution |
| GET | `/api/dashboard/patient-statistics` | Patient date-based statistics |
| GET | `/api/dashboard/doctor-statistics` | Doctor date-based statistics |

## System Architecture

The backend follows a modular architecture. Incoming HTTP requests pass through authentication and validation middleware before reaching the relevant controller and service.

```mermaid
flowchart TD
    A[Frontend Client] --> B[Express REST API]
    B --> C[Authentication Middleware]
    C --> D[Validation Middleware]
    D --> E[Controller Layer]
    E --> F[Service Layer]
    F --> G[Mongoose Models]
    G --> H[(MongoDB Database)]
    F --> I[Analytics Aggregation]
    I --> H
    E --> J[JSON Response]
    J --> A
```

### Request Flow

1. The frontend sends an HTTP request.
2. Express receives and routes the request.
3. Authentication middleware verifies protected requests.
4. Zod validation checks incoming data.
5. Controllers handle request and response operations.
6. Services execute business logic.
7. Mongoose communicates with MongoDB.
8. The API returns a JSON response.

## Technical Decisions

### 1. MongoDB with Mongoose

MongoDB and Mongoose were selected to manage doctor and patient records using a flexible document-based data model. Mongoose provides schema validation, model-based database operations, population, and aggregation capabilities. MongoDB aggregation pipelines are also used to calculate dashboard statistics efficiently.

### 2. JWT Authentication with HttpOnly Cookies

JWT-based authentication with HttpOnly cookies was implemented to protect administrative routes. HttpOnly cookies prevent client-side JavaScript from directly accessing the authentication token. Authentication middleware verifies the token before allowing access to protected resources.

## Visual Evidence

Add screenshots of the backend API testing using Postman.

| Screenshot | File |
|---|---|
| Authentication API | `screenshots/auth-api.png` |
| Doctor API | `screenshots/doctor-api.png` |
| Patient API | `screenshots/patient-api.png` |
| Dashboard Analytics | `screenshots/dashboard-api.png` |

## Environment Variables

Never commit your actual `.env` file or secret credentials to GitHub. Use `.env.example` to document the required variables.

## Project Links

- **Frontend:** YOUR_FRONTEND_LIVE_URL
- **Backend Repository:** YOUR_BACKEND_REPOSITORY_URL
- **Frontend Repository:** YOUR_FRONTEND_REPOSITORY_URL

## License

This project was developed for educational and portfolio purposes.