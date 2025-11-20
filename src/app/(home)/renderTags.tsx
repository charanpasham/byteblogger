import { Badge } from "@/components/ui/badge";
import { db } from "@/server/db";
import { posttagmapping, posttags } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export async function RenderTags() {
  const postTags = await db.select({
    tagId: posttagmapping.tagId,
    tagName: posttags.name,
    tagSlug: posttags.tagSlug
  }).from(posttagmapping)
    .leftJoin(posttags, eq(posttagmapping.tagId, posttags.id));
    return postTags.map(pt => (
        <Link href={`/posts/tags/${pt.tagSlug}`} key={pt.tagId} >
          <Badge>{pt.tagName}</Badge>
        </Link>
    ));
}