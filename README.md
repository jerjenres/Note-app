# Ash Note

A full-stack note-taking application built with Spring Boot and React.

## 🚀 Quick Start

### Prerequisites
- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8.0** or higher
- **Maven 3.6** or higher

### 1. Database Setup
1. Install and start MySQL server
2. Create a database named `note`
3. Update database credentials in `backend/note/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/note
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend/note
   ```
2. Install dependencies and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   **Alternative**: You can also run the application directly from your IDE by running the main class `NoteApplication.java` located at `backend/note/src/main/java/com/noteapp/note/NoteApplication.java`
   
3. Backend will start on `http://localhost:8080`

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Frontend will be available at `http://localhost:5173`

## 📋 Detailed Setup Guide

### System Requirements

#### Java & Maven
- **Java**: Version 17 or higher
- **Maven**: Version 3.6 or higher
- **Verify installation**:
  ```bash
  java -version
  mvn -version
  ```

#### Node.js & npm
- **Node.js**: Version 16 or higher
- **npm**: Version 8 or higher
- **Verify installation**:
  ```bash
  node -v
  npm -v
  ```

#### MySQL Database
- **MySQL**: Version 8.0 or higher
- **Database name**: `note`
- **Default credentials** (change in application.properties):
  - Username: `root`
  - Password: `1234`

### Database Configuration

1. **Install MySQL** (if not already installed)
   - Download from [MySQL official website](https://dev.mysql.com/downloads/mysql/)
   - Follow installation instructions for your operating system

2. **Start MySQL service**
   - **Windows**: MySQL will start automatically or use MySQL Workbench
   - **macOS**: `brew services start mysql` (if installed via Homebrew)
   - **Linux**: `sudo systemctl start mysql`

3. **Create database**
   ```sql
   CREATE DATABASE note;
   ```

4. **Update connection settings**
   Edit `backend/note/src/main/resources/application.properties`:
   ```properties
   # Database connection
   spring.datasource.url=jdbc:mysql://localhost:3306/note
   spring.datasource.username=your_actual_username
   spring.datasource.password=your_actual_password

   # JPA settings
   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true
   ```

### Backend Configuration

#### Project Structure
```
backend/note/
├── src/main/java/com/noteapp/note/
│   ├── Auth/           # Authentication components
│   ├── Notes/          # Note management
│   ├── Users/          # User management
│   └── NoteApplication.java
├── src/main/resources/
│   └── application.properties  # Configuration file
└── pom.xml             # Maven dependencies
```

#### Dependencies
- Spring Boot Web Starter
- Spring Boot Data JPA
- Spring Boot Security
- MySQL Connector
- Lombok
- Validation

#### Running the Backend
```bash
cd backend/note
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080` with endpoints for:
- Authentication (`/auth/login`, `/auth/signup`)
- Notes management (`/notes`)
- User management (`/users`)

### Frontend Configuration

#### Project Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth)
│   ├── pages/          # Page components
│   ├── services/       # API services
│   └── App.jsx         # Main application
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
```

#### Dependencies
- React 18
- Tailwind CSS
- Vite
- React Router
- Axios (for API calls)

#### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` with:
- Landing page
- Authentication (Login/Signup)
- Dashboard with notes
- Create/Edit notes functionality

## 🔧 Development Workflow

### 1. Start Backend
```bash
cd backend/note
mvn spring-boot:run
```
**Alternative**: You can also run the application directly from your IDE by running the main class `NoteApplication.java` located at `backend/note/src/main/java/com/noteapp/note/NoteApplication.java`

### 2. Start Frontend (in new terminal)
```bash
cd frontend
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `application.properties`
   - Ensure database `note` exists

2. **Port Already in Use**
   - Backend: Change `server.port` in `application.properties`
   - Frontend: Port is configured in `vite.config.js`

3. **CORS Issues**
   - Backend allows requests from `http://localhost:5173`
   - Check browser console for specific errors

4. **Dependencies Installation**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📁 Project Structure Overview

```
Note-app/
├── backend/note/       # Spring Boot application
│   ├── src/main/java/  # Java source code
│   └── src/main/resources/  # Configuration
├── frontend/           # React application
│   ├── src/            # React source code
│   └── public/         # Static assets
└── README.md           # This file
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Login endpoint: `POST /auth/login`
- Signup endpoint: `POST /auth/signup`
- Protected routes require `Authorization: Bearer <token>` header

## 📝 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Notes
- `GET /notes` - Get all user notes
- `POST /notes` - Create new note
- `PUT /notes/{id}` - Update note
- `DELETE /notes/{id}` - Delete note

