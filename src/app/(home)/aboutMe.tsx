import { ArrowUpRight, BadgeCheck, FileText, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { GitHubLogo, LinkedInLogo, PROFILE } from "./profile";
import { getCurrentResume } from "@/server/resume";

const CERTIFICATIONS = [
  {
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    earned: "Oct 2026",
    isNew: true,
    image:
      "https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png",
    verifyUrl:
      "https://www.credly.com/badges/2f228ed9-cad9-4a1e-af34-10f450b1867a/public_url",
  },
];

export async function AboutMe() {
  const resume = await getCurrentResume();

  return (
    <section
      aria-labelledby="about-heading"
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 shadow-sm"
    >
      {/* Soft brand glow behind the intro */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-400/25 via-indigo-400/20 to-fuchsia-400/10 blur-3xl"
      />

      <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[auto_1fr] md:gap-10 md:p-10">
        <div className="mx-auto h-32 w-32 shrink-0 rounded-full bg-gradient-to-tr from-sky-500 via-indigo-500 to-fuchsia-500 p-[3px] shadow-lg md:mx-0 md:h-40 md:w-40">
          <div className="h-full w-full rounded-full bg-background p-[3px]">
            <Image
              src={PROFILE.photo}
              width={160}
              height={160}
              priority
              alt={`${PROFILE.name} profile photo`}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>

        <div className="min-w-0 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
            {PROFILE.headline}
          </p>
          <h2
            id="about-heading"
            className="mt-2 font-serif text-3xl font-bold leading-tight tracking-[-0.015em] text-foreground md:text-4xl"
          >
            Hi, I&apos;m {PROFILE.name.split(" ")[0]} 👋
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground md:mx-0">
            A software engineer who loves turning ideas into real products. I enjoy
            exploring new tech, building polished experiences, and sharing what I learn
            here on Byte Blogger.
          </p>

          <ul className="mt-4 flex flex-wrap justify-center gap-1.5 md:justify-start" aria-label="Skills">
            {PROFILE.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-xs font-medium text-foreground/80"
              >
                {skill}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
            <Link
              href="/contact"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-90"
            >
              <Mail className="h-4 w-4" />
              Contact me
            </Link>
            {resume?.isVisible && (
              <a
                href={resume.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background/70 px-4 text-sm font-medium text-foreground transition hover:bg-accent"
              >
                <FileText className="h-4 w-4" />
                Resume
              </a>
            )}
            <Link
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background/70 px-4 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              <LinkedInLogo className="h-4 w-4" />
              LinkedIn
            </Link>
            <Link
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background/70 px-4 text-sm font-medium text-foreground transition hover:bg-accent"
            >
              <GitHubLogo className="h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>
      </div>

      {CERTIFICATIONS.length > 0 && (
        <div className="relative border-t border-border/60 bg-muted/30 px-6 py-5 sm:px-8 md:px-10">
          <h3 className="mb-3 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground md:justify-start">
            <BadgeCheck className="h-3.5 w-3.5" />
            Certifications
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {CERTIFICATIONS.map((cert) => (
              <li key={cert.verifyUrl}>
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-3 pr-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Image
                    src={cert.image}
                    width={64}
                    height={64}
                    alt={`${cert.name} badge`}
                    className="h-16 w-16 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-semibold leading-snug text-foreground">
                      {cert.name}
                      {cert.isNew && (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                          New
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {cert.issuer} · Earned {cert.earned}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-sky-600 group-hover:underline dark:text-sky-400">
                      Verify on Credly
                      <ArrowUpRight className="h-3 w-3" />
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
