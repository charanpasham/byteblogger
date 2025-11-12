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
import { Linkedin, LinkedinIcon, PinIcon } from "lucide-react";
import Link from "next/link";

import Image from "next/image";
export const dynamic = "force-dynamic";

export default async function HomePage() {

  const blogPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .leftJoin(users, eq(posts.userId, users.id))
    .orderBy(asc(posts.pinnedOrder), desc(posts.createdAt));
  return (
      <div className="container flex gap-1 py-16">
        <div className="flex flex-col gap-1 w-full md:w-2/3">
            <h2 className="mb-5 text-lg font-semibold">Recent Posts</h2>
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
          <div className="hidden md:w-1/3 md:pl-10 text-center md:flex md:flex-col gap-4">
            <h2 className="text-lg font-semibold">About Me</h2>
            <Image src="https://media.licdn.com/dms/image/v2/C5603AQGP6BIGUu9IfQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1542478223844?e=1764806400&v=beta&t=rJpa1VUEf1SkermJo8Cqx4crg6BY-yqIaZkKluMUOS8" width={200} height={200} alt="Profile Picture" className="rounded-full mx-auto" />
            <p>
              Hi, I'm Charan! I'm a software engineer who loves turning ideas into reality through code. I love exploring new tech and sharing my journey here on Byte Blogger.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="https://github.com/charanpasham" target="_blank" className="mt-2">
                <img src="https://o5vr90ifqp.ufs.sh/f/FbmnsVAMglOujcW2xTaZpedGxmtyVDbkN2o16rnWuF38LMXj" alt="GitHub Logo" className="dark:hidden w-6 h-6" />
                <img src="https://o5vr90ifqp.ufs.sh/f/FbmnsVAMglOu9aF1Dsv2F3nI1hoptZJCeXGs9arqwjWRmLVl" alt="GitHub Logo" className="hidden dark:block w-6 h-6" />
              </Link>
              <Link href="https://www.linkedin.com/in/scharan19/" target="_blank" className="mt-2">
                <Linkedin className="w-6 h-6" />
              </Link>
            </div>

          </div>
        </div>

  );
}
