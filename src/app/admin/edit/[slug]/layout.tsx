import "@/styles/globals.css";

import { type Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { requireAuth } from "@/lib/authGuard";
import { redirect } from "next/navigation";
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Ensure the user is authenticated and allowed to edit
  const session = await requireAuth();
  if (session.user?.role !== "admin") {
    redirect("/");
  }
  return (
    <html lang="en" suppressHydrationWarning className={fontVariables}>
      <body className="min-h-screen bg-background antialiased">
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
