"use server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { postLikes } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function ToggleLikeAction(postId: number, userId: string, slugName: string) {
    const session = await auth();
    if (!session) {
    redirect("/api/auth/signin");
    }
  const existingLike = await db
    .select()
    .from(postLikes)
    .where(
      and(
        eq(postLikes.postId, postId),
        eq(postLikes.userId, userId)
      )
    )
    .limit(1);

  if (existingLike.length > 0) {
    // If like exists, remove it (unlike)
    await db
      .delete(postLikes)
      .where(
        and(
          eq(postLikes.postId, postId),
          eq(postLikes.userId, userId)
        )
      );
  } else {
    // If like does not exist, add it (like)
    await db.insert(postLikes).values({
      postId: postId,
      userId: userId
    });
  }
  revalidatePath(`/posts/${slugName}`);
}