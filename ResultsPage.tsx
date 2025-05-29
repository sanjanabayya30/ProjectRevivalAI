import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Check, ChevronRight, Download, ExternalLink, FileCode, Github, Puzzle as PuzzlePiece, RotateCw, UserPlus, Zap } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projectData, analysisResult } = useProject();
  
  useEffect(() => {
    // Redirect if no analysis result
    if (!analysisResult) {
      navigate('/upload');
    }
  }, [analysisResult, navigate]);
  
  if (!analysisResult) {
    return null;
  }
  
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
    <div className="animate-in">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Project Analysis Results</h1>
          <p className="text-gray-600">
            AI-powered insights and recommendations for your project.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button className="btn-outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </button>
          <Link to="/upload" className="btn-primary">
            <RotateCw className="h-4 w-4 mr-2" />
            New Analysis
          </Link>
        </div>
      </div>
      
      {/* Project overview */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:flex-1">
            <div className="flex items-center mb-3">
              {projectData.source === 'file' ? (
                <FileCode className="h-5 w-5 text-primary-600 mr-2" />
              ) : (
                <Github className="h-5 w-5 text-primary-600 mr-2" />
              )}
              <h2 className="text-xl font-semibold">{getProjectName()}</h2>
            </div>
            
            <div className="flex items-center mb-4">
              <div className={`
                px-2.5 py-0.5 rounded-full text-sm font-medium
                ${analysisResult.status === 'Complete' ? 'bg-success-50 text-success-700' : 
                  analysisResult.status === 'Incomplete' ? 'bg-warning-50 text-warning-700' : 
                  'bg-error-50 text-error-700'}
              `}>
                {analysisResult.status}
              </div>
            </div>
            
            {projectData.additionalNotes && (
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Additional notes:</span> {projectData.additionalNotes}
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mt-4 md:mt-0 md:ml-6 md:w-64">
            <h3 className="font-medium mb-2 text-gray-700">Project Status</h3>
            <StatusItem 
              icon={<AlertCircle className="h-4 w-4 text-error-500" />} 
              text={`${analysisResult.failurePoints.length} failure points identified`}
              color="text-error-700"
            />
            <StatusItem 
              icon={<PuzzlePiece className="h-4 w-4 text-warning-500" />} 
              text={`${analysisResult.missingComponents.length} missing components`}
              color="text-warning-700"
            />
            <StatusItem 
              icon={<Check className="h-4 w-4 text-success-500" />} 
              text={`${analysisResult.fixSteps.length} steps to completion`}
              color="text-success-700"
            />
          </div>
        </div>
      </div>
      
      {/* Analysis results grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Failure Points */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
            Why Your Project Stalled
          </h3>
          <ul className="space-y-3">
            {analysisResult.failurePoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-error-50 text-error-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                  {index + 1}
                </div>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Missing Components */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PuzzlePiece className="h-5 w-5 text-warning-500 mr-2" />
            What's Missing
          </h3>
          <ul className="space-y-3">
            {analysisResult.missingComponents.map((component, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-warning-50 text-warning-700 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                  {index + 1}
                </div>
                <span>{component}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Fix plan */}
      <div className="card p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <RotateCw className="h-5 w-5 text-primary-600 mr-2" />
          Steps to Fix Your Project
        </h3>
        
        <div className="relative">
          <div className="absolute left-[17px] top-0 h-full w-0.5 bg-gray-200 z-0"></div>
          
          {analysisResult.fixSteps.map((step, index) => (
            <div key={index} className="flex mb-4 relative z-10">
              <div className="flex-shrink-0 bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium">
                {index + 1}
              </div>
              <div className="ml-4 flex-1">
                <p className="bg-white py-2">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Technologies and Action Items */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Recommended Technologies */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 text-accent-500 mr-2" />
            Recommended Technologies
          </h3>
          <ul className="space-y-2">
            {analysisResult.recommendedTechnologies.map((tech, index) => (
              <li key={index} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                <div className="bg-accent-50 text-accent-700 rounded-full p-1 mr-3">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <span>{tech}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Action Items */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Check className="h-5 w-5 text-success-500 mr-2" />
            Action Items
          </h3>
          <ul className="space-y-2">
            {analysisResult.actionItems.map((item, index) => (
              <li key={index} className="flex items-start">
                <input 
                  type="checkbox" 
                  id={`action-${index}`} 
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-0.5 mr-3"
                />
                <label htmlFor={`action-${index}`} className="cursor-pointer flex-1">
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Find Collaborators CTA */}
      <div className="bg-gradient-to-r from-secondary-600 to-secondary-800 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:flex-1 mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Need Help Completing Your Project?</h3>
            <p className="text-secondary-100">
              Find skilled collaborators who can help you implement the missing components 
              and bring your project to completion.
            </p>
          </div>
          <button className="btn bg-white text-secondary-700 hover:bg-secondary-50 shadow-md">
            <UserPlus className="h-5 w-5 mr-2" />
            Find Collaborators
          </button>
        </div>
      </div>
    </div>
  );
};

interface StatusItemProps {
  icon: React.ReactNode;
  text: string;
  color: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, text, color }) => {
  return (
    <div className="flex items-center mb-2 last:mb-0">
      <div className="mr-2">{icon}</div>
      <span className={`text-sm ${color}`}>{text}</span>
    </div>
  );
};

export default ResultsPage;