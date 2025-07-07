
import { useEffect, useState } from 'react';
import { Shield, Zap } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('initializing');

  const stages = [
    { key: 'initializing', text: 'Initializing Security Protocols...', duration: 1000 },
    { key: 'scanning', text: 'Scanning Device Vulnerabilities...', duration: 1500 },
    { key: 'encrypting', text: 'Encrypting Data Channels...', duration: 1200 },
    { key: 'activating', text: 'Activating Shield Protection...', duration: 1300 },
    { key: 'complete', text: 'Protection Activated Successfully!', duration: 1000 }
  ];

  useEffect(() => {
    let currentStageIndex = 0;
    let progressValue = 0;

    const updateProgress = () => {
      if (currentStageIndex < stages.length) {
        const currentStage = stages[currentStageIndex];
        setStage(currentStage.key);
        
        const increment = 100 / stages.length;
        const startProgress = currentStageIndex * increment;
        const endProgress = (currentStageIndex + 1) * increment;
        
        const steps = 20;
        const stepDuration = currentStage.duration / steps;
        let step = 0;

        const stepInterval = setInterval(() => {
          step++;
          progressValue = startProgress + (step / steps) * increment;
          setProgress(Math.min(progressValue, 100));

          if (step >= steps) {
            clearInterval(stepInterval);
            currentStageIndex++;
            
            if (currentStageIndex >= stages.length) {
              setTimeout(() => {
                onComplete();
              }, 500);
            } else {
              setTimeout(updateProgress, 200);
            }
          }
        }, stepDuration);
      }
    };

    const initialDelay = setTimeout(updateProgress, 500);

    return () => {
      clearTimeout(initialDelay);
    };
  }, [onComplete]);

  const getStageText = () => {
    const stageData = stages.find(s => s.key === stage);
    return stageData?.text || 'Loading...';
  };

  return (
    <div className="min-h-screen bg-loading-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/6 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Main Shield Icon */}
        <div className="text-center">
          <div className="relative inline-block">
            <Shield 
              size={100} 
              className="text-primary shield-glow float" 
              fill="currentColor"
            />
            <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl"></div>
            
            {/* Charging effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap 
                size={30} 
                className="text-blue-400 animate-pulse" 
                fill="currentColor"
              />
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Protection Status</span>
              <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full charging-pulse rounded-full transition-all duration-300 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Status Text */}
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground animate-pulse">
              {getStageText()}
            </p>
            
            {progress === 100 && (
              <div className="flex items-center justify-center space-x-2 text-primary scale-in">
                <Shield size={16} />
                <span className="text-sm font-semibold">Ready!</span>
              </div>
            )}
          </div>
        </div>

        {/* Loading indicators */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
