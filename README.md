# Online Mock Placement and Assessment

A web application for conducting mock placements, coding assessments, and managing job applications.

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB
- Git
- Judge0 RapidAPI Key (for code execution)

### Quick Start

1. **Clone and Install Dependencies**
```bash
git clone [repository-url]
cd my-project

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

2. **Get Judge0 API Key**
- Go to [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce)
- Sign up/Login to RapidAPI
- Subscribe to Judge0 CE API (Free tier available)
- Get your API key from the "Header Parameters" section (X-RapidAPI-Key)

3. **Configure Environment**
Create a `.env` file in the `backend` folder with:
```
MONGO_URI=mongodb://localhost:27017/your_database
JWT_SECRET=use_a_strong_random_string_at_least_32_chars
JWT_EXPIRES_IN=1h
RAPID_API_KEY=your_judge0_rapid_api_key_here
NODE_ENV=development
```

4. **Start the Application**

Start Backend:
```bash
cd backend
node ./seedTests.js
node ./seedCodingProblems.js
node ./server.js
```

Start Frontend (in a new terminal):
```bash
cd ..
npm run dev
```

Access the application:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Features
- User Authentication
- Company Profiles
- Job Postings
- Coding Assessments with Judge0 Integration
- Application Tracking
- Results Dashboard
