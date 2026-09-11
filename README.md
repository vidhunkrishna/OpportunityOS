# OpportunityOS 🚀

> **Personalized Student Opportunity Engine & Career Action Planner**
> *Discover $\rightarrow$ Match $\rightarrow$ Explain $\rightarrow$ Improve $\rightarrow$ Act*

OpportunityOS is an end-to-end career intelligence and opportunity execution platform built for students. It replaces generic job search boards with a deterministic 5-factor matching engine, eligibility verifications, interactive skill gap benchmarks, auto-generated 7-day action roadmaps, and contextual Google Gemini AI guidance.

---

## ✨ Key Features

- 🎯 **5-Factor Deterministic Matching Engine**: Evaluates opportunities across 5 key dimensions:
  - **Skill Fit** (35%)
  - **Career Goal Alignment** (25%)
  - **Project & Hands-on Experience** (15%)
  - **Domain Interest** (15%)
  - **Application Deadline Urgency** (10%)
- 🛡 **Academic Standing & Eligibility Engine**: Automatically verifies academic standing, branch/discipline, graduation year, and degree requirements.
- ⚡ **Opportunity Readiness Score**: Measures real-time preparedness vs potential readiness gain when missing skills are containerized.
- 🗓 **7-Day Guided Action Roadmaps**: Generates step-by-step daily micro-tasks to bridge skill gaps for targeted roles.
- 🤖 **Contextual Google Gemini AI Assistant**: Powered by `gemini-2.5-flash` / `gemini-1.5-flash` with rich local fallback knowledge for technical concepts (Docker, AWS, React, Node.js, REST APIs, System Design).
- 🔗 **Verified Live Opportunity Direct Links**: Seeds 20+ realistic internships, hackathons, fellowships, and full-time engineering roles linking to live official career portals.
- 📊 **Interactive Kanban Application Tracker**: Tracks application status across `SAVED`, `PREPARING`, `APPLIED`, and `COMPLETED`.
- 🛠 **Admin Opportunity Workbench**: Dedicated admin portal to create, update, and manage verified opportunity listings.

---

## 🏗 Tech Stack & Architecture

### **Frontend (Client)**
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS Design Tokens + Tailwind CSS
- **Animations & Icons**: Framer Motion, Lucide React
- **HTTP Client**: Axios

### **Backend (Server)**
- **Runtime**: Node.js + Express.js (ES Modules)
- **Database ORM**: Prisma ORM + SQLite
- **AI Integration**: Google Gemini 2.5 Flash API (`@google/generative-ai` HTTP REST)
- **Authentication**: JWT & Bcrypt password hashing

---

## 📁 Repository Structure

```
OpportunityOS/
├── client/                      # React + Vite Frontend Application
│   ├── src/
│   │   ├── components/         # Common UI, Opportunity Cards, AI Drawer
│   │   ├── context/            # Auth, Student Profile, Toast Contexts
│   │   ├── pages/              # Dashboard, Discover, Profile, Tracker, Admin
│   │   └── services/           # Axios API Client
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Node.js + Express Backend Server
│   ├── prisma/
│   │   ├── schema.prisma       # Database Models
│   │   └── seed.js             # Realistic Seed Opportunities & Profiles
│   ├── src/
│   │   ├── controllers/        # Student, Opportunity, AI, Admin Controllers
│   │   ├── services/           # Matching Engine, Skill Gap, Readiness, Gemini AI
│   │   └── index.js            # Express Server Entry Point
│   ├── .env.example
│   └── package.json
│
├── .env.example                 # Global Environment Variables Template
├── .gitignore                   # Git Ignore Configurations
├── LICENSE                      # MIT License
└── README.md                    # Project Documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

---

### 1. Clone the Repository

```bash
git clone https://github.com/vidhunkrishna/OpportunityOS.git
cd OpportunityOS
```

---

### 2. Configure Environment Variables

Create `.env` inside the `server/` directory using the provided template:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

```env
PORT=3001
JWT_SECRET=opportunity_os_super_secret_jwt_key_2026
DATABASE_URL="file:./dev.db"

# Optional: Google Gemini AI Key from https://aistudio.google.com/
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### 3. Install Dependencies & Initialize Database

```bash
# Install server dependencies & push database schema
cd server
npm install
npx prisma db push
npx prisma db seed
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

---

### 4. Run Development Servers

**Backend Server (Port 3001)**:
```bash
cd server
npm run dev
```

**Frontend Application (Port 5173)**:
```bash
cd client
npm run dev
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `alex.sharma@example.com` | `password123` |
| **Admin** | `admin@opportunityos.com` | `password123` |

---

## 📝 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<p align="center">
  Built with ❤️ for Students & Hackathons
</p>
