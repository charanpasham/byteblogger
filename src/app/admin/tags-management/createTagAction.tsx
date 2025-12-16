"use server";
import { db } from "@/server/db";
import { posttags } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const CreateTagAction = async (prevState: { error: string | null }, formData: FormData) => {
    const tagName = formData.get("tagName") as string;
    const tagSlug = formData.get("tagSlug") as string;
    if (!tagName || !tagSlug) {
        return {
            error: "Tag name and slug are required"
        };
    }
    const existingTag = await db
      .select()
      .from(posttags)
        .where(eq(posttags.name, tagName));
    if (existingTag.length > 0) {
        return {
            error: "Tag already exists"
        };
    }

    await db.insert(posttags).values({ name: tagName, tagSlug });
    revalidatePath("/admin/tags-management");
    return {
        error: null,
    };
}