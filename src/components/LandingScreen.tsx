
import { useState } from 'react';
import { Shield, Star, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LandingScreenProps {
  onSubscribe: () => void;
}

const LandingScreen = ({ onSubscribe }: LandingScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = () => {
    setIsLoading(true);
    setTimeout(() => {
      onSubscribe();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-shield-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-6 fade-in-up">
          <div className="flex justify-center">
            <div className="relative">
              <Shield 
                size={80} 
                className="text-primary shield-glow" 
                fill="currentColor"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              ShieldGuard
            </h1>
            <p className="text-muted-foreground text-lg">
              Ultimate Mobile Protection
            </p>
          </div>
        </div>

        {/* Features */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20 scale-in">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Lock className="text-primary" size={20} />
              <span className="text-sm">Advanced Security Protocols</span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="text-primary" size={20} />
              <span className="text-sm">Real-time Threat Detection</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="text-primary" size={20} />
              <span className="text-sm">24/7 Protection Monitoring</span>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <div className="text-center space-y-4 fade-in-up delay-300">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">$4.99</div>
            <div className="text-muted-foreground">per month</div>
            <div className="text-xs text-muted-foreground">Cancel anytime</div>
          </div>

          <Button 
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <>
                <Shield className="mr-2" size={20} />
                Subscribe Now
              </>
            )}
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="text-center space-y-2 text-xs text-muted-foreground fade-in-up delay-500">
          <div className="flex justify-center items-center space-x-4">
            <span>🔒 Secure Checkout</span>
            <span>💳 Stripe Protected</span>
          </div>
          <div>Trusted by thousands of users worldwide</div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
