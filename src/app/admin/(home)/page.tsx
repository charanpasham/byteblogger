import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    .where((table) => eq(table.userId, session.user.id))
    .orderBy(posts.createdAt);
  // protect the admin page
  return (
    <main>
      <div className="container flex flex-col items-center justify-center gap-5 px-4 py-16">
        <div className="flex flex-col">
            <span>Number of Users: {userList.length}</span>
            <span>Total Blog Posts: {blogPosts.length}</span>
        </div>
        <div>
          <div className="flex items-center justify-between my-5">
            <h1 className="mb-4 text-2xl font-bold">Edit your blogs</h1>
            <Link href="/admin/create-blog">
              <Button variant="secondary" className="cursor-pointer">
                Create New Blog
              </Button>
            </Link>
          </div>

            <div className="flex gap-3 flex-col">
              {blogs.map((blog) => (
                  <Card key={blog.id}>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <Link
                          href={`/admin/edit/${blog.slug}`}
                          className="text-slate-500 hover:underline"
                          key={blog.id}
                        >
                        <CardTitle> {blog.title}</CardTitle>
                        <CardDescription className="flex flex-col gap-2 my-3">
                              <div className="text-lg">{blog.description}</div>
                              <div className="text-sm text-gray-500">Last edited: {blog.updatedAt?.toLocaleString()}</div>
                        </CardDescription>
                      </Link>
                      <div className="flex items-center gap-4">
                        <form action={TogglePublishPostAction}>
                          <button type="submit" className="cursor-pointer">
                            {blog.isPublished ? (
                                <EyeIcon className="h-6 w-6 text-green-500" />
                            ) : (
                                <EyeOff className="h-6 w-6 text-gray-400" />
                            )}

                          </button>
                          <input type="hidden" name="postId" value={blog.id} />
                        </form>
                    <form action={TogglePinPostAction}>
                        <input type="hidden" name="postId" value={blog.id} />
                        <button type="submit" aria-label="Toggle Pin">
                          {blog.isPinned ? (
                            <PinOff className="h-6 w-6 text-blue-500" />
                          ) : (
                            <PinIcon className="h-6 w-6 text-gray-400" />
                          )}
                        </button>
                      </form>
                        <DeletePost  postId={blog.id} />
                      </div>

                    </CardHeader>
                  </Card>
              ))}
            </div>
        </div>
      </div>
    </main>
  );
}
