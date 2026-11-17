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
        return { bg: '#FDF2F2', text: '#B3261E', border: '#F8B4B4' };
      case 'urgent':
        return { bg: '#FEF7ED', text: '#8F3B1F', border: '#FAD7A0' };
      default:
        return { bg: '#F0F6EE', text: '#4F6B3A', border: '#C2D6BC' };
    }
  };

  const { bg, text, border } = getStyle();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 9px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        fontVariantNumeric: 'tabular-nums',
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
