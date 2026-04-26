import { useCallback, useEffect, useState } from "react";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLive: boolean;
}

const LAUNCH_DATE = new Date("2028-04-02T00:00:00Z").getTime();

function calcTime(): CountdownTime {
  const diff = LAUNCH_DATE - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true };
  }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    isLive: false,
  };
}

export function useCountdown(): CountdownTime {
  const [time, setTime] = useState<CountdownTime>(calcTime);

  const tick = useCallback(() => setTime(calcTime()), []);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return time;
}
