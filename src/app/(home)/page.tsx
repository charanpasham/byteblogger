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
      <div className="container flex flex-col md:flex-row gap-5 py-16">
        <div className="md:w-1/3 text-center flex flex-col gap-4">
            <AboutMe />
            <div className="flex flex-wrap gap-2 justify-center mt-4">
               <RenderTags />
            </div>

        </div>
          <PostGrid posts={postGridMap} heading="Recent Posts" />
      </div>

  );
}
