import { useEffect, useRef } from 'react';

export const useIdleLogout = () => {
  
  const lastActivityRef = useRef(Date.now());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const IDLE_TIME_LIMIT = 60 * 60 * 1000;
  useEffect(() => {
  const handleMouseMove = () => {
    lastActivityRef.current = Date.now();
  };

  const checkIdle = () => {
    const now = Date.now();
    const idleTime = now - lastActivityRef.current;

    if (idleTime >= IDLE_TIME_LIMIT) {
      console.log('User idle too long — logging out.');
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/';
    }
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });

  intervalRef.current = setInterval(checkIdle, 5000);

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
}, []);
};