# Project Revival AI 
# DEPLOYMENT 
You can View the Live demo project click below link :

https://frabjous-youtiao-f781bd.netlify.app/

Project Revival AI is a web platform designed to help students revive their abandoned coding projects. It uses AI to analyze code and provide actionable insights and recommendations to complete stalled projects.

## Features

- Upload project files (ZIP) or provide GitHub repository links
- AI-powered analysis of code structure and patterns
- Identification of project failure points and missing components
- Step-by-step revival plan with recommended technologies
- Action items checklist for project completion
- Sample project integration for demonstration

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **File Handling**: Python for ZIP processing
- **AI Integration**: Mock OpenAI GPT-4 API (ready for real integration)
- **Deployment**: Docker Compose

## Project Structure

```
project-revival-ai/
├── frontend/             # React frontend application
│   ├── src/              # Source code
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   └── ...
├── backend/              # FastAPI backend application
│   ├── main.py           # Main API entrypoint
│   ├── ai_module.py      # AI integration logic
│   └── requirements.txt  # Python dependencies
└── docker-compose.yml    # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)
- Docker and Docker Compose (optional)

### Running Locally

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/project-revival-ai.git
   cd project-revival-ai
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Start the frontend development server:
   ```
   npm run dev
   ```

4. Install backend dependencies:
   ```
   cd backend
   pip install -r requirements.txt
   ```

5. Start the backend server:
   ```
   uvicorn main:app --reload
   ```

6. Open your browser and navigate to `http://localhost:5173`

### Using Docker Compose

1. Build and start the containers:
   ```
   docker-compose up
   ```

2. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

- `GET /`: API root endpoint
- `POST /api/analyze/file`: Analyze a project from a ZIP file
- `POST /api/analyze/github`: Analyze a project from a GitHub repository
- `GET /api/sample-project`: Get sample project analysis data

## Sample Project

The application includes a sample project (a half-built face recognition app using OpenCV + Python) for demonstration purposes. This can be accessed through the sample project option in the UI.

## Future Enhancements

- Integration with real OpenAI API
- Collaborative editing features
- Project history and versioning
- Extended technology recommendations
- Project export and sharing capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.
