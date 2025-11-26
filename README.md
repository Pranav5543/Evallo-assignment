# Evallo HRMS — Fullstack Assignment

This project is a simple Human Resource Management System (HRMS) built with Node.js (Express) backend and a React frontend.
It implements organisation signup, JWT authentication, employee and team CRUD, many-to-many employee-team assignments, and an audit log.

## Tech

- Node.js (v18+), Express
- Sequelize (Postgres)
- React (create-react-app structure)
- JWT for auth, bcrypt for passwords

## Quick start (local)

1. Install Postgres and create a database (e.g. `hrms_db`).
2. Backend:
   - `cd backend`
   - create `.env` (see `.env.example`)
   - `npm install`
   - `npm run dev` (starts on port 5000)
3. Frontend:
   - `cd frontend`
   - `npm install`
   - `npm start` (starts on port 3000)

The backend auto-creates tables (using `sequelize.sync()`) when started.

## Notes

- JWT tokens stored in localStorage for the demo.
- Logs are stored in `logs` table with a JSON metadata field.
- This code is a clean, minimal starter — designed to be readable and ready to extend.

## Deploying on Render

This repo already contains a `render.yaml` blueprint that provisions both the API (Node service) and the React client (static site). To deploy:

1. Commit and push all changes to GitHub.
2. In Render, create a new Blueprint from your repository and enable "Auto Deploy".
3. For the backend service (`evallo-backend`):
   - Set environment variables for `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`, and `JWT_SECRET` in the Render dashboard.
   - Ensure your Postgres instance is reachable from Render (you can also add a managed Postgres resource and reference its internal connection info).
4. For the frontend service (`evallo-frontend`):
   - Update the `REACT_APP_API_BASE` env var in `render.yaml` (or through the dashboard) so it points to the URL of your deployed backend (`https://<backend-service>.onrender.com/api`).
5. Trigger a manual deploy or wait for the first automatic deploy; Render will run `npm install` and `npm start`/`npm run build` as specified.

Once both services build successfully, your React site will be served from the static hosting endpoint and will call the live API.
