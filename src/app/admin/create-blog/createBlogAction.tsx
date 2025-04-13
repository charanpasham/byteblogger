"use server";
import { db } from "@/server/db";

import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export interface BlogResponse {
  id: string | null;
  isSlugTaken: boolean;
}

export async function CreateBlogAction(
  title: string,
  description: string | null,
  userId: string,
  slug: string,
): Promise<BlogResponse> {
  const blogs = await db
    .select()
    .from(posts)
    .where((table) => eq(table.slug, slug));

  if (blogs.length > 0) {
    return {
      id: null,
      isSlugTaken: true,
    } as BlogResponse;
  } else {
    const insertedPost = await db
      .insert(posts)
      .values({
        title,
        description,
        userId,
        slug,
      })
      .returning({ id: posts.id });
    return {
      id: insertedPost[0]?.id.toString(),
      isSlugTaken: false,
    } as BlogResponse;
  }
}
