## AI-Powered Placement Experience Sharing Platform

An end-to-end web application where candidates can share placement experiences and readers can explore, learn, and get AI-generated insights tailored to each experience. The platform is split into a Node.js/Express backend and a React (Vite) frontend. It supports authentication, CRUD operations for experiences, and an AI assistant powered by Google Gemini that transforms raw experiences into polished, actionable guidance.

### Key Features
- **Authentication**: Register and login with JWT-based protected routes.
- **Share Experiences**: Authenticated users can create, update, delete, and list their own experiences.
- **Browse Public Experiences**: Anyone can explore all shared experiences and view an individual experience.
- **AI Insights (Gemini)**: One-click AI analysis of a selected experience into an elegant Markdown guide.
- **Clean UI/UX**: Modern, responsive React app with routing for core flows.

### Tech Stack
- **Frontend**: React 19, React Router 6, Axios, Vite, React Markdown
- **Backend**: Node.js, Express, Mongoose (MongoDB), JWT, bcryptjs, http-status-codes
- **AI**: `@google/generative-ai` (Gemini 2.0 Flash)
- **Tooling**: dotenv, cors, nodemon, ESLint (frontend)

---

## Monorepo Structure

```
WisdomPool/
  Backend/
    app.js
    controllers/
    routes/
    models/
    middlewares/
    services/
    db/
    package.json
  Frontend/
    src/
    public/
    package.json
  Readme.md
```

High-level architecture:
- The backend exposes REST endpoints under `/api/v1/*` and connects to MongoDB.
- The frontend SPA consumes these endpoints and manages auth token in `localStorage`.
- The AI service converts a specific experience to a Markdown advisory via Gemini.

---

## Backend

### Environment Variables
Create a `.env` file inside `Backend/` with the following variables:

```
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your-very-strong-secret
GOOGLE_GEMINI_KEY=your-google-generative-ai-api-key
```

### Install & Run

```bash
# From project root
cd Backend
npm install
npm run start

# Server runs at http://localhost:3000
```

### Notable Files
- `app.js`: Express app bootstrap, middleware, routes mounting, DB connect.
- `db/connect.js`: Mongoose connection helper.
- `models/user.js`: User schema with `name`, `email`, `password`.
- `models/experience.js`: Experience schema with `user`, `status`, `company`, `position`, `role`, `description`, `rounds`, `interviewDate`.
- `middlewares/authorize.js`: Verifies Bearer JWT; sets `req.user`.
- `middlewares/error-handler.js`: Unified error responses for custom errors.
- `controllers/*`: Business logic for auth, public/protected experiences, and AI.
- `services/aiService.js`: Gemini client and generation logic.
- `routes/*`: Route definitions mounted in `app.js`.

### Routes Overview

- Base URL: `http://localhost:3000`

- Auth (`/api/v1/auth`)
  - `POST /register` → Register user
  - `POST /login` → Login and receive JWT
  - `GET  /get-user` → Get current user (requires `Authorization: Bearer <token>`)

- Public Experiences (`/api/v1/public`)
  - `GET /get-all-experiences` → List all experiences
  - `GET /get-single-experience/:id` → Get one experience by id

- Protected Experiences (`/api/v1/protected`) — requires `Authorization: Bearer <token>`
  - `POST   /create-experience` → Create new experience
  - `PUT    /update-experience/:id` → Update an experience you own
  - `DELETE /delete-experience/:id` → Delete an experience you own
  - `GET    /get-all-myExperiences` → List experiences created by current user

- AI Service (`/api/v1/ask-AI`)
  - `GET /:id` → Generate Gemini Markdown guidance for experience `id`

### Example Requests

Register:
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"secret"}'
```

Login:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"secret"}'
# → { token: "<JWT>" }
```

Create Experience:
```bash
curl -X POST http://localhost:3000/api/v1/protected/create-experience \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "status":"pending",
    "company":"Acme",
    "position":"Software Engineer",
    "role":"Backend",
    "description":"Online assessment + system design + behavioral.",
    "rounds":3,
    "interviewDate":"2025-03-01"
  }'
```

AI Insights for an Experience:
```bash
curl http://localhost:3000/api/v1/ask-AI/<experienceId>
```

### Authentication & Authorization
- JWT is issued at login and must be included as `Authorization: Bearer <token>` for protected routes.
- The `authorize` middleware validates the token and populates `req.user`.
- Ownership is enforced for updates/deletes of experiences.

### Errors
- Custom errors are unified by `middlewares/error-handler.js`.
- Standard shape on error: `{ error: true, msg: "..." }`.

---

## Frontend

### Install & Run

```bash
# From project root
cd Frontend
npm install
npm run dev

# App runs at http://localhost:5173 (Vite default)
```

### Environment
The frontend references the backend at `http://localhost:3000`. If your backend runs elsewhere, update API base URLs in the components or introduce a central Axios instance and environment-based configuration.

### Primary Routes (SPA)
- `/` → Home (landing within `Layout`)
- `/experiences` → List all public experiences
- `/experience/:id` → View a single experience; includes “Get Insights From AI”
- `/share-experience` → Create a new experience (requires login)
- `/my-experiences` → Manage your experiences; view/edit/delete
- `/update-experience/:id` → Update your experience
- `/login` → Login
- `/register` → Register

### UI Flow Highlights
- **Auth**: On login, the JWT is stored in `localStorage` as `token`. Protected views attach `Authorization: Bearer <token>`.
- **Share & Manage**: Users can add a new experience, view their own list, update details, and delete items.
- **Explore**: Public feed shows all experiences with quick metadata and author info.
- **AI Guidance**: On an experience page, pressing “Get Insights From AI” fetches Gemini-generated Markdown rendered by React Markdown.

### Important Components
- `Components/Login` & `Components/Register`: Auth forms; Axios requests to backend.
- `Components/CreateExperience`: Form to create experience; sends JWT in headers.
- `Components/GetAllExperiences`: Public list view with cards and author info.
- `Components/GetAnExperience`: Single experience view with AI insights via React Markdown.
- `Components/GetAllMyExperiences`: User’s own experiences with edit/delete controls.
- `Components/UpdateExperience`: Edit form supporting partial updates.
- `Components/Layout`, `Navbar`, `Footer`: Shell and navigation.

---

## Local Development Guide

1) Start MongoDB
- Use a local MongoDB instance or a hosted MongoDB Atlas connection string for `MONGO_URI`.

2) Run Backend
```bash
cd Backend
npm install
npm run start
```

3) Run Frontend
```bash
cd Frontend
npm install
npm run dev
```

4) Create a user, login, and start sharing experiences from the UI.

---

## Production Considerations
- Configure CORS to allow only trusted origins.
- Never commit `.env` files or secrets.
- Use strong `JWT_SECRET` and short token lifetimes per your security posture.
- Rate limit and input validation to mitigate abuse.
- Centralize Axios baseURL and handle refresh/expiry flows.
- Add server-side pagination for public experience listing.
- Add indexing on MongoDB collections for frequent queries.

---

## Future Enhancements
- User profiles with avatars and bio.
- Tags, search and filters for experiences.
- Comments, reactions, and bookmarks.
- File uploads for resumes/portfolios (sanitized & scanned).
- Rich text editor with preview for descriptions.
- AI: company-specific prep plans, Q&A, and suggested improvements during creation.

---

### Owner: Ashay Patil 