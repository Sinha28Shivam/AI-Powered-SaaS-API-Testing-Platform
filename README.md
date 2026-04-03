<div align="center">
  <h1>🚀 AI-Powered API Testing SaaS Platform</h1>
  <p>
    <strong>A full-stack, enterprise-grade AI-powered platform for automated API endpoint testing and monitoring.</strong>
  </p>
</div>

---

## 📖 Overview

The **AI-Powered API Testing SaaS** is an advanced platform designed to streamline and automate API testing using the power of Artificial Intelligence (Google GenAI/Gemini). It allows developers and QA teams to test their API endpoints efficiently, monitor performance, and generate comprehensive documentation, all within a beautiful, highly responsive interface.

Built with modern web technologies, the platform is robust, scalable, and fully containerized for straightforward deployment.

---

## ✨ Features

- **🤖 AI-Powered Testing:** Leverage generative AI to formulate intelligent test cases, analyze responses, and automatically identify edge cases.
- **⚡ Advanced Analytics:** Visualize API performance metrics and test results with interactive charts (Recharts).
- **🛡️ Rate Limiting & Security:** Built-in protection and rate limiting for scalable endpoint consumption.
- **📄 Interactive Documentation:** Integrated Swagger-UI for viewing and testing API structures intuitively.
- **🔄 Asynchronous Processing:** Uses Redis and BullMQ for managing high-volume, background testing tasks efficiently.
- **🚀 Containerized Deployment:** Fully Dockerized architecture containing dedicated services for frontend, backend, caching, and databases.
- **💎 Premium UI/UX:** Responsive, smooth, and dynamic design utilizing React and Lucide icons.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling/UI:** Modern CSS, Recharts (Data Visualization), Lucide-React (Icons), React Hot Toast (Notifications)
- **API Integration:** Axios, Swagger-UI-React

### **Backend**
- **Runtime:** Node.js + Express.js
- **AI Integration:** Google GenAI SDK (`@google/genai`)
- **ORMs/Database:** 
  - Prisma Client (PostgreSQL - Relational Data)
  - Mongoose (MongoDB - Document/NoSQL Data)
- **Task Queue & Caching:** Redis + BullMQ
- **Authentication:** JWT, bcrypt
- **Security:** Express Rate Limit, CORS

### **Infrastructure**
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (Frontend Deployment)
- **Databases:** PostgreSQL (v15), MongoDB, Redis (Alpine)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Local Development / Deployment (Docker)

The easiest way to get the platform running is using Docker Compose, which spins up all necessary services (Databases, Backend, and Frontend).

1. **Clone the repository** (if not already done) and navigate to the project root:
   ```bash
   cd AI_powered_SAAS
   ```

2. **Environment Variables:**
   Ensure the `.env` file in the `Backend/` directory is properly configured with your secrets (like `GEMINI_API_KEY`, `JWT_SECRET`, etc.). The database URIs are automatically handled by the docker-compose network.

3. **Build and Start up the containers:**
   ```bash
   docker-compose up --build -d
   ```

4. **Access the application:**
   - **Frontend:** http://localhost:80 (Served via Nginx)
   - **Backend API:** http://localhost:5000
   - **MongoDB:** Exposed on `localhost:27017`
   - **PostgreSQL:** Exposed on `localhost:5432`
   - **Redis:** Exposed on `localhost:6379`

5. **Stopping the project:**
   ```bash
   docker-compose down
   ```

---

## 📂 Project Structure

```text
AI_powered_SAAS/
├── Backend/                 # Node.js Express API
│   ├── src/                 # Application source code (controllers, routes, services)
│   ├── prisma/              # Prisma schema & migrations
│   ├── .env                 # Environment variables
│   ├── Dockerfile           # Backend container instructions
│   └── package.json         # Backend dependencies
├── Frontend/                # React + Vite Client Application
│   ├── src/                 # React components, pages, and hooks
│   ├── public/              # Static assets
│   ├── nginx.conf           # Custom Nginx configuration for serving React UI
│   ├── Dockerfile           # Frontend builder and web server instructions
│   └── package.json         # Frontend dependencies
├── docker-compose.yml       # Orchestration file for all services
└── README.md                # Project documentation
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](#) if you want to contribute.

## 📝 License

This project is [ISC](https://opensource.org/licenses/ISC) licensed.

## 📖 Detailed Usage

### Running the Application Locally

The project is containerized using Docker Compose. The following commands are commonly used during development and testing:

```bash
# Build and start all services in detached mode
docker-compose up --build -d

# View logs for a specific service (e.g., backend)
docker-compose logs -f backend

# Stop and remove all containers, networks, and volumes
docker-compose down --volumes
```

If you prefer to run the services without Docker, you can start each component individually:

```bash
# Backend (Node.js)
cd Backend
npm install
npm run dev   # Starts the Express server on http://localhost:5000

# Frontend (Vite)
cd ../Frontend
npm install
npm run dev   # Starts Vite dev server on http://localhost:5173
```

### Environment Variables

Create a `.env` file inside the `Backend/` directory with the following keys (adjust values as needed):

```dotenv
PORT=5000
MONGO_URI=your_mongo_url
DATABASE_URL=you_postgres_url
REDIS_URL=your_redis_url
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET=your-jwt-secret
```

### API Routes Overview

The backend exposes a RESTful JSON API under the `/api` namespace. Below is a summary of the most important endpoints:

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/register` | Register a new user (email, password). |
| `POST` | `/api/auth/login` | Authenticate a user and receive a JWT. |
| `GET`  | `/api/auth/me` | Retrieve the authenticated user's profile (requires JWT). |
| `POST` | `/api/tests` | Submit a new API test definition (URL, method, payload). |
| `GET`  | `/api/tests/:id` | Get details and results of a specific test. |
| `GET`  | `/api/tests` | List all tests for the authenticated user. |
| `DELETE`| `/api/tests/:id` | Delete a test definition. |
| `POST` | `/api/ai/generate-tests` | Use Gemini to auto‑generate test cases from an OpenAPI spec. |
| `GET`  | `/api/metrics` | Retrieve aggregated performance metrics (response times, success rates). |

All protected routes require the `Authorization: Bearer <JWT>` header.

### Frontend Usage

The React frontend communicates with the backend via the `VITE_API_BASE_URL` environment variable (default: `http://localhost:5000/api`). After starting the containers, open your browser at:

- **Dashboard:** `http://localhost` – Overview of recent test runs and analytics.
- **Test Builder:** `http://localhost/tests/new` – Create and configure new API tests.
- **Documentation:** `http://localhost/docs` – Interactive Swagger UI for the backend API.

### Testing & Linting

Both frontend and backend include linting and testing scripts:

```bash
# Backend lint & test
cd Backend
npm run lint
npm test

# Frontend lint & test
cd ../Frontend
npm run lint
npm test
```

### Deploying to Production

For production, the Docker images can be built and pushed to a container registry, then deployed using the same `docker-compose.yml` (or a Kubernetes manifest). Ensure you replace the development `.env` values with secure production secrets and configure a reverse proxy (e.g., Nginx) to serve the frontend over HTTPS.

---
