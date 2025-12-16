"use server";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const DeletePostAction = async (id: number) => {
  await db.delete(posts).where(eq(posts.id, id)).returning();
  revalidatePath("/admin");
};
