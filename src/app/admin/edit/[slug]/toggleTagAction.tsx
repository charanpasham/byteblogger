"use server";
import { db } from "@/server/db";

import { posttagmapping } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function ToggleTagAction(
    postId: number,
    tagId: number,
    slug: string,
    shouldAssign: boolean,
): Promise<void> {
    console.log("ToggleTagAction called with:", { postId, tagId, slug, shouldAssign });

    const existingMapping = await db
        .select()
        .from(posttagmapping)
        .where(and(eq(posttagmapping.postId, postId), eq(posttagmapping.tagId, tagId)));
    
     console.log("Existing mapping:", existingMapping);
     if(shouldAssign && existingMapping.length > 0) {
        console.log("Mapping already exists, no action taken.");
        return;
    }
    if(!shouldAssign && existingMapping.length === 0) {
        console.log("Mapping does not exist, no action taken.");
        return;
    }
    
    if (shouldAssign) {
        await db.insert(posttagmapping).values({ postId: postId, tagId: tagId });
    } else {
        await db.delete(posttagmapping).where(and(eq(posttagmapping.postId, postId), eq(posttagmapping.tagId, tagId))
        ).returning();
    }
    revalidatePath(`/admin/edit/${slug}`);
}