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
