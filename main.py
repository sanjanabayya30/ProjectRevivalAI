from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
import shutil
import os
import tempfile
import json
import httpx
import time
from pathlib import Path

from parser import FileParser
from scorer import ProjectScorer
from ai_module import ProjectAnalyzer

app = FastAPI(title="Project Revival AI API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class ProjectFiles(BaseModel):
    code: Optional[UploadFile]
    documentation: Optional[UploadFile]
    notes: Optional[str]

class GithubProject(BaseModel):
    url: HttpUrl
    notes: Optional[str] = None

class AnalysisResult(BaseModel):
    status: str
    project_summary: str
    current_stage: str
    failure_points: List[str]
    missing_components: List[str]
    fix_steps: List[str]
    recommended_technologies: List[str]
    action_items: List[str]
    scores: Dict[str, Any]

# Temporary storage for file uploads
UPLOAD_DIR = Path(tempfile.gettempdir()) / "project_revival_uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# Initialize components
file_parser = FileParser()
project_scorer = ProjectScorer()
project_analyzer = ProjectAnalyzer()

@app.post("/api/analyze/files", response_model=AnalysisResult)
async def analyze_files(
    code: Optional[UploadFile] = File(None),
    documentation: Optional[UploadFile] = File(None),
    notes: Optional[str] = Form(None)
):
    """
    Analyze uploaded project files
    """
    if not code and not documentation:
        raise HTTPException(
            status_code=400,
            detail="At least one file (code or documentation) must be provided"
        )
    
    try:
        uploaded_files = []
        code_content = {}
        doc_content = None
        
        # Process code file (ZIP)
        if code:
            code_path = file_parser.save_uploaded_file(
                await code.read(),
                code.filename,
                str(UPLOAD_DIR)
            )
            uploaded_files.append(code_path)
            
            if code.filename.endswith('.zip'):
                code_content = file_parser.parse_zip(code_path)
        
        # Process documentation file (PDF/DOCX)
        if documentation:
            doc_path = file_parser.save_uploaded_file(
                await documentation.read(),
                documentation.filename,
                str(UPLOAD_DIR)
            )
            uploaded_files.append(doc_path)
            
            if documentation.filename.endswith('.pdf'):
                doc_content = file_parser.parse_pdf(doc_path)
            elif documentation.filename.endswith('.docx'):
                doc_content = file_parser.parse_docx(doc_path)
        
        # Generate project score
        scores = project_scorer.generate_project_score(code_content, doc_content)
        
        # Analyze project with AI
        analysis_result = await project_analyzer.analyze_project(
            code_content,
            doc_content,
            notes
        )
        
        # Add scores to analysis result
        analysis_result["scores"] = scores
        
        # Clean up uploaded files
        file_parser.cleanup_files(uploaded_files)
        
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing files: {str(e)}")

@app.post("/api/analyze/github", response_model=AnalysisResult)
async def analyze_github(project: GithubProject):
    """
    Analyze a project from a GitHub repository URL
    """
    try:
        # In a real implementation, we would:
        # 1. Clone the GitHub repository
        # 2. Process the files
        # 3. Generate analysis
        
        # For demo, return mock data
        mock_analysis = await project_analyzer.analyze_project(
            {"sample.py": "print('Hello World')"},
            None,
            project.notes
        )
        
        return mock_analysis
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing GitHub repository: {str(e)}"
        )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}