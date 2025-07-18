"use server";
import { db } from "@/server/db";
import { users, posts, sessions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const DeletePostAction = async (id: number) => {
  "use server";
  // For example, you might want to call an API to delete the user
    await db.delete(posts).where(eq(posts.id, id)).returning();
    revalidatePath("/admin/edit-blog");
};
