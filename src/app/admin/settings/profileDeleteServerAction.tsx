"use server";
import { db } from "@/server/db";
import { users, accounts, sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";

export const ProfileDeleteServerAction = async (email: string) => {
  const user = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  const userId = user[0]?.id;
  if (!userId) {
    throw new Error("User not found");
  }
  const utapi = new UTApi();
  const imageName = `${userId}.jpg`;
  await Promise.all([
    utapi.deleteFiles([imageName]),
    db.delete(sessions).where(eq(sessions.userId, userId)),
    db.delete(accounts).where(eq(accounts.userId, userId)),
    db.delete(users).where(eq(users.id, userId)),
  ]);
  redirect("/");
};
