import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProjectFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
}

interface ProjectData {
  source: 'file' | 'github' | null;
  files?: ProjectFile[] | null;
  githubUrl?: string | null;
  additionalNotes?: string | null;
}

interface AnalysisResult {
  status: string;
  failurePoints: string[];
  missingComponents: string[];
  fixSteps: string[];
  recommendedTechnologies: string[];
  actionItems: string[];
  isLoading?: boolean;
}

interface ProjectContextType {
  projectData: ProjectData;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  updateProjectData: (data: Partial<ProjectData>) => void;
  setFiles: (files: ProjectFile[]) => void;
  setGithubUrl: (url: string) => void;
  setAdditionalNotes: (notes: string) => void;
  startAnalysis: () => Promise<void>;
  resetProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projectData, setProjectData] = useState<ProjectData>({
    source: null,
    files: null,
    githubUrl: null,
    additionalNotes: null,
  });

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateProjectData = (data: Partial<ProjectData>) => {
    setProjectData((prev) => ({ ...prev, ...data }));
  };

  const setFiles = (files: ProjectFile[]) => {
    setProjectData((prev) => ({
      ...prev,
      source: 'file',
      files,
      githubUrl: null,
    }));
  };

  const setGithubUrl = (url: string) => {
    setProjectData((prev) => ({
      ...prev,
      source: 'github',
      githubUrl: url,
      files: null,
    }));
  };

  const setAdditionalNotes = (notes: string) => {
    setProjectData((prev) => ({
      ...prev,
      additionalNotes: notes,
    }));
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 3000));
    
    // For demo purposes, we'll use mock data
    // In a real implementation, this would make an API call to the backend
    const mockAnalysisResult: AnalysisResult = {
      status: "Incomplete",
      failurePoints: [
        "Missing frontend integration",
        "Incomplete data processing pipeline",
        "No user authentication system"
      ],
      missingComponents: [
        "Frontend UI for webcam input and face detection display",
        "User authentication and session management",
        "Real-time processing optimization"
      ],
      fixSteps: [
        "Add React + Flask bridge for frontend-backend communication",
        "Implement webcam stream handling with OpenCV",
        "Create user authentication system",
        "Optimize face detection for real-time performance",
        "Add result saving and history feature"
      ],
      recommendedTechnologies: [
        "React.js for frontend",
        "Flask-SocketIO for real-time communication",
        "JWT for authentication",
        "Redis for caching detection results",
        "WebRTC for camera access"
      ],
      actionItems: [
        "Set up React project with webcam component",
        "Create Flask routes for face detection API",
        "Implement WebSocket for real-time results",
        "Add user authentication with JWT",
        "Set up deployment pipeline with Docker"
      ]
    };
    
    setAnalysisResult(mockAnalysisResult);
    setIsAnalyzing(false);
    
    return Promise.resolve();
  };

  const resetProject = () => {
    setProjectData({
      source: null,
      files: null,
      githubUrl: null,
      additionalNotes: null,
    });
    setAnalysisResult(null);
  };

  const value = {
    projectData,
    analysisResult,
    isAnalyzing,
    updateProjectData,
    setFiles,
    setGithubUrl,
    setAdditionalNotes,
    startAnalysis,
    resetProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};