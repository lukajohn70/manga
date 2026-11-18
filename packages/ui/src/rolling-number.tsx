import * as React from 'react';

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export interface RollingNumberProps {
  /** The number or formatted string to display */
  value: number | string;
  /** Optional prefix symbol (e.g. '$') */
  prefix?: string;
  /** Optional suffix symbol (e.g. ' USD' or '%') */
  suffix?: string;
  /** Duration of roll animation per digit in ms. Default 650 */
  durationMs?: number;
  /** Stagger delay between adjacent digits in ms. Default 40 */
  staggerMs?: number;
  /** Stagger direction: 'ltr' (left to right) or 'rtl' (right to left). Default 'rtl' */
  staggerDirection?: 'ltr' | 'rtl';
  className?: string;
  style?: React.CSSProperties;
}

interface DigitColumnProps {
  char: string;
  delayMs: number;
  durationMs: number;
}

const DigitColumn: React.FC<DigitColumnProps> = ({ char, delayMs, durationMs }) => {
  const num = parseInt(char, 10);
  const isDigit = !isNaN(num) && char !== ' ';

  if (!isDigit) {
    return (
      <span
        style={{
          display: 'inline-block',
          verticalAlign: 'baseline',
          whiteSpace: 'pre',
        }}
      >
        {char}
      </span>
    );
  }

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        height: '1em',
        lineHeight: 1,
        overflow: 'hidden',
        verticalAlign: 'baseline',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          transform: `translate3d(0, -${num * 10}%, 0)`,
          transition: `transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
          willChange: 'transform',
        }}
      >
        {DIGITS.map((d) => (
          <span
            key={d}
            style={{
              height: '1em',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
};

export const RollingNumber: React.FC<RollingNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  durationMs = 650,
  staggerMs = 40,
  staggerDirection = 'rtl',
  className,
  style,
}) => {
  const stringValue = String(value);
  const chars = stringValue.split('');

  // Calculate delays for each digit based on staggerDirection
  const digitIndices: number[] = [];
  chars.forEach((c, idx) => {
    if (!isNaN(parseInt(c, 10)) && c !== ' ') {
      digitIndices.push(idx);
    }
  });

  const totalDigits = digitIndices.length;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum"',
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {prefix && <span style={{ marginRight: '0.1em' }}>{prefix}</span>}
      {chars.map((char, index) => {
        const orderInDigits = digitIndices.indexOf(index);
        let delay = 0;
        if (orderInDigits !== -1) {
          delay =
            staggerDirection === 'rtl'
              ? (totalDigits - 1 - orderInDigits) * staggerMs
              : orderInDigits * staggerMs;
        }

        return (
          <DigitColumn
            key={`${index}-${char}`}
            char={char}
            delayMs={delay}
            durationMs={durationMs}
          />
        );
      })}
      {suffix && <span style={{ marginLeft: '0.1em' }}>{suffix}</span>}
    </span>
  );
};
