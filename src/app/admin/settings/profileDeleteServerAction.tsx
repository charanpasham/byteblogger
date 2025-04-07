"use server";
import { db } from "@/server/db";
import { users, accounts, sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
export const ProfileDeleteServerAction = async (email: string) => {
  "use server";
  // For example, you might want to call an API to delete the user
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  const userId = user[0]?.id;
  if (!userId) {
    throw new Error("User not found");
  }

  // Delete the current users session.
  await db.delete(sessions).where(eq(sessions.userId, userId));
  // Delete the user account
  await db.delete(accounts).where(eq(accounts.userId, userId));
  await db.delete(users).where(eq(users.id, userId));
  redirect("/");
};
