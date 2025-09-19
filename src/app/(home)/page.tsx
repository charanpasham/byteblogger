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
import Image from "next/image";
import { GithubIcon } from "lucide-react";
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
      <div className="container flex flex-col gap-1 py-16">
        <p>
          Hi, I'm Charan! I'm a software engineer who loves turning ideas into reality through code. I love exploring new tech and sharing my journey here on Byte Blogger.
        </p>
        <Link href="https://github.com/charanpasham" target="_blank" className="mt-2">
          <Image src="/Github_Invertocat_Dark.svg" alt="GitHub Logo" width={32} height={32} className="dark:hidden" />
          <Image src="/Github_Invertocat_Light.svg" alt="GitHub Logo" width={32} height={32} className="hidden dark:block" />
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
  );
}
