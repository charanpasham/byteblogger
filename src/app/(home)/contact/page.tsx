import { type Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { GitHubLogo, LinkedInLogo, PROFILE } from "../profile";
import { EmailCard } from "./emailCard";

export const metadata: Metadata = {
  title: `Contact · ${PROFILE.name}`,
  description: `Get in touch with ${PROFILE.name} about roles, projects, or anything on the blog.`,
};

const SOCIALS = [
  {
    label: "LinkedIn",
    handle: `in/${PROFILE.linkedinHandle}`,
    href: PROFILE.linkedin,
    icon: <LinkedInLogo className="h-5 w-5" />,
  },
  {
    label: "GitHub",
    handle: `@${PROFILE.githubHandle}`,
    href: PROFILE.github,
    icon: <GitHubLogo className="h-5 w-5" />,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl py-12 md:py-16">
      <div className="flex items-center gap-4">
        <Image
          src={PROFILE.photo}
          width={64}
          height={64}
          alt={`${PROFILE.name} profile photo`}
          className="h-14 w-14 rounded-full object-cover ring-2 ring-background shadow-md"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
            Contact
          </p>
          <p className="text-sm text-muted-foreground">{PROFILE.headline}</p>
        </div>
      </div>

      <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-[-0.015em] text-foreground md:text-5xl">
        Let&apos;s work together
      </h1>
      <p className="mt-4 max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">
        I&apos;m always happy to talk about new roles, interesting engineering problems, or
        anything I&apos;ve written here. Email is the best way to reach me.
      </p>

      <div className="mt-8">
        <EmailCard />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {SOCIALS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background text-foreground">
              {social.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">{social.label}</span>
              <span className="block truncate text-xs text-muted-foreground">{social.handle}</span>
            </span>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
          </a>
        ))}
      </div>
    </div>
  );
}
