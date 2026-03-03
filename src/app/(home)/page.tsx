import { db } from "@/server/db";
import { posts, users } from "@/server/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { AboutMe } from "./aboutMe";
import { PostGrid } from "./postGrid";
import { RenderTags } from "./renderTags";
export const dynamic = "force-dynamic";

export default async function HomePage() {

  const blogPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(asc(posts.pinnedOrder), desc(posts.createdAt));


  const postGridMap = blogPosts.map(post => ({
    title: post.post.title,
    description: post.post.description ?? "",
    slug: post.post.slug,
    createdAt: post.post.createdAt,
    isPinned: post.post.isPinned,
    authorName: post.user?.name || "Unknown"
  }));

  return (
    <div className="flex flex-col gap-10 py-10 md:flex-row md:items-start">
      <div className="flex flex-col gap-5 md:w-1/3 md:max-w-xs md:shrink-0 md:sticky md:top-24">
        <AboutMe />
        <RenderTags />
      </div>
      <PostGrid posts={postGridMap} heading="Recent Posts" />
    </div>
  );
}
