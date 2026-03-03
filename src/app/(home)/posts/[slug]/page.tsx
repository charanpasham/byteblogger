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
    return (
      <div className="mx-auto max-w-3xl px-2 py-16 text-sm text-muted-foreground sm:px-4">
        Invalid post slug
      </div>
    );
  }

  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    with: {
      user: true,
      post_likes: true,
    }
  });

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-2 py-16 text-sm text-muted-foreground sm:px-4">
        Post not found
      </div>
    );
  }

  return (
    <div className="mx-auto min-w-0 max-w-3xl overflow-x-clip w-full px-2 py-10 sm:px-4">
      <ViewBlogPage
        content={post.content ?? ""}
        author={post.user?.name ?? ""}
        likedByUsers={post.post_likes.map((like) => like.userId) ?? []}
        postId={post.id ?? 0}
        slugName={post.slug ?? ""}
        viewCount={post.viewCount ?? 0}
      />
    </div>
  );
}
