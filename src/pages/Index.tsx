
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
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSubscribe = async () => {
    try {
      // In a real app, this would integrate with Stripe
      // For demo purposes, we'll simulate the payment flow
      toast.success('Payment successful! Activating protection...');
      setAppState('loading');
      
      // You would replace this with actual Stripe integration:
      // const response = await fetch('/api/create-checkout-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ priceId: 'price_xxx' })
      // });
      // const { url } = await response.json();
      // window.open(url, '_blank');
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
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
