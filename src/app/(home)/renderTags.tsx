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
  })
    .from(posttagmapping)
    .leftJoin(posttags, eq(posttagmapping.tagId, posttags.id));

  if (!postTags.length) {
    return null;
  }

  return (
    <div className="w-full rounded-xl border bg-card/60 p-4 text-left shadow-sm">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Browse by tag
      </p>
      <div className="flex flex-wrap gap-2">
        {postTags.map((pt) => (
          <Link href={`/posts/tags/${pt.tagSlug}`} key={pt.tagId}>
            <Badge variant="secondary" className="cursor-pointer">
              {pt.tagName}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}