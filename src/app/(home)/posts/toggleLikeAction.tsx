"use server";
import { requireAuth } from "@/lib/authGuard";
import { db } from "@/server/db";
import { postLikes } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function ToggleLikeAction(postId: number, userId: string, slugName: string) {
  await requireAuth();
  
  const existingLike = await db
    .select()
    .from(postLikes)
    .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
    .limit(1);

  if (existingLike.length > 0) {
    await db
      .delete(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
  } else {
    await db.insert(postLikes).values({
      postId,
      userId,
    });
  }
  revalidatePath(`/posts/${slugName}`);
}