
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useLanguage from '@/hooks/useLanguage';
import { getTranslation } from '@/translations';

interface SubscriptionModalProps {
  children: React.ReactNode;
}

const SubscriptionModal = ({ children }: SubscriptionModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { session, checkSubscription } = useAuth();
  const { language } = useLanguage();
  const t = getTranslation(language);

  const plans = [
    {
      id: 'monthly',
      name: t.subscription.monthly,
      price: '4,99',
      period: t.pricing.perMonth,
      totalPrice: 4.99,
      interval: 'month'
    },
    {
      id: 'yearly',
      name: t.subscription.yearly,
      price: '99,99',
      period: language === 'no' ? 'per år' : 'per year',
      totalPrice: 99.99,
      interval: 'year',
      savings: t.subscription.savings
    }
  ];

  const handleSubscribe = async () => {
    if (!session) {
      toast.error(t.messages.loginFirst);
      return;
    }

    setIsLoading(true);
    try {
      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          priceAmount: Math.round(selectedPlanData!.totalPrice * 100), // Convert to cents
          interval: selectedPlanData!.interval
        }
      });

      if (error) {
        toast.error(t.messages.checkoutError);
        console.error('Checkout error:', error);
        return;
      }

      // Redirect to Stripe checkout in the same window instead of popup
      // This prevents popup blocker issues
      window.location.href = data.url;
    } catch (error) {
      toast.error(t.messages.generalError);
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="text-primary" size={24} />
              <span>{t.subscription.title}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
            {plans.map((plan) => (
              <div key={plan.id} className="relative">
                <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                    : 'border-gray-200 hover:border-primary/50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={plan.id} id={plan.id} />
                    <label htmlFor={plan.id} className="flex-1 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg">€{plan.price}</div>
                          <div className="text-sm text-muted-foreground">{plan.period}</div>
                          <div className="text-sm font-medium">{plan.name}</div>
                        </div>
                        {plan.savings && (
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {plan.savings}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Check size={16} className="text-primary" />
              <span>{t.subscription.features.security}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Check size={16} className="text-primary" />
              <span>{t.subscription.features.detection}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Check size={16} className="text-primary" />
              <span>{t.subscription.features.monitoring}</span>
            </div>
          </div>

          <Button 
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-6 text-lg font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                <span>{t.subscription.processing}</span>
              </div>
            ) : (
              <>
                <Shield className="mr-2" size={20} />
                {t.buttons.subscribeNow}
              </>
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground space-y-1">
            <div className="flex justify-center items-center space-x-4">
              <span>{t.trust.secureCheckout}</span>
              <span>{t.trust.stripeProtected}</span>
            </div>
            <div>{t.pricing.cancelAnytime}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
