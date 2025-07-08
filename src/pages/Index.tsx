
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingScreen from '@/components/LandingScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ProtectionScreen from '@/components/ProtectionScreen';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type AppState = 'landing' | 'payment' | 'loading' | 'protected';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const { user, loading, subscribed } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSubscribe = async () => {
    if (!subscribed) {
      toast.error('Please subscribe first to activate protection');
      return;
    }

    try {
      toast.success('Activating protection...');
      setAppState('loading');
      
    } catch (error) {
      toast.error('Failed to activate protection. Please try again.');
      console.error('Protection activation error:', error);
    }
  };

  const handleLoadingComplete = () => {
    setAppState('protected');
    // Optional: Add haptic feedback or sound here
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  const handleBackToHome = () => {
    setAppState('landing');
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-shield-gradient flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  // If not logged in, user will be redirected to /auth
  if (!user) {
    return null;
  }

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'landing':
        return <LandingScreen onSubscribe={handleSubscribe} />;
      case 'loading':
        return <LoadingScreen onComplete={handleLoadingComplete} />;
      case 'protected':
        return <ProtectionScreen onBack={handleBackToHome} />;
      default:
        return <LandingScreen onSubscribe={handleSubscribe} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
