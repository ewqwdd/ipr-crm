import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  startDate: Date | string;
  duration: number;
  onFinish?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  startDate,
  duration,
  onFinish,
}) => {
  const [remaining, setRemaining] = useState<number>(() => {
    const now = new Date();
    const start = new Date(startDate);
    const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);
    return Math.max(duration - elapsed, 0);
  });

  useEffect(() => {
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onFinish?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return <div>{formatTime(remaining)}</div>;
};

export default CountdownTimer;
