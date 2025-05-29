import React from 'react';
import { Brain, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface AnalysisProps {
  project: {
    name: string;
    type: string;
    size: number;
    lastModified: number;
  };
  onComplete: () => void;
}

const ProjectAnalysis: React.FC<AnalysisProps> = ({ project, onComplete }) => {
  const [analysisStage, setAnalysisStage] = React.useState(0);
  const [isComplete, setIsComplete] = React.useState(false);

  const stages = [
    'Extracting project contents...',
    'Analyzing code structure...',
    'Identifying missing components...',
    'Generating recommendations...',
    'Finalizing report...'
  ];

  React.useEffect(() => {
    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length - 1) {
        currentStage++;
        setAnalysisStage(currentStage);
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete();
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-primary-100 p-3 rounded-full">
          <Brain className="h-8 w-8 text-primary-600" />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-center mb-6">
        Analyzing {project.name}
      </h2>

      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index > analysisStage ? 'text-gray-400' : 'text-gray-900'
            }`}
          >
            {index < analysisStage ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-3" />
            ) : index === analysisStage ? (
              <div className="h-5 w-5 bg-primary-500 rounded-full animate-pulse mr-3" />
            ) : (
              <div className="h-5 w-5 border-2 border-gray-300 rounded-full mr-3" />
            )}
            <span>{stage}</span>
          </div>
        ))}
      </div>

      {isComplete && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            View Analysis Report
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAnalysis;