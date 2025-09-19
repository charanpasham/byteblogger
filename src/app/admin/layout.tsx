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
    <html lang="en" suppressHydrationWarning className={`${geist.variable} `}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/yxq7fwh.css"></link>
      </head>
      <body>
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
              {/* Main content area */}
              <main className="mx-auto py-5 md:w-auto md:min-w-[820px] lg:px-12">
                {session.user.role !== "admin" ? (
                  <Alert
                    variant={"destructive"}
                    className="mx-auto mt-10 w-full max-w-md"
                  >
                    <h2 className="text-lg font-bold">Access Denied</h2>
                    <p>You do not have permission to access this page.</p>
                  </Alert>
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
