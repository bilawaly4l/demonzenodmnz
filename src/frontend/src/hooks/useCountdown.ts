import { useEffect, useState } from "react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export function useCountdown(targetDate: Date): CountdownResult {
  const targetTime = targetDate.getTime();

  function tick(): CountdownResult {
    const diff = targetTime - Date.now();
    if (diff <= 0)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      isExpired: false,
    };
  }

  const [remaining, setRemaining] = useState<CountdownResult>(tick);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = targetTime - Date.now();
      if (diff <= 0) {
        setRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
      } else {
        setRemaining({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
          isExpired: false,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return remaining;
}

/** Countdown to DMNZ launch on Blum — April 2, 2027 */
export function useDmnzLaunchCountdown() {
  return useCountdown(new Date("2027-04-02T00:00:00Z"));
}
