import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { PinIcon } from "lucide-react";

type PostProps = {
    title: string | null;
    description: string | null;
    slug: string | null;
    createdAt: Date | null;
    isPinned: boolean | null;
    authorName: string | null;
}

export function PostGrid( { posts, heading}: { posts: PostProps[], heading: string } ) {
    return (
          <div className="flex flex-col gap-1 w-full md:w-2/3">
              <h2 className="mb-5 text-lg font-semibold">{heading}</h2>
              {posts.length > 0 ? (
                <>
                  {posts.map((post) => (
                    <Link
                      href={`/posts/${post.slug}`}
                      key={post.slug}
                      className="w-full max-w-3xl space-y-3 py-2"
                    >
                      <Card className="dark:bg-[#181818]">
                        <CardHeader>
                          <CardTitle className="text-xl font-semibold flex justify-between">
                            {post.title}
                            <PinIcon className={post.isPinned ? "h-4 w-4 text-blue-500" : "hidden"} />
                          </CardTitle>
                          <CardDescription>{post.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <div className="text-gray-500 text-xs">
                            <p>{post.authorName}</p>
                            { post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown date" }
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
    )
}