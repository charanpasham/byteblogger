// lib/authGuard.ts
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return session;
}

// For server actions: throws instead of redirecting so callers can surface the error.
export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}
