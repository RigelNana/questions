interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 active-press ${
        checked ? 'bg-[var(--color-notion-accent)]' : 'bg-[var(--color-notion-border)]'
      }`}
      style={{ width: 44, height: 24, minWidth: 44, minHeight: 24 }}
    >
      <span
        className={`inline-block rounded-full bg-white shadow-sm ${
          checked ? 'translate-x-[22px]' : 'translate-x-[3px]'
        }`}
        style={{
          width: 18,
          height: 18,
          transition: 'translate 200ms var(--ease-emphasized)',
        }}
      />
    </button>
  );
}
