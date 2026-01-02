import { useEffect, useRef, useCallback } from 'react';

interface UseInactivityTimeoutOptions {
  timeout: number; // Timeout in milliseconds (5 minutes = 300000)
  warningTime: number; // Warning time before logout in milliseconds (30 seconds = 30000)
  onLogout: () => void;
  onWarning?: (secondsRemaining: number) => void;
  enabled?: boolean;
}

export function useInactivityTimeout({
  timeout,
  warningTime,
  onLogout,
  onWarning,
  enabled = true,
}: UseInactivityTimeoutOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const warningShownRef = useRef<boolean>(false);

  const resetTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }

    warningShownRef.current = false;
    lastActivityRef.current = Date.now();

    if (!enabled) return;

    // Set warning timer
    const warningDelay = timeout - warningTime;
    warningTimeoutRef.current = setTimeout(() => {
      warningShownRef.current = true;
      const secondsRemaining = Math.ceil(warningTime / 1000);
      onWarning?.(secondsRemaining);
    }, warningDelay);

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      onLogout();
    }, timeout);
  }, [timeout, warningTime, onLogout, onWarning, enabled]);

  const handleActivity = useCallback(() => {
    // Only reset if warning hasn't been shown or if it's been more than 1 second since last activity
    const timeSinceLastActivity = Date.now() - lastActivityRef.current;
    if (timeSinceLastActivity > 1000) {
      resetTimer();
    }
  }, [resetTimer]);

  useEffect(() => {
    if (!enabled) {
      // Clear timers if disabled
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
        warningTimeoutRef.current = null;
      }
      return;
    }

    // Initial timer setup
    resetTimer();

    // Event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Also listen to visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleActivity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [enabled, handleActivity, resetTimer]);

  return {
    resetTimer,
    lastActivity: lastActivityRef.current,
  };
}

