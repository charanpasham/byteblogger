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
      <div className="space-y-4">
        {blogs.map((blog) => (
          <Link
            href={`/admin/edit-blog/${blog.slug}`}
            className="text-blue-600 hover:underline"
            key={blog.id}
          >
            <Card>
              <CardHeader>
                <CardTitle> {blog.title}</CardTitle>
                <CardDescription>{blog.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
