import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { posts, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { EyeIcon, EyeOff, PinIcon, PinOff } from "lucide-react";
import { DeletePost } from "./deletePost";
import { TogglePublishPostAction } from "./togglePublishPostAction";
import { TogglePinPostAction } from "./togglePinPostAction";
import { Button } from "@/components/ui/button";
export default async function Admin() {
  const session = await auth();
  if (!session) {
    redirect("api/auth/signin");
  }
  const userList = await db.select().from(users);
  const blogPosts = await db.select().from(posts);
  const blogs = await db
    .select()
    .from(posts)
    .where(eq(posts.userId, session.user.id))
    .orderBy(posts.createdAt);
  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your posts, tags, and profile.
          </p>
        </div>
        <Link href="/admin/create-blog">
          <Button variant="default" size="sm" className="cursor-pointer">
            Create new post
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-border/60 bg-card/80 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total users
            </CardTitle>
            <p className="text-2xl font-semibold">{userList.length}</p>
          </CardHeader>
        </Card>
        <Card className="border border-border/60 bg-card/80 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total posts
            </CardTitle>
            <p className="text-2xl font-semibold">{blogPosts.length}</p>
          </CardHeader>
        </Card>
        <Card className="border border-border/60 bg-card/80 shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Your posts
            </CardTitle>
            <p className="text-2xl font-semibold">{blogs.length}</p>
          </CardHeader>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Your posts
          </h2>
          {blogs.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {blogs.length} {blogs.length === 1 ? "entry" : "entries"}
            </span>
          )}
        </div>
        {blogs.length === 0 ? (
          <Card className="border-dashed bg-card/60">
            <CardContent className="py-6 text-sm text-muted-foreground">
              You haven&apos;t created any posts yet. Click{" "}
              <span className="font-medium text-foreground">Create new post</span> to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {blogs.map((blog) => (
              <Card
                key={blog.id}
                className="border border-border/60 bg-card/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 p-4">
                  <Link
                    href={`/admin/edit/${blog.slug}`}
                    className="flex-1 text-left"
                    key={blog.id}
                  >
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base font-semibold">
                        {blog.title || "Untitled post"}
                      </CardTitle>
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                      {blog.isPinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
                          <PinIcon className="h-3 w-3" />
                          Pinned
                        </span>
                      )}
                    </div>
                    <CardDescription className="mt-1 line-clamp-2 text-sm">
                      {blog.description || "No description yet."}
                    </CardDescription>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Last edited:{" "}
                      {blog.updatedAt ? blog.updatedAt.toLocaleString() : "N/A"}
                    </p>
                  </Link>
                  <div className="flex items-center gap-3">
                    <form action={TogglePublishPostAction}>
                      <input type="hidden" name="postId" value={blog.id} />
                      <button
                        type="submit"
                        className="cursor-pointer rounded-full border border-border/70 bg-background/60 p-1.5 hover:bg-background"
                        aria-label={blog.isPublished ? "Unpublish" : "Publish"}
                      >
                        {blog.isPublished ? (
                          <EyeIcon className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </form>
                    <form action={TogglePinPostAction}>
                      <input type="hidden" name="postId" value={blog.id} />
                      <button
                        type="submit"
                        aria-label="Toggle pin"
                        className="cursor-pointer rounded-full border border-border/70 bg-background/60 p-1.5 hover:bg-background"
                      >
                        {blog.isPinned ? (
                          <PinOff className="h-4 w-4 text-sky-500" />
                        ) : (
                          <PinIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </form>
                    <DeletePost postId={blog.id} />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
