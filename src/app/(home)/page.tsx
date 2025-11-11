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
import { eq, desc, and, asc } from "drizzle-orm";
import { PinIcon } from "lucide-react";
import Link from "next/link";
export const dynamic = "force-dynamic";

export default async function HomePage() {

  const blogPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(asc(posts.pinnedOrder), desc(posts.createdAt));
  return (
      <div className="container flex flex-col gap-1 py-16">
        <p>
          Hi, I'm Charan! I'm a software engineer who loves turning ideas into reality through code. I love exploring new tech and sharing my journey here on Byte Blogger.
        </p>
        <Link href="https://github.com/charanpasham" target="_blank" className="mt-2">
          <img src="https://o5vr90ifqp.ufs.sh/f/FbmnsVAMglOujcW2xTaZpedGxmtyVDbkN2o16rnWuF38LMXj" alt="GitHub Logo" className="dark:hidden w-6 h-6" />
          <img src="https://o5vr90ifqp.ufs.sh/f/FbmnsVAMglOu9aF1Dsv2F3nI1hoptZJCeXGs9arqwjWRmLVl" alt="GitHub Logo" className="hidden dark:block w-6 h-6" />
        </Link>

        <h2 className="mt-10 mb-5 text-2xl font-bold">Recent Posts</h2>
        {blogPosts.length > 0 ? (
          <>
            {blogPosts.map((post) => (
              <Link
                href={`/posts/${post.post.slug}`}
                key={post.post.id}
                className="w-full max-w-3xl space-y-3 py-2"
              >
                <Card className="dark:bg-[#181818]">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold flex justify-between">
                      {post.post.title}
                      <PinIcon className={post.post.isPinned ? "h-4 w-4 text-blue-500" : "hidden"} />
                    </CardTitle>
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
  );
}
