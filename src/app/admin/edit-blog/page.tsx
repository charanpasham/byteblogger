import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { auth } from "@/server/auth";
import { eq } from "drizzle-orm";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeletePost } from "./deletePost";
import { PinIcon, PinOff } from "lucide-react";
import { TogglePinPostAction } from "./togglePinPostAction";

export default async function EditPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="container mx-auto px-4 py-16">
        You are not authorized to view this page
      </div>
    );
  }
  const blogs = await db
    .select()
    .from(posts)
    .where((table) => eq(table.userId, session.user.id));
  if (blogs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        No blogs available for editing
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="mb-4 text-2xl font-bold">Edit Your Blogs</h1>
      <div className="flex gap-3 flex-col">
        {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <Link
                    href={`/admin/edit-blog/${blog.slug}`}
                    className="text-slate-500 hover:underline"
                    key={blog.id}
                  >
                  <CardTitle> {blog.title}</CardTitle>
                  <CardDescription>{blog.description}</CardDescription>
                </Link>
                <div className="flex items-center gap-4">
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
  );
}
