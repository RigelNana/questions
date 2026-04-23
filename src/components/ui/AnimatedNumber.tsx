import { useCountUp } from '../../hooks/useCountUp';

interface AnimatedNumberProps {
  value: number;
  /** Animation duration in ms. Default 900. */
  duration?: number;
  /** Decimal places to show. Default 0 (integer). */
  decimals?: number;
  /** Appended after the number, e.g. "%". */
  suffix?: string;
  /** Prepended before the number. */
  prefix?: string;
  className?: string;
}

/**
 * Count-up animated number. Uses easeOutQuart for natural deceleration —
 * the count races in then settles. Respects `prefers-reduced-motion`.
 */
export function AnimatedNumber({
  value,
  duration = 900,
  decimals = 0,
  suffix = '',
  prefix = '',
  className,
}: AnimatedNumberProps) {
  const current = useCountUp(value, duration);
  const formatted =
    decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
  return (
    <span className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
