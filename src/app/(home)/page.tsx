import { Alert } from "@/components/ui/alert";
import { db } from "@/server/db";
import { posts } from "@/server/db/schema";

export default async function HomePage() {
  const blogPosts = await db
    .select()
    .from(posts)
    .orderBy(posts.createdAt)
    .limit(5);
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        {blogPosts.length > 0 ? (
          <div className="w-full max-w-3xl space-y-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="rounded-lg border p-6 shadow-sm">
                <h2 className="mb-2 text-xl font-bold">{post.name}</h2>
                <p className="text-gray-600">
                  Created on: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <Alert>No blog posts available.</Alert>
        )}
      </div>
    </main>
  );
}
