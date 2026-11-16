/**
 * Manga Platform - Money Domain Model
 * Represented as integer in minor units (e.g. cents, kobo, pence) + ISO 4217 currency.
 * Invariant: Never use floating-point numbers for money calculations.
 */

export interface Money {
  readonly amount: bigint; // minor units as bigint to avoid precision loss and overflow
  readonly currency: string; // ISO 4217 currency code (e.g., 'NGN', 'USD', 'EUR')
}

export class MoneyUtil {
  public static fromMinor(amount: number | bigint | string, currency: string): Money {
    const parsedAmount = typeof amount === 'bigint' ? amount : BigInt(amount);
    return {
      amount: parsedAmount,
      currency: currency.toUpperCase(),
    };
  }

  public static zero(currency: string): Money {
    return { amount: 0n, currency: currency.toUpperCase() };
  }

  public static add(a: Money, b: Money): Money {
    this.assertSameCurrency(a, b);
    return { amount: a.amount + b.amount, currency: a.currency };
  }

  public static subtract(a: Money, b: Money): Money {
    this.assertSameCurrency(a, b);
    return { amount: a.amount - b.amount, currency: a.currency };
  }

  public static multiply(money: Money, multiplier: number | bigint): Money {
    const factor = typeof multiplier === 'bigint' ? multiplier : BigInt(Math.round(multiplier));
    return { amount: money.amount * factor, currency: money.currency };
  }

  /**
   * Applies basis points (1 bps = 0.01% = 1/10,000) using banker's rounding or floor/round.
   */
  public static applyBasisPoints(money: Money, bps: number): Money {
    const numerator = money.amount * BigInt(bps);
    const denominator = 10000n;
    // Standard integer division with half-up rounding
    const quotient = numerator / denominator;
    const remainder = numerator % denominator;
    const roundUp = remainder * 2n >= denominator;
    return {
      amount: quotient + (roundUp ? 1n : 0n),
      currency: money.currency,
    };
  }

  public static isPositive(money: Money): boolean {
    return money.amount > 0n;
  }

  public static isZero(money: Money): boolean {
    return money.amount === 0n;
  }

  public static isNegative(money: Money): boolean {
    return money.amount < 0n;
  }

  public static compare(a: Money, b: Money): number {
    this.assertSameCurrency(a, b);
    if (a.amount < b.amount) return -1;
    if (a.amount > b.amount) return 1;
    return 0;
  }

  public static equals(a: Money, b: Money): boolean {
    return a.currency === b.currency && a.amount === b.amount;
  }

  private static assertSameCurrency(a: Money, b: Money): void {
    if (a.currency !== b.currency) {
      throw new Error(`Currency mismatch: ${a.currency} !== ${b.currency}`);
    }
  }
}
