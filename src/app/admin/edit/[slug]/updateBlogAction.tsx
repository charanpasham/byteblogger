"use server";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { requireAdmin } from "@/lib/authGuard";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface PostDraft {
  title: string;
  description: string;
  content: string;
}

export interface SavePostResponse {
  isUpdated: boolean;
  updatedAt: string | null;
}

export async function SavePostAction(
  slug: string,
  draft: PostDraft,
): Promise<SavePostResponse> {
  const session = await requireAdmin();

  const updatedPost = await db
    .update(posts)
    .set({
      title: draft.title,
      description: draft.description,
      content: draft.content.replaceAll("language-typescriptreact", "typescript"),
    })
    .where(and(eq(posts.slug, slug), eq(posts.userId, session.user.id)))
    .returning({ updatedAt: posts.updatedAt });

  if (updatedPost.length === 0) {
    return { isUpdated: false, updatedAt: null };
  }

  revalidatePath(`/posts/${slug}`);
  return {
    isUpdated: true,
    updatedAt: updatedPost[0]?.updatedAt?.toISOString() ?? null,
  };
}

export async function SetPublishedAction(
  slug: string,
  isPublished: boolean,
): Promise<boolean> {
  const session = await requireAdmin();
  const where = and(eq(posts.slug, slug), eq(posts.userId, session.user.id));

  const [post] = await db
    .select({ publishedAt: posts.publishedAt })
    .from(posts)
    .where(where)
    .limit(1);
  if (!post) {
    return false;
  }

  await db
    .update(posts)
    .set({
      isPublished,
      // Keep the original publish date when re-publishing.
      publishedAt: isPublished ? (post.publishedAt ?? new Date()) : post.publishedAt,
    })
    .where(where);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/posts/${slug}`);
  return true;
}
