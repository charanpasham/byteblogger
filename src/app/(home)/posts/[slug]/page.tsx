import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import ViewBlogPage from "./viewBlog";

interface PostProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostsPage({ params }: PostProps) {
  const { slug } = await params;
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  if (post.length === 0) {
    return <div className="container mx-auto px-4 py-16">Post not found</div>;
  }
  return <ViewBlogPage content={post[0]?.content ?? ""} />;
}
