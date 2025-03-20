# InfoTechReports

## About the Project

InfoTechReports is a multi-threaded client-server application where users can view database records with the ability to edit one field (attribute) and generate reports.

The database already stores information about citizen requests, executors, and applicants, specifically:
- Citizen's full name
- Request number and date
- Executors assigned to the request
- Link to the request
- Nature of violations found in the request (stored as a number from 1 to n)
- Inspection result (Allowed values: "Выявлено" (Detected), "Не выявлено" (Not detected))

## Project Structure

The project is divided into two parts:

### Backend (C# / ASP.NET Core)

- **Technologies:**
  - ASP.NET Core 9.0
  - Entity Framework Core
  - PostgreSQL
  - JWT for authentication
  - Swagger for API documentation

- **Main Features:**
  - User authentication and authorization
  - API for report management
  - Data storage in PostgreSQL database
  - Document generation in OpenXML format

### Frontend (React)

- **Technologies:**
  - React 19
  - React Router
  - Axios for HTTP requests
  - Vite

- **Main Features:**
  - Authentication interface
  - Viewing and editing requests list
  - Generating reports in docx format

## Getting Started

### Requirements

- .NET 9.0 SDK
- Node.js (latest version)
- PostgreSQL

### Installation and Setup

#### Backend

1. Navigate to the `/backend` directory
2. Configure database connection in `appsettings.json`
3. Run the following commands:
   ```
   dotnet restore
   dotnet ef database update
   dotnet watch run
   ```

#### Frontend

1. Navigate to the `/frontend` directory
2. Run the following commands:
   ```
   npm install
   npm run dev
   ```

## Application Access

- Frontend: http://localhost:5173
- Backend API: https://localhost:5119
- Swagger documentation: https://localhost:5119/swagger

## Live Demo

You can access the live demo of InfoTechReports at: 
https://polite-pegasus-25a4eb.netlify.app/