"use client";
import { Check, Copy, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { PROFILE } from "../profile";

const SUBJECT = "Hello from your blog";

export function EmailCard() {
  // Assembled after hydration so the full address isn't in the server HTML.
  const [email, setEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEmail(PROFILE.emailParts.join("@"));
  }, []);

  const copy = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
          <Mail className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Email
          </p>
          <p className="truncate text-base font-semibold text-foreground sm:text-lg">
            {email ?? `${PROFILE.emailParts[0]} [at] ${PROFILE.emailParts[1]}`}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <a
          href={email ? `mailto:${email}?subject=${encodeURIComponent(SUBJECT)}` : undefined}
          aria-disabled={!email}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:opacity-90"
        >
          <Mail className="h-4 w-4" />
          Send me an email
        </a>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!email}
          aria-live="polite"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background/70 px-5 text-sm font-medium text-foreground transition hover:bg-accent disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" /> Copy address
            </>
          )}
        </button>
      </div>
    </div>
  );
}
