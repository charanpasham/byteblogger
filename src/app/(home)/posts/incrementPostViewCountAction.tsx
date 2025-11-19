"use server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { postLikes, posts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function IncrementPostViewCount(postId: number, slugName: string) {
  const post = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

  if (post.length > 0) {
    await db
      .update(posts)
      .set({ viewCount: (post[0]?.viewCount ?? 0) + 1 })
      .where(eq(posts.id, postId));
  }

  revalidatePath(`/posts/${slugName}`);
}