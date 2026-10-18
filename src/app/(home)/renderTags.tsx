import { Badge } from "@/components/ui/badge";
import { db } from "@/server/db";
import { posts, posttagmapping, posttags } from "@/server/db/schema";
import { and, asc, count, eq } from "drizzle-orm";
import Link from "next/link";

export async function RenderTags({ activeSlug }: { activeSlug?: string } = {}) {
  // One row per tag (not per post-tag mapping), counting only published posts
  // so every listed tag leads to a non-empty tag page.
  const postTags = await db
    .select({
      tagId: posttags.id,
      tagName: posttags.name,
      tagSlug: posttags.tagSlug,
      postCount: count(posts.id),
    })
    .from(posttags)
    .innerJoin(posttagmapping, eq(posttagmapping.tagId, posttags.id))
    .innerJoin(
      posts,
      and(eq(posts.id, posttagmapping.postId), eq(posts.isPublished, true)),
    )
    .groupBy(posttags.id, posttags.name, posttags.tagSlug)
    .orderBy(asc(posttags.name));

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
          <Link
            href={`/posts/tags/${pt.tagSlug}`}
            key={pt.tagId}
            aria-current={pt.tagSlug === activeSlug ? "page" : undefined}
          >
            <Badge
              variant={pt.tagSlug === activeSlug ? "default" : "secondary"}
              className="cursor-pointer gap-1.5"
            >
              {pt.tagName}
              <span className="opacity-60">{pt.postCount}</span>
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
