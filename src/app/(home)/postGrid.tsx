import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
          <div className="flex w-full flex-col gap-4 md:w-2/3">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-base font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {heading}
                </h2>
                {posts.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {posts.length} {posts.length === 1 ? "post" : "posts"}
                  </span>
                )}
              </div>
              {posts.length > 0 ? (
                <div className="mt-2 space-y-3">
                  {posts.map((post) => (
                    <Link
                      href={`/posts/${post.slug}`}
                      key={post.slug}
                      className="block w-full max-w-3xl"
                    >
                      <Card className="border border-border/60 bg-card/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <CardHeader className="space-y-2">
                          <CardTitle className="flex items-start justify-between gap-2 text-lg font-semibold">
                            <span className="line-clamp-2">{post.title}</span>
                            {post.isPinned && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
                                <PinIcon className="h-3 w-3" />
                                Pinned
                              </span>
                            )}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {post.description}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
                          <p className="font-medium">
                            {post.authorName ?? "Unknown author"}
                          </p>
                          <p>
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString()
                              : "Unknown date"}
                          </p>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  No blog posts available yet. Check back soon!
                </p>
              )}
          </div>
    )
}