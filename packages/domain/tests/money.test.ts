import { describe, it, expect } from 'vitest';
import { MoneyUtil } from '../src/money.js';

describe('Money Domain Invariants', () => {
  it('correctly handles minor units and prevents floating point errors', () => {
    // 0.1 + 0.2 floating point bug test
    const tenCents = MoneyUtil.fromMinor(10, 'NGN');
    const twentyCents = MoneyUtil.fromMinor(20, 'NGN');
    const sum = MoneyUtil.add(tenCents, twentyCents);

    expect(sum.amount).toBe(30n);
    expect(sum.currency).toBe('NGN');
  });

  it('rejects adding different currencies', () => {
    const naira = MoneyUtil.fromMinor(1000, 'NGN');
    const usd = MoneyUtil.fromMinor(1000, 'USD');

    expect(() => MoneyUtil.add(naira, usd)).toThrow('Currency mismatch: NGN !== USD');
  });

  it('calculates basis points commission accurately with half-up rounding', () => {
    // e.g. 500 bps = 5.00%
    const total = MoneyUtil.fromMinor(15500, 'NGN'); // 155.00 NGN
    const commission = MoneyUtil.applyBasisPoints(total, 500); // 5% of 15500 = 775

    expect(commission.amount).toBe(775n);
  });
});
