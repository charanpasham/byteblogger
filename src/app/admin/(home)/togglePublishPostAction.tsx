"use server";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const TogglePublishPostAction = async (formData: FormData) => {
    const id = Number(formData.get("postId"));
    const post = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (post.length === 0) {
      throw new Error("Post not found");
    }

    await db.update(posts).set({ isPublished: !post[0]?.isPublished }).where(eq(posts.id, id));

    revalidatePath("/admin/edit-blog");
};
