
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Shield, Check, Settings } from 'lucide-react';
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
  const [showManageOptions, setShowManageOptions] = useState(false);
  const { session, checkSubscription, subscribed } = useAuth();
  const { language } = useLanguage();
  const t = getTranslation(language);

  const plans = [
    {
      id: 'monthly',
      name: t.subscription.monthly,
      price: '4,99',
      period: t.pricing.perMonth,
      totalPrice: 4.99,
      interval: 'day', // Changed to daily billing for monthly plan
      billingNote: language === 'no' ? 'Belastes daglig (€0,16 per dag)' : 'Charged daily (€0.16 per day)'
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
      
      // For daily billing, we need to calculate the daily amount
      const dailyAmount = selectedPlanData!.id === 'monthly' 
        ? Math.round((selectedPlanData!.totalPrice * 100) / 30) // Divide monthly price by 30 days
        : Math.round(selectedPlanData!.totalPrice * 100);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          priceAmount: dailyAmount,
          interval: selectedPlanData!.interval
        }
      });

      if (error) {
        toast.error(t.messages.checkoutError);
        console.error('Checkout error:', error);
        return;
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      // Check subscription status after a delay
      setTimeout(() => {
        checkSubscription();
      }, 2000);

      setIsOpen(false);
    } catch (error) {
      toast.error(t.messages.generalError);
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!session) {
      toast.error(t.messages.loginFirst);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        toast.error(language === 'no' ? 'Kunne ikke åpne abonnementshåndtering' : 'Could not open subscription management');
        console.error('Customer portal error:', error);
        return;
      }

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      toast.error(t.messages.generalError);
      console.error('Customer portal error:', error);
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
          {!subscribed ? (
            <>
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
                              {plan.billingNote && (
                                <div className="text-xs text-muted-foreground mt-1">{plan.billingNote}</div>
                              )}
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
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Shield size={24} />
                <span className="font-semibold">
                  {language === 'no' ? 'Abonnement aktivt' : 'Subscription Active'}
                </span>
              </div>
              <p className="text-muted-foreground">
                {language === 'no' ? 'Du har allerede et aktivt abonnement.' : 'You already have an active subscription.'}
              </p>
              
              {/* Hidden manage subscription option - requires clicking small settings icon */}
              <div className="flex justify-center">
                <button
                  onClick={() => setShowManageOptions(!showManageOptions)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  title={language === 'no' ? 'Abonnementshåndtering' : 'Subscription Management'}
                >
                  <Settings size={16} />
                </button>
              </div>
              
              {showManageOptions && (
                <div className="space-y-2 pt-2 border-t">
                  <Button
                    onClick={handleManageSubscription}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                  >
                    {language === 'no' ? 'Håndter abonnement' : 'Manage Subscription'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {language === 'no' 
                      ? 'Her kan du endre betalingsinformasjon eller si opp abonnementet'
                      : 'Here you can change payment info or cancel subscription'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

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
