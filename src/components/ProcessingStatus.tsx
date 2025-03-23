
import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

interface ProcessingStatusProps {
  progress: number;
  stage: string;
  isComplete: boolean;
  detailedStatus?: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ 
  progress, 
  stage, 
  isComplete,
  detailedStatus
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);
    
    return () => clearInterval(interval);
  }, [isComplete]);

  const processingSteps = [
    { name: 'Analyzing video', complete: progress >= 20 },
    { name: 'Identifying key moments', complete: progress >= 40 },
    { name: 'Generating clips', complete: progress >= 60 },
    { name: 'Creating captions', complete: progress >= 80 },
    { name: 'Finalizing output', complete: progress >= 95 }
  ];

  return (
    <div className="glass-panel p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {isComplete ? (
            <CheckCircle2 size={20} className="mr-2 text-green-400" />
          ) : (
            <Cpu size={20} className="mr-2 text-vidsmith-accent animate-pulse-slow" />
          )}
          <h3 className="text-lg font-medium text-white">
            {isComplete ? 'Processing Complete' : 'Processing Your Video'}
          </h3>
        </div>
        <span className="text-sm font-medium text-gray-300">{Math.round(progress)}%</span>
      </div>
      
      <div className="w-full bg-vidsmith-border rounded-full h-2 mb-6">
        <div 
          className={`bg-gradient-to-r from-vidsmith-accent-dark to-vidsmith-accent h-full rounded-full transition-all duration-300 ease-out ${isComplete ? 'bg-green-400' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-sm space-y-3">
        {/* Current status */}
        <div className="text-vidsmith-accent font-medium animate-pulse-slow">
          {!isComplete && (
            <div className="flex items-center">
              <span className="inline-block w-4 h-4 mr-2 rounded-full border-2 border-vidsmith-accent border-t-transparent animate-spin"></span>
              <span>{stage}{dots}</span>
            </div>
          )}
        </div>
        
        {/* Detailed status if provided */}
        {detailedStatus && !isComplete && (
          <div className="text-gray-400 text-xs mt-1 pl-6">
            {detailedStatus}
          </div>
        )}

        {/* Processing steps */}
        <div className="space-y-2 mt-4">
          {processingSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              {step.complete ? (
                <CheckCircle2 size={16} className="text-green-400 mr-2" />
              ) : (
                <div className={`w-4 h-4 rounded-full mr-2 ${processingSteps[index-1]?.complete ? 'bg-vidsmith-muted/60 animate-pulse' : 'bg-vidsmith-muted/30'}`}></div>
              )}
              <span className={`text-xs ${step.complete ? 'text-green-400' : processingSteps[index-1]?.complete ? 'text-gray-300' : 'text-gray-500'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
