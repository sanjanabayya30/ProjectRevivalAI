import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, FileCode, Github, ArrowRight, Loader } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectData, isAnalyzing, startAnalysis, analysisResult } = useProject();
  
  useEffect(() => {
    // Redirect if no project data
    if (!projectData.source) {
      navigate('/upload');
      return;
    }
    
    // Start analysis if not already analyzing
    if (!isAnalyzing && !analysisResult) {
      startAnalysis();
    }
    
    // Navigate to results when analysis is complete
    if (analysisResult && !isAnalyzing) {
      const timer = setTimeout(() => {
        navigate('/results');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [projectData, isAnalyzing, analysisResult, navigate, startAnalysis]);
  
  // Get project name
  const getProjectName = () => {
    if (projectData.source === 'file' && projectData.files && projectData.files.length > 0) {
      return projectData.files[0].name.replace('.zip', '');
    } else if (projectData.source === 'github' && projectData.githubUrl) {
      const url = projectData.githubUrl;
      const parts = url.split('/');
      return parts[parts.length - 1] || parts[parts.length - 2] || 'GitHub Project';
    }
    return 'Your Project';
  };

  return (
    <div className="max-w-3xl mx-auto text-center animate-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Analyzing Your Project</h1>
        <p className="text-gray-600">
          Our AI is analyzing your project to identify issues and generate recommendations.
        </p>
      </div>
      
      <div className="card p-8 mb-8">
        <div className="flex justify-center mb-6">
          {projectData.source === 'file' ? (
            <div className="rounded-full bg-primary-100 p-5">
              <FileCode className="h-12 w-12 text-primary-600" />
            </div>
          ) : (
            <div className="rounded-full bg-primary-100 p-5">
              <Github className="h-12 w-12 text-primary-600" />
            </div>
          )}
        </div>
        
        <h2 className="text-2xl font-semibold mb-2">{getProjectName()}</h2>
        
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-md">
            <div className="h-2.5 bg-gray-200 rounded-full mb-6">
              <div 
                className="h-2.5 bg-primary-600 rounded-full animate-pulse-slow" 
                style={{ 
                  width: isAnalyzing ? '90%' : '100%',
                  transition: 'width 1s ease-in-out'
                }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>Parsing files</span>
              <span>Generating insights</span>
              <span>Finalizing</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-primary-700">
          <Loader className="animate-spin h-5 w-5" />
          <span className="font-medium">
            {isAnalyzing ? 'AI is analyzing your project...' : 'Analysis complete!'}
          </span>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <div className="flex items-start text-left mb-4">
          <Brain className="h-6 w-6 text-primary-600 mr-3 mt-1" />
          <div>
            <h3 className="font-semibold text-lg mb-1">How Project Revival AI Works</h3>
            <p className="text-gray-600 text-sm">
              Our AI analyzes your code structure, dependencies, and patterns to identify why your project stalled 
              and what components are missing. It then generates a step-by-step plan to help you complete your project.
            </p>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 italic">
          This analysis usually takes less than a minute to complete.
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;