"use server";
import { db } from "@/server/db";
import { posttags } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const DeleteTagAction = async (id: number) => {
  "use server";
  // For example, you might want to call an API to delete the user
    await db.delete(posttags).where(eq(posttags.id, id)).returning();
    revalidatePath("/admin/tags-management");
};
