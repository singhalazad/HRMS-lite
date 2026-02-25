# HRMS-lite

## Project Overview
HRMS-lite is a lightweight Human Resource Management System. The application allows administrators to easily manage employee records (viewing, adding, and deleting), track and update daily employee attendance, and view high-level dashboard metrics regarding headcount and daily participation rates.

## Tech Stack Used
*   **Frontend**: React, Vite, React Router, Axios, Lucide React (Icons), react-hot-toast (Notifications).
*   **Backend**: Python, Django, Django REST Framework.
*   **Database**: SQLite (Local Development) & PostgreSQL (Configured for Production).
*   **Deployment config**: Vercel (`vercel.json`) & Railway (`railway.json`).

## Steps to Run the Project Locally

### 1. Backend Setup
1. Open a terminal and navigate to the project root: `cd "d:\ASPL Projects\HRMS-lite"`
2. Set up the virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   ```
3. Install dependencies: `pip install -r requirements.txt`
4. Run database migrations: `python manage.py migrate`
5. Start the Django server: `python manage.py runserver 8000`

*The API will be available at `http://localhost:8000/api/`*

### 2. Frontend Setup
1. Open a *new* terminal window and navigate to the frontend:
   ```bash
   cd "d:\ASPL Projects\HRMS-lite\frontend"
   ```
2. Install Node dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

*The frontend application will be available at `http://localhost:5173/`*

## Assumptions & Limitations
*   **Single User Role**: The system currently assumes a single HR/Admin user role with full access; there is no login/authentication system or restricted employee-level views.
*   **Local Timezones**: Attendance tracking relies largely on the client/server local dates without complex multi-region timezone handling.
*   **Production Deployment**: The `render.yaml` was migrated to `vercel.json` (frontend) and `railway.json` (backend) architectures. Allowed hosts and CORS must be manually specified in the production environments for proper communication between the decoupled frontend and backend.