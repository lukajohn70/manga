import * as React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export interface SlaTimerBadgeProps {
  label: string;
  deadlineIso: string;
}

export const SlaTimerBadge: React.FC<SlaTimerBadgeProps> = ({ label, deadlineIso }) => {
  const [timeLeft, setTimeLeft] = React.useState<string>('');
  const [urgency, setUrgency] = React.useState<'normal' | 'urgent' | 'breached'>('normal');

  React.useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const target = new Date(deadlineIso).getTime();
      const diffMs = target - now;

      if (diffMs <= 0) {
        setTimeLeft('SLA Overdue');
        setUrgency('breached');
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${hours}h ${minutes}m remaining`);
      if (hours < 12) {
        setUrgency('urgent');
      } else {
        setUrgency('normal');
      }
    };

    calculate();
    const interval = setInterval(calculate, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, [deadlineIso]);

  const getStyle = () => {
    switch (urgency) {
      case 'breached':
        return { bg: 'var(--status-bad-bg)', text: 'var(--status-bad)', border: 'var(--status-bad-border)' };
      case 'urgent':
        return { bg: 'var(--status-warn-bg)', text: 'var(--status-warn)', border: 'var(--status-warn-border)' };
      default:
        return { bg: 'var(--status-good-bg)', text: 'var(--status-good)', border: 'var(--status-good-border)' };
    }
  };

  const { bg, text, border } = getStyle();

  return (
    <div
      className="tabular-nums"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 9px',
        borderRadius: '999px',
        fontSize: '11px',
        fontWeight: 700,
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {urgency === 'urgent' || urgency === 'breached' ? (
        <AlertTriangle size={12} color={text} />
      ) : (
        <Clock size={12} color={text} />
      )}
      <span>{label}:</span>
      <span>{timeLeft}</span>
    </div>
  );
};
