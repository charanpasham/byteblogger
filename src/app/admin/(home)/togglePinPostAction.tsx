"use server";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const TogglePinPostAction = async (formData: FormData) => {
  const id = Number(formData.get("postId"));
    const post = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (post.length === 0) {
      throw new Error("Post not found");
    }

    const maxResult = await db
    .select({ max: sql<number>`COALESCE(MAX(${posts.pinnedOrder}), 0)` })
    .from(posts)
    .where(eq(posts.isPinned, true));
    const max = maxResult[0]?.max ?? 0;
    if (post[0]?.isPinned) {
      await db.update(posts).set({ isPinned: false, pinnedOrder: null }).where(eq(posts.id, id));
    } else {
      await db.update(posts).set({ isPinned: true, pinnedOrder: max + 1 }).where(eq(posts.id, id));
    }
    revalidatePath("/admin");
};
