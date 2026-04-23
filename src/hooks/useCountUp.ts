import { useEffect, useRef, useState } from 'react';

// easeOutQuart — matches --ease-out-quart. Smooth, confident deceleration:
// value grows fast at first, then settles elegantly.
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Animate a number from its current displayed value to `target` over `duration`
 * milliseconds, using easeOutQuart (non-linear). Respects
 * `prefers-reduced-motion`: snaps instantly when reduced motion is on.
 *
 * If `target` changes mid-flight, the tween picks up from the current shown
 * value (no jump).
 */
export function useCountUp(target: number, duration = 900): number {
  const [display, setDisplay] = useState(target);

  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const fromRef = useRef(target);
  const toRef = useRef(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      currentRef.current = target;
      setDisplay(target);
      return;
    }

    if (toRef.current === target) return;

    fromRef.current = currentRef.current;
    toRef.current = target;
    startTimeRef.current = null;

    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);

    const tick = (ts: number) => {
      if (startTimeRef.current == null) startTimeRef.current = ts;
      const elapsed = ts - startTimeRef.current;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(t);
      const next = fromRef.current + (toRef.current - fromRef.current) * eased;
      currentRef.current = next;
      setDisplay(next);

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [target, duration]);

  return display;
}
