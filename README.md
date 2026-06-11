# 🔗 Shrinkr — Premium, High-Performance Base62 URL Shortener

**Shrinkr** is a warm, minimalist, and high-performance URL shortener built with a modern decoupled monorepo architecture: an Express Node.js REST API backend paired with a React + Vite + Tailwind CSS v4 frontend. 

It utilizes an **atomic sequential counter converted to Base62** to generate clean, collision-free shortened links, while natively supporting optional **custom short names** with backend format validation and database uniqueness checking.

---

## 🎨 Tech Stack & Architecture

### Frontend (`/client`)
- **React 19 & Vite:** Ultra-fast hot module reloading (HMR) and lightweight production bundles.
- **Tailwind CSS v4:** Styled using Tailwind's modern, compiler-driven v4 architecture with zero configuration bloat.
- **Lucide Icons:** Clean, minimalist vector iconography.
- **Warm Minimalist Theme:** Designed with a cozy, professional color palette (`#F2F0EA` cream & `#2C221E` espresso-brown) featuring a fine engineering grid background and CSS success animations.

### Backend (`/server`)
- **Node.js & Express:** Lightweight, highly responsive REST API.
- **Mongoose & MongoDB Atlas:** Schema model containing indexed lookups (`originalUrl` & `shortCode`) to maintain sub-millisecond database queries.
- **Custom Base62 Converter:** Bi-directional mathematical encoding logic that maps atomic auto-incrementing integer indexes into character codes (e.g. `1000` $\rightarrow$ `g8`).

---

## 📁 Repository Structure

```
URLshortener/
├── server/                 # Express Backend API
│   ├── config/             # DB initialization and counter setup
│   ├── controllers/        # Express controller (shrink & redirect logic)
│   ├── models/             # Mongoose Schemas (Counter.js & Url.js)
│   ├── routes/             # API routes definition
│   ├── utils/              # Base62 encoder/decoder
│   ├── .env                # Backend local environment keys (Ignored)
│   ├── server.js           # API Entry Point
│   └── clearDb.js          # Database cleanup & reset script
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Modular layout components (Header, Form, etc.)
│   │   ├── App.jsx         # App page coordinator & fetch controller
│   │   ├── index.css       # Tailwind v4 styles, themes, and checkmark animations
│   │   └── main.jsx
│   ├── index.html          # Web page frame (with mobile viewports & SEO)
│   └── vite.config.js      # Vite compilation configurations with Tailwind
│
└── README.md               # Main Project Documentation
```

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended) and a running [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

---

### 2. Setting Up the Backend Server
Navigate to the `/server` folder:
```bash
cd server
```

Install the dependencies:
```bash
npm install
```

Create a `.env` file in `/server` and populate it:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:5000
```

Start the backend in development mode (with Nodemon):
```bash
npm run dev
```
*The server will start on port `5000` and connect to MongoDB Atlas.*

---

### 3. Setting Up the React Client
Open a new terminal window and navigate to the `/client` folder:
```bash
cd client
```

Install the dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

---

## ⚙️ How the `BASE_URL` Mechanism Works

The `BASE_URL` configuration determines what domain prefix is returned by the shortener. Because the **backend server** handles the database lookup and redirection, the short links must route to your **deployed API server URL**, which then redirects users to the destination.

### A. Local Testing Setup
- **Server `.env`:** Set `BASE_URL=http://localhost:5000`.
- **Shorten a link:** Paste your link and click Shrink.
- **Output:** The returned URL will be `http://localhost:5000/g8` (or `http://localhost:5000/my-custom-name`).
- **Behavior:** Pasting this link into your browser connects to your local Express server, which intercepts the request and redirects you to the long URL.

### B. Production Deployment Setup (Vercel + Render/Railway)
Once you deploy your application to the internet:
1. **Deploy Frontend on Vercel:** You get a domain like `https://shrinkr.vercel.app`.
2. **Deploy Backend on Render:** You get a domain like `https://shrinkr-api.onrender.com`.

Update the environment settings on your cloud dashboards:
- **On your Render Backend environment variables:**
  ```env
  BASE_URL=https://shrinkr-api.onrender.com
  ```
  *(This ensures generated short URLs look like `https://shrinkr-api.onrender.com/g8`)*
  
- **On your Vercel Frontend environment variables:**
  ```env
  VITE_API_URL=https://shrinkr-api.onrender.com
  ```
  *(This tells your React app to send its POST requests to the live backend server instead of localhost)*

---

## 🧼 Database Purge Utility

For clean API testing in Postman, a standalone database utility has been provided. It will connect to your MongoDB cluster, delete all shortened links, and reset the auto-incrementing counter back to `999`.

To run it, open your terminal inside the `/server` folder and run:
```bash
node clearDb.js
```

---

## 📡 API Specification

### 1. Shorten a URL
- **Endpoint:** `POST /api/url/shorten`
- **Headers:** `Content-Type: application/json`
- **Body Options:**

#### Option A: Auto-Generated Base62 URL
```json
{
  "originalUrl": "https://www.wikipedia.org"
}
```
*Response (`201 Created`):*
```json
{
  "originalUrl": "https://www.wikipedia.org",
  "shortUrl": "http://localhost:5000/g8",
  "shortCode": "g8"
}
```

#### Option B: Custom Short Name URL
```json
{
  "originalUrl": "https://www.wikipedia.org",
  "customCode": "wiki"
}
```
*Response (`201 Created`):*
```json
{
  "originalUrl": "https://www.wikipedia.org",
  "shortUrl": "http://localhost:5000/wiki",
  "shortCode": "wiki"
}
```

- **Validation Error (`400 Bad Request`):** E.g. if the URL protocol is invalid or `customCode` has bad characters (special symbols).
- **Collision Error (`409 Conflict`):** If the requested `customCode` is already in use by another link in the database.

---

### 2. Redirect to Original URL
- **Endpoint:** `GET /:shortCode`
- **Response:** `301 Moved Permanently` (Redirects to original destination, increments clicks counters in the background).
- **Error Response (`404 Not Found`):** `{ "error": "Short URL not found" }` if the code does not exist.

---

## 📝 License
This project is ISC Licensed. Built with 🔗 by Rishi.
