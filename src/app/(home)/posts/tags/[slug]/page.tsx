import { AboutMe } from "@/app/(home)/aboutMe";
import { PostGrid } from "@/app/(home)/postGrid";
import { RenderTags } from "@/app/(home)/renderTags";
import { db } from "@/server/db";
import { posts, posttagmapping, posttags, users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

interface PostProps {
  params: Promise<{
    slug?: string;
  }>;
}

export default async function PostByTag({ params }: PostProps) {
  const { slug } = await params;
  if (!slug) {
    return <div className="container mx-auto px-4 py-16">Invalid tag</div>;
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
        eq(posttags.name, slug),
        eq(posts.isPublished, true)
      )
    )
    .orderBy(posts.createdAt);


  return (
      <div className="container flex flex-col md:flex-row gap-5 py-16">
        <div className="md:w-1/3 text-center flex flex-col gap-4">
            <AboutMe />
            <div className="flex flex-wrap gap-2 justify-center mt-4">
               <RenderTags />
            </div>

        </div>
          <PostGrid posts={postsByTag} heading={`Posts tagged with "${slug}"`} />
      </div>

  );
}
