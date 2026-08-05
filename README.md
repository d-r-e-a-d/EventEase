# EventEase

EventEase is a full-stack event booking application with a React frontend and an Express/MongoDB backend.

## What it does

- Browse public events with category filtering and search
- Register and log in as a user
- Verify accounts and bookings with email OTPs
- Create, update, and delete events as an admin
- Book seats, confirm bookings, and cancel bookings
- Track available seats per event

## Built with

- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Nodemailer for email OTPs
- Tailwind CSS

## Getting started

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or accessible via connection string
- A valid email account for sending OTPs (Gmail app password recommended)

### Install dependencies

```bash
cd server
npm install
cd ../client
npm install
```

### Configure environment variables

Copy `server/.env.example` to `server/.env` and update the values:

```bash
cd server
copy .env.example .env
```

Example `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/eventeaseDev
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-app-password
JWT_SECRET=replace-with-a-long-random-secret
```

Create `client/.env` from `client/.env.example` as well:

```bash
cd client
copy .env.example .env
```

Example `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

> `EMAIL_PASS` should be an app password or secure SMTP credential. Do not commit `.env` to GitHub.

### Run the app

From the repository root:

```bash
npm run dev
```

This starts both the backend and the frontend together.

- API: `http://localhost:5000`
- Frontend: `http://localhost:5173`

If the root command does not work, run the server and client separately:

```bash
cd server && npm run dev
cd ../client && npm run dev
```

### Seed sample data

Optional: populate the database with test events and an admin account.

```bash
cd server
npm run seed
```

Seed credentials:

```text
Email: eventease.admin@example.com
Password: Admin@123
```

Change this password immediately for production use.

## API reference

Base URL: `http://localhost:5000`

| Area | Method | Endpoint | Access |
| --- | --- | --- | --- |
| Register | POST | `/api/auth/register` | Public |
| Verify account OTP | POST | `/api/auth/verify-otp` | Public |
| Login | POST | `/api/auth/login` | Public |
| List events | GET | `/api/events` | Public |
| Get event by ID | GET | `/api/events/:id` | Public |
| Create event | POST | `/api/events` | Admin |
| Update event | PUT | `/api/events/:id` | Admin |
| Delete event | DELETE | `/api/events/:id` | Admin |
| Send booking OTP | POST | `/api/bookings/send-otp` | Authenticated user |
| Create booking | POST | `/api/bookings` | Authenticated user |
| My bookings | GET | `/api/bookings/my` | Authenticated user |
| List all bookings | GET | `/api/bookings/all` | Admin |
| Confirm booking | PUT | `/api/bookings/:id/confirm` | Admin |
| Cancel booking | DELETE | `/api/bookings/:id` | Admin |

Protected endpoints require:

```http
Authorization: Bearer <token>
```

### Event query examples

```http
GET /api/events?category=Music
GET /api/events?search=workshop
```

### Booking flow

1. Request an OTP for a booking:

```json
{
  "eventId": "EVENT_ID",
  "seats": 2
}
```

2. Confirm the booking using the OTP:

```json
{
  "eventId": "EVENT_ID",
  "seats": 2,
  "otp": "123456"
}
```

## Project structure

```text
.
├── client/          # React frontend
├── server/          # Express backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── seed.js
├── package.json     # root scripts for running both services
└── README.md
```

## Notes

- The frontend is in `client/` and uses Vite.
- The backend is in `server/` and uses MongoDB and JWT-based auth.
- Keep secret credentials in `server/.env` only.
- If you only need the backend, run `cd server && npm run dev`.
