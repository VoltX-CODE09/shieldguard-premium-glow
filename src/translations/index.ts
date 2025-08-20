
export type Language = 'en' | 'no';

export const translations = {
  en: {
    // Landing Screen
    title: 'ShieldGuard',
    subtitle: 'Ultimate Mobile Protection',
    features: {
      security: 'Advanced security protocols',
      detection: 'Real-time threat detection',
      monitoring: '24/7 protection monitoring'
    },
    pricing: {
      from: 'From €4.99',
      perMonth: 'per month',
      cancelAnytime: 'Cancel anytime'
    },
    buttons: {
      subscribeNow: 'Subscribe Now',
      activateProtection: 'Activate Protection',
      manageSubscription: 'Manage Subscription'
    },
    status: {
      premiumActive: '✅ Premium Active',
      premiumDescription: 'You have full access to ShieldGuard protection'
    },
    trust: {
      secureCheckout: '🔒 Secure Checkout',
      stripeProtected: '💳 Stripe Protected',
      trustedBy: 'Trusted by thousands of users worldwide'
    },
    
    // Subscription Modal
    subscription: {
      title: 'Choose Subscription',
      monthly: 'Monthly',
      yearly: 'Annual',
      savings: 'Save 40%!',
      processing: 'Processing...',
      features: {
        security: 'Advanced security protocols',
        detection: 'Real-time threat detection',
        monitoring: '24/7 protection monitoring'
      }
    },
    
    // Messages
    messages: {
      loginFirst: 'Please log in first',
      checkoutError: 'Could not create checkout session',
      portalError: 'Could not open customer portal',
      generalError: 'Something went wrong. Please try again.',
      subscribeFirst: 'Please subscribe first to activate protection',
      activatingProtection: 'Activating protection...',
      protectionError: 'Failed to activate protection. Please try again.',
      paymentSuccess: 'Payment successful! Your subscription is now active.',
      paymentCancelled: 'Payment was cancelled. You can try again anytime.'
    }
  },
  no: {
    // Landing Screen
    title: 'ShieldGuard',
    subtitle: 'Ultimate Mobile Protection',
    features: {
      security: 'Avanserte sikkerhetsprotokoller',
      detection: 'Sanntids trusseldeteksjon',
      monitoring: '24/7 beskyttelsesovervåking'
    },
    pricing: {
      from: 'Fra €4,99',
      perMonth: 'per måned',
      cancelAnytime: 'Avbryt når som helst'
    },
    buttons: {
      subscribeNow: 'Abonner Nå',
      activateProtection: 'Aktiver Beskyttelse',
      manageSubscription: 'Administrer Abonnement'
    },
    status: {
      premiumActive: '✅ Premium Aktiv',
      premiumDescription: 'Du har full tilgang til ShieldGuard beskyttelse'
    },
    trust: {
      secureCheckout: '🔒 Sikker Checkout',
      stripeProtected: '💳 Stripe Beskyttet',
      trustedBy: 'Pålitelig av tusenvis av brukere verden over'
    },
    
    // Subscription Modal
    subscription: {
      title: 'Velg Abonnement',
      monthly: 'Månedlig',
      yearly: 'Årlig',
      savings: 'Spar 40%!',
      processing: 'Behandler...',
      features: {
        security: 'Avanserte sikkerhetsprotokoller',
        detection: 'Sanntids trusseldeteksjon',
        monitoring: '24/7 beskyttelsesovervåking'
      }
    },
    
    // Messages
    messages: {
      loginFirst: 'Vennligst logg inn først',
      checkoutError: 'Kunne ikke opprette checkout-økt',
      portalError: 'Kunne ikke åpne kundeportal',
      generalError: 'Noe gikk galt. Vennligst prøv igjen.',
      subscribeFirst: 'Vennligst abonner først for å aktivere beskyttelse',
      activatingProtection: 'Aktiverer beskyttelse...',
      protectionError: 'Kunne ikke aktivere beskyttelse. Vennligst prøv igjen.',
      paymentSuccess: 'Betaling vellykket! Ditt abonnement er nå aktivt.',
      paymentCancelled: 'Betaling ble avbrutt. Du kan prøve igjen når som helst.'
    }
  }
};

export const getTranslation = (language: Language) => translations[language];
