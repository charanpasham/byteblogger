import { Alert } from "@/components/ui/alert";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server/db";
import { posts, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const blogPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(posts.createdAt)
    .limit(5);
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-1 px-4 py-16">
        {blogPosts.length > 0 ? (
          <>
            {blogPosts.map((post) => (
              <Link
                href={`/posts/${post.post.slug}`}
                key={post.post.id}
                className="w-full max-w-3xl space-y-3 p-5"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">{post.post.title}</CardTitle>
                    <CardDescription>{post.post.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <div className="text-gray-500 text-xs">
                      <p>{post.user?.name}</p>
                      {new Date(post.post.createdAt).toLocaleDateString()}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </>
        ) : (
          <Alert>No blog posts available.</Alert>
        )}
      </div>
    </main>
  );
}
