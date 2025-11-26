import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { requireAuth } from "@/lib/authGuard";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Ensure the user is authenticated
  await requireAuth();
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/yxq7fwh.css"></link>
      </head>
      <body className="dark:bg-[#1a1a1a] antialiased mx-4 mt-8">
        <main>
          <TooltipProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SessionProvider>
                {children}
                <Toaster />
              </SessionProvider>
            </ThemeProvider>
          </TooltipProvider>
        </main>

      </body>
    </html>
  );
}
