/** Small „Coming soon” pill used on cards and menu items. */
export function ComingSoonBadge({ label, className = '' }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-blush px-2.5 py-0.5 font-sans text-xs font-medium tracking-normal text-muted normal-case ${className}`}
    >
      {label}
    </span>
  );
}

/**
 * Stand-in for a missing cover or product photo. Uses the universe accent colour
 * (`--accent`) so each universe still has its own feel. Never replace with invented art.
 */
export function ImagePlaceholder({
  label,
  title,
  aspect = 'aspect-[2/3]',
}: {
  label: string;
  title?: string;
  aspect?: string;
}) {
  return (
    <div
      className={`${aspect} flex w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--accent,var(--color-lavender))_28%,white),color-mix(in_oklab,var(--accent,var(--color-lavender))_10%,white)_70%)] p-6 text-center`}
    >
      {/* The title is already the card heading; hide the duplicate from screen readers. */}
      {title && (
        <span aria-hidden="true" className="font-display text-h3 text-ink">
          {title}
        </span>
      )}
      <span className="eyebrow text-muted">{label}</span>
    </div>
  );
}
