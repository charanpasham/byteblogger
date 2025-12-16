"use server";
import { db } from "@/server/db";
import { posttags } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const DeleteTagAction = async (id: number) => {
  await db.delete(posttags).where(eq(posttags.id, id)).returning();
  revalidatePath("/admin/tags-management");
};
