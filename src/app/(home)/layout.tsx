import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import Header from "../header";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Byte Blog",
  description: "My portfolio blog",
  icons: [{ rel: "icon", url: "https://o5vr90ifqp.ufs.sh/f/FbmnsVAMglOuNatcRLkKkBf47MEIOi59ZahprFvowVQlA6cW", sizes: "32x32" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  }
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={geist.variable}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/yxq7fwh.css"></link>
      </head>
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 antialiased text-foreground dark:from-slate-950 dark:to-slate-900">
        <main className="flex-auto min-w-0 mt-8 flex flex-col px-4 md:px-8 lg:px-10 max-w-5xl mx-auto">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SessionProvider>
              <Header />
              {children}
            </SessionProvider>
          </ThemeProvider>
          <footer className="mt-12 border-t border-border/60 pt-6 pb-8 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Byte Blog — All rights reserved.
          </footer>
        </main>
      </body>
    </html>
  );
}
