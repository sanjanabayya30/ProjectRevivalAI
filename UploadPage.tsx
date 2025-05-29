import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FileUp, Github, Upload, AlertCircle } from 'lucide-react';
import { useProject } from '../context/ProjectContext';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { setFiles, setGithubUrl, setAdditionalNotes, projectData } = useProject();
  
  const [activeTab, setActiveTab] = useState<'file' | 'github'>('file');
  const [githubUrl, setGithubUrlLocal] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Handle file upload with react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    // Convert files to the expected format
    const fileList = acceptedFiles.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    }));
    
    setFiles(fileList);
  }, [setFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    maxFiles: 1,
    multiple: false
  });
  
  // Handle GitHub URL submission
  const handleGithubSubmit = () => {
    setError(null);
    
    // Basic GitHub URL validation
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?$/;
    
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub repository URL');
      return;
    }
    
    if (!githubRegex.test(githubUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    
    setGithubUrl(githubUrl);
  };
  
  // Handle additional notes
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setAdditionalNotes(e.target.value);
  };
  
  // Submit form and navigate to analysis page
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'file' && !projectData.files) {
      setError('Please upload a project ZIP file');
      return;
    }
    
    if (activeTab === 'github' && !projectData.githubUrl) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    
    navigate('/analysis');
  };
  
  return (
    <div className="max-w-3xl mx-auto animate-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Upload Your Project</h1>
        <p className="text-gray-600">
          Upload your project files or provide a GitHub repository link to get started with the analysis.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="card p-6">
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`py-3 px-6 font-medium ${
              activeTab === 'file' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileUp className="inline-block mr-2 h-5 w-5" />
            Upload ZIP File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`py-3 px-6 font-medium ${
              activeTab === 'github' 
                ? 'text-primary-600 border-b-2 border-primary-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Github className="inline-block mr-2 h-5 w-5" />
            GitHub Repository
          </button>
        </div>
        
        {/* File upload tab */}
        {activeTab === 'file' && (
          <div className="mb-6">
            <label className="label">Upload Project ZIP File</label>
            <div 
              {...getRootProps()} 
              className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${projectData.files ? 'border-primary-500 bg-primary-50' : ''}`}
            >
              <input {...getInputProps()} />
              {projectData.files ? (
                <div className="text-center">
                  <div className="mb-2 text-primary-600">
                    <Upload className="h-10 w-10 mx-auto" />
                  </div>
                  <p className="font-medium text-primary-700">File uploaded successfully!</p>
                  <p className="text-sm text-gray-500">{projectData.files[0]?.name}</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-2 text-gray-400">
                    <Upload className="h-10 w-10 mx-auto" />
                  </div>
                  <p className="font-medium">Drag & drop your project ZIP file here</p>
                  <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* GitHub repository tab */}
        {activeTab === 'github' && (
          <div className="mb-6">
            <label htmlFor="github-url" className="label">GitHub Repository URL</label>
            <div className="flex">
              <input
                type="text"
                id="github-url"
                placeholder="https://github.com/username/repository"
                className="input rounded-r-none"
                value={githubUrl}
                onChange={(e) => setGithubUrlLocal(e.target.value)}
              />
              <button
                type="button"
                className="btn-secondary rounded-l-none px-4"
                onClick={handleGithubSubmit}
              >
                Validate
              </button>
            </div>
            {projectData.githubUrl && (
              <p className="mt-2 text-sm text-success-700 flex items-center">
                <Upload className="h-4 w-4 mr-1" />
                Repository validated successfully!
              </p>
            )}
          </div>
        )}
        
        {/* Additional notes - common for both tabs */}
        <div className="mb-6">
          <label htmlFor="notes" className="label">Additional Notes (Optional)</label>
          <textarea
            id="notes"
            rows={4}
            placeholder="Add any additional context about your project that might help the analysis..."
            className="input"
            value={notes}
            onChange={handleNotesChange}
          />
        </div>
        
        {/* Error display */}
        {error && (
          <div className="mb-6 p-3 bg-error-50 text-error-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        {/* Submit button */}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Continue to Analysis
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;