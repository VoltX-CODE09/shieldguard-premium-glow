
import { useState, useEffect } from 'react';

export type Language = 'en' | 'no';

const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Try to detect user's preferred language
    const detectLanguage = (): Language => {
      // Check browser language
      const browserLang = navigator.language.toLowerCase();
      
      // Norwegian language codes
      if (browserLang.startsWith('no') || browserLang.startsWith('nb') || browserLang.startsWith('nn')) {
        return 'no';
      }
      
      // Check for Norwegian in accepted languages
      const acceptedLanguages = navigator.languages?.map(lang => lang.toLowerCase()) || [];
      for (const lang of acceptedLanguages) {
        if (lang.startsWith('no') || lang.startsWith('nb') || lang.startsWith('nn')) {
          return 'no';
        }
      }
      
      // Try to detect timezone (rough approximation for Norwegian users)
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone === 'Europe/Oslo' || timezone === 'Europe/Stockholm') {
          return 'no';
        }
      } catch (error) {
        console.log('Could not detect timezone');
      }
      
      // Default to English
      return 'en';
    };

    const detectedLanguage = detectLanguage();
    setLanguage(detectedLanguage);
    console.log(`Detected language: ${detectedLanguage}`);
  }, []);

  return { language };
};

export default useLanguage;
