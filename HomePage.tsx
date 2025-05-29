import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, FileCode, RotateCw, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="animate-in">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 rounded-b-3xl text-white mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <Brain className="h-16 w-16 mx-auto mb-6 text-primary-300" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Revive Your Abandoned Projects</h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Use AI to analyze your unfinished projects, identify what's missing, and get a clear roadmap to complete them.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload" className="btn bg-white text-primary-700 hover:bg-primary-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700">
              <FileCode className="mr-2 h-5 w-5" />
              Upload Your Project
            </Link>
            <a href="#how-it-works" className="btn bg-primary-600 text-white hover:bg-primary-500 border border-primary-500">
              Learn How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Resurrect Your Code</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Project Revival AI helps you bring your abandoned coding projects back to life with AI-powered insights and recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<FileCode className="h-10 w-10 text-primary-500" />}
            title="Upload & Analyze"
            description="Upload your project files or paste a GitHub link. Our AI will analyze your code structure, dependencies, and patterns."
          />
          <FeatureCard 
            icon={<Brain className="h-10 w-10 text-primary-500" />}
            title="Get AI Insights"
            description="Receive detailed analysis of what's missing, why the project stalled, and recommendations for modern technologies."
          />
          <FeatureCard 
            icon={<RotateCw className="h-10 w-10 text-primary-500" />}
            title="Follow the Roadmap"
            description="Get a step-by-step plan to complete your project with actionable tasks and technology recommendations."
          />
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform analyzes your code to provide actionable insights in just a few simple steps.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-[19px] top-0 h-full w-0.5 bg-gray-200 z-0"></div>
            
            <StepItem 
              number={1}
              title="Upload Your Project"
              description="Upload a ZIP file of your project or paste a GitHub repository link. You can also add documentation or notes to provide context."
            />
            
            <StepItem 
              number={2}
              title="AI Analysis"
              description="Our advanced AI engine analyzes your code structure, identifies missing components, and determines why the project likely stalled."
            />
            
            <StepItem 
              number={3}
              title="Review Insights"
              description="Receive a comprehensive analysis with detailed insights about your project's status, missing components, and failure points."
            />
            
            <StepItem 
              number={4}
              title="Follow the Revival Plan"
              description="Get a step-by-step action plan with recommended technologies and specific tasks to complete your project."
              isLast={true}
            />
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 rounded-xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Revive Your Project?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't let your hard work go to waste. Get the insights and guidance you need to complete your project.
          </p>
          <Link 
            to="/upload" 
            className="btn-primary py-3 px-8 text-lg"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="card p-6 transition-all duration-300 hover:shadow-lg">
      <div className="rounded-full bg-primary-50 p-4 w-fit mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface StepItemProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

const StepItem: React.FC<StepItemProps> = ({ number, title, description, isLast = false }) => {
  return (
    <div className="flex mb-8 relative z-10">
      <div className="flex-shrink-0 bg-primary-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
        {number}
      </div>
      <div className="ml-6">
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default HomePage;