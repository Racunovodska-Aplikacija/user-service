# User Service

User authentication and user management service for the RAC application.

## Database

- **Database Name**: `userdb`
- **Port**: 3000

## Entities

### User
- `id` (UUID, Primary Key)
- `email` (String, Unique, Email validation)
- `password` (String, Bcrypt hash, Min 6 characters)
- `firstName` (String, Required)
- `lastName` (String, Required)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## REST API Endpoints

### Authentication (Public)

#### Register
```
POST /auth/register
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### User Management (Protected - Requires JWT)

#### Get Current User
```
GET /users/me
```
**Headers:**
```
Authorization: Bearer {jwt-token}
```

#### Update Current User
```
PUT /users/me
```
**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Logout
```
POST /users/logout
```

### Health Check
```
GET /health
```

## gRPC Services

This service does not expose any gRPC endpoints.

## Environment Variables

- `PORT` - HTTP server port (default: 3000)
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_USERNAME` - Database username (default: postgres)
- `DB_PASSWORD` - Database password (default: postgres)
- `DB_DATABASE` - Database name (default: userdb)
- `JWT_SECRET` - Secret key for JWT signing
- `FRONTEND_ORIGIN` - CORS origin (default: http://localhost:3000)
- `NODE_ENV` - Environment (development/production)

## Running Locally

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
npm start
```

## Docker Build

```bash
docker build -t user-service:latest .
```
