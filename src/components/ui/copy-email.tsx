import { useCallback, useRef, useState } from "react";

type Props = {
  email: string;
  className?: string;
  compact?: boolean;
};

export function CopyEmail({ email, className = "", compact }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const onClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(email);
        showToast("Email copied to clipboard");
      } catch {
        showToast("Could not copy — tap to select");
      }
    },
    [email, showToast],
  );

  return (
    <>
      <button
        type="button"
        className={`contact-email-btn ${className}`.trim()}
        onClick={onClick}
        aria-label={`Copy ${email} to clipboard`}
      >
        {!compact && <span className="contact-email-label">Email</span>}
        <span
          className="contact-email-value"
          style={compact ? { fontSize: "0.875rem", color: "var(--accent)" } : undefined}
        >
          {email}
        </span>
        {!compact && (
          <span className="contact-email-hint">
            Click to copy — we reply within one business day
          </span>
        )}
      </button>
      {toast && (
        <div className="site-toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>
  );
}
