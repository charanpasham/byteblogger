import { PostGrid } from "@/app/(home)/postGrid";
import { RenderTags } from "@/app/(home)/renderTags";
import { db } from "@/server/db";
import { posts, posttagmapping, posttags, users } from "@/server/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PostProps {
  params: Promise<{
    slug?: string;
  }>;
}

export default async function PostByTag({ params }: PostProps) {
  const { slug } = await params;
  if (!slug) {
    return <div className="container mx-auto px-2 py-16 sm:px-4">Invalid tag</div>;
  }

  const [tag] = await db
    .select({ name: posttags.name })
    .from(posttags)
    .where(eq(posttags.tagSlug, slug))
    .limit(1);
  if (!tag) {
    notFound();
  }

  const postsByTag = await db.select(
    {
        title: posts.title ?? "",
        description: posts.description ?? "",
        slug: posts.slug ?? "",   
        createdAt: posts.createdAt,
        isPinned: posts.isPinned,
        authorName: users.name ?? ""
    }
  ).from(posttagmapping)
    .leftJoin(posts, eq(posttagmapping.postId, posts.id))
    .leftJoin(posttags, eq(posttagmapping.tagId, posttags.id))
    .leftJoin(users, eq(posts.userId, users.id))
    .where(
      and(
        eq(posttags.tagSlug, slug),
        eq(posts.isPublished, true)
      )
    )
    .orderBy(desc(posts.createdAt));


  return (
    <div className="flex flex-col gap-6 py-10">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All posts
      </Link>
      <div className="flex flex-col gap-10 md:flex-row md:items-start">
        <PostGrid posts={postsByTag} heading={`Tagged “${tag.name}”`} />
        <aside className="md:sticky md:top-24 md:w-64 md:shrink-0">
          <RenderTags activeSlug={slug} />
        </aside>
      </div>
    </div>
  );
}
