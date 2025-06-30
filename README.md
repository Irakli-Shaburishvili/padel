# Padel Management System

A comprehensive padel management system with React frontend and Node.js backend.

## Features

- User authentication and authorization
- Court management and booking system
- Tournament management with bracket generation
- Match scheduling and results tracking
- Player statistics and rankings
- Admin dashboard
- Real-time notifications

## Project Structure

```
├── backend/          # Node.js/Express API
├── frontend/         # React/TypeScript frontend
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend && npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend && npm install
   ```

### Development

Start both frontend and backend:
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

### Docker

```bash
docker-compose up -d
```

## API Documentation

The API documentation is available at `/api/docs` when the server is running.

## Technology Stack

### Backend
- Node.js with Express
- TypeScript
- TypeORM with SQLite/PostgreSQL
- JWT authentication
- Class-validator for validation

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- React Hook Form for form handling