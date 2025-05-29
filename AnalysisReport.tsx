import React from 'react';
import { AlertCircle, CheckCircle2, ArrowRight, PenTool as Tool, Puzzle, Zap, Star, Code2 } from 'lucide-react';

interface ProjectScore {
  codeCompleteness: number;
  documentationQuality: number;
  revivalPotential: number;
  fixDifficulty: 'Easy' | 'Medium' | 'Hard';
}

interface ReportProps {
  projectName: string;
  analysis: {
    summary: string;
    abandonmentReasons: string[];
    missingComponents: string[];
    rebootSteps: string[];
    suggestedTechnologies: string[];
    projectScore: ProjectScore;
  };
}

const ScoreBar: React.FC<{ score: number; label: string }> = ({ score, label }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-medium text-gray-700">{score}/10</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-primary-600 h-2 rounded-full transition-all duration-500"
        style={{ width: `${score * 10}%` }}
      />
    </div>
  </div>
);

const DifficultyBadge: React.FC<{ difficulty: 'Easy' | 'Medium' | 'Hard' }> = ({ difficulty }) => {
  const colors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-sm font-medium ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
};

const AnalysisReport: React.FC<ReportProps> = ({ projectName, analysis }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Project Revival Report</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600">{analysis.summary}</p>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-3">Project Scores</h3>
            <ScoreBar score={analysis.projectScore.codeCompleteness} label="Code Completeness" />
            <ScoreBar score={analysis.projectScore.documentationQuality} label="Documentation Quality" />
            <ScoreBar score={analysis.projectScore.revivalPotential} label="Revival Potential" />
          </div>
          
          <div className="flex flex-col justify-center items-center bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Fix Difficulty</h3>
            <DifficultyBadge difficulty={analysis.projectScore.fixDifficulty} />
            <p className="mt-3 text-sm text-gray-600 text-center">
              Based on project complexity and missing components
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
            <h3 className="text-lg font-semibold">Reasons for Abandonment</h3>
          </div>
          <ul className="space-y-3">
            {analysis.abandonmentReasons.map((reason, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 text-sm mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-700">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Puzzle className="h-6 w-6 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold">Missing Components</h3>
          </div>
          <ul className="space-y-3">
            {analysis.missingComponents.map((component, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-700">{component}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Code2 className="h-6 w-6 text-purple-500 mr-2" />
          <h3 className="text-lg font-semibold">Suggested Technologies</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.suggestedTechnologies.map((tech, index) => (
            <div 
              key={index}
              className="flex items-center p-3 bg-purple-50 rounded-lg"
            >
              <Star className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-purple-700">{tech}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Zap className="h-6 w-6 text-green-500 mr-2" />
          <h3 className="text-lg font-semibold">Steps to Reboot</h3>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200"></div>
          <ul className="space-y-6 relative">
            {analysis.rebootSteps.map((step, index) => (
              <li key={index} className="flex items-start ml-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 font-medium -ml-4 relative z-10">
                  {index + 1}
                </div>
                <span className="ml-4 text-gray-700">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Need Help?</h3>
            <p className="text-purple-100">
              Find skilled collaborators to help bring your project to life.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
            Find Collaborators
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;