export interface SupportedLocale {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
  defaultCurrency: string;
}

export const supportedLocales: Record<string, SupportedLocale> = {
  'en-NG': { code: 'en-NG', name: 'English (Nigeria)', direction: 'ltr', defaultCurrency: 'NGN' },
  'en-US': { code: 'en-US', name: 'English (US)', direction: 'ltr', defaultCurrency: 'USD' },
  'en-GB': { code: 'en-GB', name: 'English (UK)', direction: 'ltr', defaultCurrency: 'GBP' },
  'fr-FR': { code: 'fr-FR', name: 'Français', direction: 'ltr', defaultCurrency: 'EUR' },
  'ar': { code: 'ar', name: 'العربية', direction: 'rtl', defaultCurrency: 'USD' },
};

export const defaultLocale = 'en-NG';
