import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
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

  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    with: {
      user: true,
      post_likes: true,
    }
  });

  if (!post) {
    return <div className="container mx-auto px-4 py-16">Post not found</div>;
  }
  
  return (
    <>
      <ViewBlogPage 
          content={post?.content ?? ""}
          author={post?.user?.name ?? ""}
          likedByUsers={post?.post_likes.map(like => like.userId) ?? []}
          postId={post?.id ?? 0}
          slugName={post?.slug ?? ""} 
          viewCount={post?.viewCount ?? 0} />
    </>
  );
}
