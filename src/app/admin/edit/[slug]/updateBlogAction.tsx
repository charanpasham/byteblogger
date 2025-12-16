"use server";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface BlogUpdateResponse {
  id: string | null;
  isUpdated: boolean;
}

export async function UpdateBlogAction(
  content: string,
  slug: string,
  userId: string,
  isPublished: boolean,
): Promise<BlogUpdateResponse> {
  const blogs = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.userId, userId)));

  if (blogs.length === 0) {
    return {
      isUpdated: false,
    } as BlogUpdateResponse;
  }

  const updatedPost = await db
    .update(posts)
    .set({
      content,
      isPublished,
    })
    .where(eq(posts.slug, slug))
    .returning({ id: posts.id });
  revalidatePath(`/admin/edit/${slug}`);
  return {
    id: updatedPost[0]?.id.toString(),
    isUpdated: true,
  } as BlogUpdateResponse;
}

export async function UpdateTitle(title: string, slug: string): Promise<void> {
  await db.update(posts).set({ title }).where(eq(posts.slug, slug));
  revalidatePath(`/admin/edit/${slug}`);
}

export async function UpdateDescription(description: string, slug: string): Promise<void> {
  await db.update(posts).set({ description }).where(eq(posts.slug, slug));
  revalidatePath(`/admin/edit/${slug}`);
}