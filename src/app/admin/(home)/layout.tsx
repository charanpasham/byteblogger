import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { Alert } from "@/components/ui/alert";

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
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <html lang="en" suppressHydrationWarning className={geist.variable}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/yxq7fwh.css"></link>
      </head>
      <body className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 antialiased text-foreground dark:from-slate-950 dark:to-slate-900">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarTrigger />
              <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-12 pt-8 md:px-8">
                {session.user.role !== "admin" ? (
                  <div className="flex flex-1 items-center justify-center">
                    <Alert
                      variant={"destructive"}
                      className="mx-auto w-full max-w-md"
                    >
                      <h2 className="text-lg font-bold">Access Denied</h2>
                      <p>You do not have permission to access this page.</p>
                    </Alert>
                  </div>
                ) : (
                  children
                )}
              </main>
            </SidebarProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
