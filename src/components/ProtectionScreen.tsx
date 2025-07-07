
import { useEffect, useState } from 'react';
import { Shield, Check, Lock, Wifi, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ProtectionScreenProps {
  onBack: () => void;
}

const ProtectionScreen = ({ onBack }: ProtectionScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setShowFeatures(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const protectionFeatures = [
    { icon: Lock, text: 'Data Encryption Active', status: 'protected' },
    { icon: Wifi, text: 'Network Security Enabled', status: 'protected' },
    { icon: Smartphone, text: 'Device Firewall Running', status: 'protected' },
  ];

  return (
    <div className="min-h-screen bg-success-gradient flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-green-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-8">
        {/* Main Shield - Protected State */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="relative inline-block">
            <Shield 
              size={120} 
              className="text-primary shield-glow" 
              fill="currentColor"
            />
            <div className="absolute inset-0 bg-primary/40 rounded-full blur-3xl"></div>
            
            {/* Success checkmark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background rounded-full p-2 scale-in">
                <Check 
                  size={24} 
                  className="text-primary" 
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className={`text-center space-y-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-3xl font-bold text-primary">
            Your phone is safe.
          </h1>
          <p className="text-muted-foreground text-lg">
            ShieldGuard protection is now active
          </p>
        </div>

        {/* Protection Status Cards */}
        {showFeatures && (
          <div className="space-y-3">
            {protectionFeatures.map((feature, index) => (
              <Card 
                key={index}
                className={`p-4 bg-card/50 backdrop-blur-sm border-primary/30 fade-in-up`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <feature.icon className="text-primary" size={20} />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <Check size={16} className="text-primary" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Status Bar */}
        {showFeatures && (
          <Card className="p-4 bg-primary/10 border-primary/30 fade-in-up delay-700">
            <div className="text-center space-y-2">
              <div className="text-primary font-semibold">Protection Level: Maximum</div>
              <div className="text-xs text-muted-foreground">
                Last scan: Just now • Next scan: Continuous
              </div>
            </div>
          </Card>
        )}

        {/* Action Button */}
        {showFeatures && (
          <div className="text-center fade-in-up delay-1000">
            <Button 
              onClick={onBack}
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
            >
              Return to Home
            </Button>
          </div>
        )}

        {/* Trust indicator */}
        <div className={`text-center text-xs text-muted-foreground transition-all duration-1000 delay-1000 ${showFeatures ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex justify-center items-center space-x-2">
            <Shield size={12} className="text-primary" />
            <span>Powered by ShieldGuard Security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectionScreen;
