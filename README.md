# EventEase

EventEase is a REST API for discovering events, managing event listings, and creating ticket bookings with email OTP verification.

## Features

- User registration, login, and JWT authentication
- Email OTP verification for accounts and bookings
- Public event browsing, search, and category filtering
- Admin-only event creation, updates, and deletion
- Booking creation, confirmation, cancellation, and seat availability tracking
- Seed script with an admin account and sample events

## Built with

- Node.js and Express
- MongoDB and Mongoose
- JSON Web Tokens
- Nodemailer

## Getting started

### 1. Install dependencies

```bash
cd server
npm install
```

### 2. Configure environment variables

Copy `.env.example` to a new `.env` file, then add your own values.

```bash
copy .env.example .env
```

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventeaseDev
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password
JWT_SECRET=replace-with-a-long-random-secret
```

Use an email-provider app password for `EMAIL_PASS`; never commit `.env` to GitHub.

### 3. Start the API

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

If PowerShell blocks `npm`, use `npm.cmd run dev` instead.

### 4. Load sample data (optional)

```bash
npm run seed
```

The seeder creates three sample events and this admin account:

```text
Email: eventease.admin@example.com
Password: Admin@123
```

Change this password before using the project outside local development.

## API overview

Base URL: `http://localhost:5000`

| Area | Method | Endpoint | Access |
| --- | --- | --- | --- |
| Register | POST | `/api/auth/register` | Public |
| Verify account OTP | POST | `/api/auth/verify-otp` | Public |
| Login | POST | `/api/auth/login` | Public |
| List events | GET | `/api/events` | Public |
| Get one event | GET | `/api/events/:id` | Public |
| Create event | POST | `/api/events` | Admin |
| Update event | PUT | `/api/events/:id` | Admin |
| Delete event | DELETE | `/api/events/:id` | Admin |
| Send booking OTP | POST | `/api/bookings/send-otp` | Signed-in user |
| Create booking | POST | `/api/bookings` | Signed-in user |
| My bookings | GET | `/api/bookings/my` | Signed-in user |
| Confirm booking | PUT | `/api/bookings/:id/confirm` | Admin |
| Cancel booking | DELETE | `/api/bookings/:id` | Admin |

Protected endpoints need this header:

```text
Authorization: Bearer <token>
```

### Event filters

```text
GET /api/events?category=Music
GET /api/events?search=workshop
```

### Create a booking

First call `POST /api/bookings/send-otp`, then use the emailed OTP in this request:

```json
{
  "eventId": "EVENT_ID",
  "seats": 1,
  "otp": "123456"
}
```

## Testing with Postman

Import your EventEase collection into Postman. Register and verify a regular user to obtain `user_token`, then log in with the seeded admin account to obtain `admin_token`.

## Project structure

```text
server/
  controllers/  # Request handlers
  middleware/   # Authentication and role checks
  models/       # MongoDB schemas
  routes/       # API endpoints
  utils/        # Email helpers
  index.js      # Application entry point
  seed.js       # Sample-data script
```
