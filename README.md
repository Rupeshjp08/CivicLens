# CivicLens 🔍🏛️

**CivicLens** is a Smart Civic Complaint Reporting and Tracking Platform designed to empower citizens to report public issues (such as potholes, broken streetlights, garbage accumulation, water leakage, and damaged roads) while giving municipal authorities an efficient admin dashboard to manage, prioritize, and resolve complaints.

---

## 📁 Repository Structure

```text
civic-lens/
│
├── frontend/                   # React + Vite Client Application
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx      # Navigation bar component
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx                 # Citizen homepage
│   │   │   ├── ReportComplaint.jsx      # Issue reporting page
│   │   │   ├── TrackComplaint.jsx       # Complaint tracking by ID
│   │   │   ├── ExploreComplaints.jsx    # Public issue feed
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx            # Admin analytics & overview
│   │   │       ├── ComplaintManagement.jsx  # Admin issue management table
│   │   │       └── Analytics.jsx            # Performance & category metrics
│   │   │
│   │   ├── services/
│   │   │   └── api.js          # REST API communication service
│   │   │
│   │   ├── App.jsx             # React Router configuration
│   │   ├── main.jsx            # React root mounting point
│   │   └── index.css           # Global design system & styles
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    # Node.js + Express API Server
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection handler
│   │
│   ├── controllers/
│   │   └── complaintController.js # Complaint logic & API responses
│   │
│   ├── models/
│   │   └── Complaint.js        # Mongoose data schema
│   │
│   ├── routes/
│   │   └── complaintRoutes.js  # Express router endpoints
│   │
│   ├── middleware/
│   │   └── errorHandler.js    # Global error handler
│   │
│   ├── services/
│   │   └── priorityService.js  # Smart priority logic calculation
│   │
│   ├── server.js               # Express application entry point
│   ├── package.json
│   └── .env.example            # Environment variables placeholder
│
├── .gitignore
└── README.md
```

---

## 👥 Team Responsibilities & Division

| Developer | Scope | Main Files & Directories | Responsibilities |
| :--- | :--- | :--- | :--- |
| **Developer 1** | **Citizen-facing Frontend** | `frontend/src/pages/Home.jsx`<br>`frontend/src/pages/ReportComplaint.jsx`<br>`frontend/src/pages/TrackComplaint.jsx`<br>`frontend/src/pages/ExploreComplaints.jsx`<br>`frontend/src/components/Navbar.jsx` | User UI, reporting forms, issue tracking, upvoting feed, responsive citizen interface. |
| **Developer 2** | **Backend & Database** | `backend/server.js`<br>`backend/config/db.js`<br>`backend/models/Complaint.js`<br>`backend/controllers/complaintController.js`<br>`backend/routes/complaintRoutes.js`<br>`backend/services/priorityService.js` | REST API endpoints, MongoDB schema, smart priority algorithms, server middleware, database connectivity. |
| **Developer 3** | **Admin Frontend** | `frontend/src/pages/admin/Dashboard.jsx`<br>`frontend/src/pages/admin/ComplaintManagement.jsx`<br>`frontend/src/pages/admin/Analytics.jsx` | Admin metrics dashboard, complaint status & priority management table, visual metrics and resolution analytics. |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **MongoDB**: Local MongoDB instance or MongoDB Atlas URI (The backend gracefully handles local mock mode if MongoDB is not connected).

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start the development server (runs on port 5000)
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install frontend dependencies
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning `{ success: true, message: "CivicLens API is running" }` |
| `GET` | `/api/complaints` | Fetch all complaints (supports category/status filters) |
| `GET` | `/api/complaints/:id` | Fetch details of a specific complaint by `complaintId` |
| `POST` | `/api/complaints` | Submit a new complaint |
| `PATCH` | `/api/complaints/:id` | Update complaint status or priority (Admin API) |

---

## 📊 Complaint Schema Structure

```javascript
{
  complaintId: String,    // e.g., "CIV-1001"
  title: String,          // e.g., "Deep Pothole near Main Street"
  description: String,    // Detailed description of the issue
  category: String,       // "Pothole" | "Broken Streetlight" | "Garbage Accumulation" | "Water Leakage" | "Damaged Road" | "Other"
  location: String,       // Address or location description
  image: String,          // Image URL or media reference
  status: String,         // "Pending" | "In Review" | "In Progress" | "Resolved" | "Rejected"
  priority: String,       // "Low" | "Medium" | "High" | "Critical"
  supportCount: Number,   // Citizen upvotes count
  createdAt: Date         // Submission timestamp
}
```

---

## 🛠️ Contribution Guidelines

1. **Create a Feature Branch**: Always create a branch for your work (e.g., `git checkout -b feature/citizen-reporting` or `git checkout -b feature/admin-dashboard`).
2. **Modular Code**: Keep controllers, components, and services decoupled.
3. **Pull Requests**: Open PRs to `main` with descriptive titles detailing your updates.
