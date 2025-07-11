
import { useState } from 'react';
import { Shield, Star, Lock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import SubscriptionModal from './SubscriptionModal';

interface LandingScreenProps {
  onSubscribe: () => void;
}

const LandingScreen = ({ onSubscribe }: LandingScreenProps) => {
  const { session, subscribed, checkSubscription } = useAuth();

  const handleManageSubscription = async () => {
    if (!session) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        toast.error('Kunne ikke åpne kundeportal');
        return;
      }

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      toast.error('Noe gikk galt. Vennligst prøv igjen.');
      console.error('Portal error:', error);
    }
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
              <span className="text-sm">Avanserte sikkerhetsprotokoller</span>
            </div>
            <div className="flex items-center space-x-3">
              <Zap className="text-primary" size={20} />
              <span className="text-sm">Sanntids trusseldeteksjon</span>
            </div>
            <div className="flex items-center space-x-3">
              <Star className="text-primary" size={20} />
              <span className="text-sm">24/7 beskyttelsesovervåking</span>
            </div>
          </div>
        </Card>

        {/* Subscription Status */}
        {subscribed && (
          <Card className="p-4 bg-primary/10 border-primary/30">
            <div className="text-center">
              <div className="text-primary font-semibold">✅ Premium Aktiv</div>
              <div className="text-xs text-muted-foreground mt-1">
                Du har full tilgang til ShieldGuard beskyttelse
              </div>
            </div>
          </Card>
        )}

        {/* Pricing */}
        <div className="text-center space-y-4 fade-in-up delay-300">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">Fra €4.99</div>
            <div className="text-muted-foreground">per måned</div>
            <div className="text-xs text-muted-foreground">Avbryt når som helst</div>
          </div>

          {subscribed ? (
            <div className="space-y-2">
              <Button 
                onClick={() => onSubscribe()}
                className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Shield className="mr-2" size={20} />
                Aktiver Beskyttelse
              </Button>
              <Button 
                onClick={handleManageSubscription}
                variant="outline"
                className="w-full border-primary/30 text-primary hover:bg-primary/10"
              >
                Administrer Abonnement
              </Button>
            </div>
          ) : (
            <SubscriptionModal>
              <Button className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Shield className="mr-2" size={20} />
                Abonner Nå
              </Button>
            </SubscriptionModal>
          )}
        </div>

        {/* Trust indicators */}
        <div className="text-center space-y-2 text-xs text-muted-foreground fade-in-up delay-500">
          <div className="flex justify-center items-center space-x-4">
            <span>🔒 Sikker Checkout</span>
            <span>💳 Stripe Beskyttet</span>
          </div>
          <div>Pålitelig av tusenvis av brukere verden over</div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
