import { defaultLocale } from './locales.js';

export class I18nFormatter {
  private locale: string;

  constructor(locale: string = defaultLocale) {
    this.locale = locale;
  }

  /**
   * Format money from minor units (e.g., kobo, cents) to localized currency string.
   */
  public formatMoney(amountMinor: bigint | number, currency: string): string {
    const minorUnits = typeof amountMinor === 'bigint' ? Number(amountMinor) : amountMinor;
    const majorUnits = minorUnits / 100;

    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(majorUnits);
  }

  /**
   * Format UTC ISO date to localized human-readable string.
   */
  public formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(this.locale, options ?? { dateStyle: 'medium', timeStyle: 'short' }).format(d);
  }
}
