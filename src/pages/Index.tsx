
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LandingScreen from '@/components/LandingScreen';
import LoadingScreen from '@/components/LoadingScreen';
import ProtectionScreen from '@/components/ProtectionScreen';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import useLanguage from '@/hooks/useLanguage';
import { getTranslation } from '@/translations';

type AppState = 'landing' | 'payment' | 'loading' | 'protected';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const { user, loading, subscribed, checkSubscription } = useAuth();
  const { language } = useLanguage();
  const t = getTranslation(language);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Handle return from Stripe checkout
  useEffect(() => {
    const payment = searchParams.get('payment');
    if (payment === 'success' && user) {
      toast.success(t.messages.paymentSuccess);
      // Check subscription status after successful payment
      checkSubscription();
      // Clear the payment parameter from URL
      setSearchParams({});
    } else if (payment === 'cancelled' && user) {
      toast.info(t.messages.paymentCancelled);
      // Clear the payment parameter from URL
      setSearchParams({});
    }
  }, [searchParams, user, checkSubscription, t.messages, setSearchParams]);

  const handleSubscribe = async () => {
    if (!subscribed) {
      toast.error(t.messages.subscribeFirst);
      return;
    }

    try {
      toast.success(t.messages.activatingProtection);
      setAppState('loading');
      
    } catch (error) {
      toast.error(t.messages.protectionError);
      console.error('Protection activation error:', error);
    }
  };

  const handleActivateProtection = async () => {
    try {
      toast.success(t.messages.activatingProtection);
      setAppState('loading');
      
    } catch (error) {
      toast.error(t.messages.protectionError);
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
        return <LandingScreen onSubscribe={subscribed ? handleActivateProtection : handleSubscribe} />;
      case 'loading':
        return <LoadingScreen onComplete={handleLoadingComplete} />;
      case 'protected':
        return <ProtectionScreen onBack={handleBackToHome} />;
      default:
        return <LandingScreen onSubscribe={subscribed ? handleActivateProtection : handleSubscribe} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentScreen()}
    </div>
  );
};

export default Index;
