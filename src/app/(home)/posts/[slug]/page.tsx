import { db } from "@/server/db";
import { posts, users } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";
import ViewBlogPage from "./viewBlog";

interface PostProps {
  params: Promise<{
    slug?: string;
  }>;
}

export default async function PostsPage({ params }: PostProps) {
  const { slug } = await params;
  if (!slug) {
    return <div className="container mx-auto px-4 py-16">Invalid post slug</div>;
  }
  const post = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.slug, slug), eq(posts.isPublished, true)
      )
    )
    .leftJoin(users, eq(posts.userId, users.id))
    .limit(1);

  if (post.length === 0) {
    return <div className="container mx-auto px-4 py-16">Post not found</div>;
  }
  
  return (
    <>
      <ViewBlogPage content={post[0]?.post.content ?? ""} author={post[0]?.user?.name ?? ""} />
    </>
  );
}
